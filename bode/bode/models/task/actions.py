from sqlalchemy.exc import IntegrityError, NoResultFound

from bode.app import db
from bode.models.enums import RelationType, TaskStatus
from bode.models.tag.actions import create_tag, get_tag_by_name
from bode.models.task.model import Task
from bode.models.task_relation.actions import delete_task_relation, get_related_tasks


def delete_task(task_id):
    """Function deletes task, all it's relations and all it's subtasks recursively."""

    def is_subtask_relation(relation):
        return relation.type == RelationType.Subtask.value and str(relation.first_task_id) == task_id

    relation_task_pairs = get_related_tasks(task_id)

    for relation, related_task in relation_task_pairs:
        delete_task_relation(relation.id)
        if is_subtask_relation(relation):
            delete_task(str(related_task.id))

    task = get_task(task_id)
    db.session.delete(task)
    db.session.commit()
    return task


def edit_task(task_id, **task_data):
    """Function edits task. If task is checked, all interchangable tasks with status todo will be indirectly checked."""

    def is_interchangable_relation(relation):
        return relation.type == RelationType.Interchangable.value and str(relation.first_task_id) == task_id

    def is_subtask_relation(relation):
        return relation.type == RelationType.Subtask.value and str(relation.first_task_id) == task_id

    task = get_task(task_id)

    for key, value in task_data.items():
        if key == "tags":
            continue
        setattr(task, key, value)

    db.session.commit()

    if task_data["status"] != TaskStatus.TODO.value:
        for relation, related_task in get_related_tasks(task_id):
            if is_interchangable_relation(relation):
                if related_task.status != TaskStatus.TODO.value:
                    continue
                inter_task_data = {
                    "status": TaskStatus.INDIRECTLY_DONE.value,
                }
                edit_task(str(related_task.id), **inter_task_data)
            if is_subtask_relation(relation):
                if related_task.status == TaskStatus.DONE.value:
                    continue
                subtask_data = {
                    "status": TaskStatus.DONE.value,
                }
                edit_task(str(related_task.id), **subtask_data)

    return task


def get_task(task_id):
    return Task.query.get_or_404(task_id)


def create_task(**task_data):
    task = Task(**task_data)

    db.session.add(task)
    db.session.commit()

    return task


def add_tag_to_task(task_id, **tag_data):
    task = get_task(task_id)
    tag_name = tag_data["name"]
    tag = get_tag_by_name(tag_name)
    if tag is None:
        tag = create_tag(tag_name)

    if tag in task.tags:
        raise IntegrityError

    task.tags.append(tag)
    db.session.commit()

    return task


def remove_tag_from_task(task_id, **tag_data):
    task = get_task(task_id)
    tag_name = tag_data["name"]
    tag = get_tag_by_name(tag_name)

    if tag not in task.tags:
        raise NoResultFound

    task.tags.remove(tag)
    db.session.commit()

    return task
