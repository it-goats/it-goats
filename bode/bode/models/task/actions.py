from sqlalchemy.exc import IntegrityError, NoResultFound

from bode.app import db
from bode.models.enums import DirectedRelationType, RelationType, TaskStatus
from bode.models.tag.actions import create_tag, get_tag_by_name
from bode.models.task.model import Task
from bode.models.task_relation.actions import (
    create_task_relation,
    delete_task_relation,
    get_related_tasks,
)


def add_relations_and_subtasks(task_data, task, type_of_operation):
    if type_of_operation == "creation":
        relation_key = "relations"
        subtask_key = "subtasks"

    if type_of_operation == "edition":
        relation_key = "relations_to_add"
        subtask_key = "subtasks_to_add"

    """Create specified relations"""
    relations_data = task_data.get(relation_key)
    if relations_data:
        for relation_data in relations_data:
            if relation_data["type"] == DirectedRelationType.Blocks.value:
                relation_input = {
                    "first_task_id": relation_data["task_id"],
                    "second_task_id": task.id,
                    "type": RelationType.Dependent.value,
                }
            if relation_data["type"] == DirectedRelationType.IsBlockedBy.value:
                relation_input = {
                    "first_task_id": task.id,
                    "second_task_id": relation_data["task_id"],
                    "type": RelationType.Dependent.value,
                }
            if relation_data["type"] == DirectedRelationType.Interchangable.value:
                relation_input = {
                    "first_task_id": task.id,
                    "second_task_id": relation_data["task_id"],
                    "type": RelationType.Interchangable.value,
                }
            create_task_relation(**relation_input)

    """Create specified subtasks"""
    subtasks_data = task_data.get(subtask_key)
    if subtasks_data:
        for subtask_title in subtasks_data:
            subtask_input = {"title": subtask_title}
            subtask = Task(**subtask_input)
            db.session.add(subtask)
            db.session.commit()
            subtask_relation_input = {"first_task_id": task.id, "second_task_id": subtask.id, "type": "SUBTASK"}
            create_task_relation(**subtask_relation_input)


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
    def is_interchangable_relation(relation):
        return relation.type == RelationType.Interchangable.value and str(relation.first_task_id) == task_id

    def is_subtask_relation(relation):
        return relation.type == RelationType.Subtask.value and str(relation.first_task_id) == task_id

    """Edit task data"""
    task = get_task(task_id)
    edit_task_keys = {"title", "description", "due_date", "status"}
    edit_task_data = {key: task_data[key] for key in task_data.keys() & edit_task_keys}
    for key, value in edit_task_data.items():
        setattr(task, key, value)
    db.session.commit()

    """If task is checked, check all interchangable tasks indirectly as well."""
    new_status = task_data.get("status")
    if new_status:
        if new_status != TaskStatus.TODO.value:
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

    """Delete tags"""
    tags_to_delete_data = task_data.get("tags_to_delete")
    if tags_to_delete_data:
        for tag_name in tags_to_delete_data:
            tag = get_tag_by_name(tag_name)
            if tag not in task.tags:
                raise NoResultFound
            task.tags.remove(tag)
            db.session.commit()

    """Add tags"""
    tags_to_add_data = task_data.get("tags_to_add")
    if tags_to_add_data:
        for tag_name in tags_to_add_data:
            tag = get_tag_by_name(tag_name)
            if tag is None:
                tag = create_tag(tag_name)
            if tag in task.tags:
                raise IntegrityError
            task.tags.append(tag)
            db.session.commit()

    """Delete relations"""
    relations_to_delete_data = task_data.get("relations_to_delete")
    if relations_to_delete_data:
        for relation_id in relations_to_delete_data:
            delete_task_relation(relation_id)

    add_relations_and_subtasks(task_data, task, "edition")

    return task


def get_task(task_id):
    return Task.query.get_or_404(task_id)


def create_task(**task_data):
    """Create task"""
    create_task_keys = {"title", "description", "due_date", "status"}
    create_task_data = {key: task_data[key] for key in task_data.keys() & create_task_keys}
    task = Task(**create_task_data)
    db.session.add(task)
    db.session.commit()

    """Add specified tags to task"""
    tags_data = task_data.get("tags")
    if tags_data:
        for tag_name in tags_data:
            tag = get_tag_by_name(tag_name)
            if tag is None:
                tag = create_tag(tag_name)
            task.tags.append(tag)
        db.session.commit()

    add_relations_and_subtasks(task_data, task, "creation")

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
