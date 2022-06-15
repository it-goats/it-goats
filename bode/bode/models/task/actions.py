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


def edit_task(task_id, check_equivalence_class=True, **task_data):
    """
    Function edits task. If task is checked, all interchangable tasks with status todo will be indirectly checked.
    If task is checked, all subtask will be checked.
    """

    def is_interchangable_relation(relation, inter_task_id=task_id):
        return relation.type == RelationType.Interchangable.value and str(relation.first_task_id) == inter_task_id

    def is_subtask_relation(relation):
        return relation.type == RelationType.Subtask.value and str(relation.first_task_id) == task_id

    def get_equivalence_set(related_task_id, equivalence_set):
        for relation, related_task in get_related_tasks(related_task_id):
            if is_interchangable_relation(relation, related_task_id):
                if str(related_task.id) in equivalence_set.keys():
                    continue
                equivalence_set[str(related_task.id)] = related_task.status
                get_equivalence_set(str(related_task.id), equivalence_set)

    task = get_task(task_id)

    for key, value in task_data.items():
        if key == "tags":
            continue
        setattr(task, key, value)

    db.session.commit()

    for relation, related_task in get_related_tasks(task_id):
        if task_data["status"] != TaskStatus.TODO.value and is_subtask_relation(relation):
            if related_task.status == TaskStatus.DONE.value:
                continue
            subtask_data = {
                "status": TaskStatus.DONE.value,
            }
            edit_task(str(related_task.id), **subtask_data)

    if check_equivalence_class:
        equivalence_set = {}
        equivalence_set[task_id] = task_data["status"]
        get_equivalence_set(task_id, equivalence_set)
        if len(equivalence_set.keys()) == 1:
            return task
        new_status = (
            TaskStatus.INDIRECTLY_DONE.value
            if TaskStatus.DONE.value in equivalence_set.values()
            else TaskStatus.TODO.value
        )
        for related_task_id, related_task_status in equivalence_set.items():
            if related_task_status == TaskStatus.DONE.value:
                continue
            if related_task_status == new_status:
                continue
            inter_task_data = {
                "status": new_status,
            }
            edit_task(str(related_task_id), check_equivalence_class=False, **inter_task_data)

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
