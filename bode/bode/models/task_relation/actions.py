from bode.app import db
from bode.models.enums import SYMMETRIC_RELATIONS, RelationType, TaskStatus
from bode.models.task.model import Task
from bode.models.task_relation.model import TaskRelation


def create_task_relation(**relation_data):
    relation = TaskRelation(**relation_data)

    db.session.add(relation)
    if relation_data["type"] in SYMMETRIC_RELATIONS:
        symmetric_data = relation_data.copy()
        symmetric_data["first_task_id"] = relation_data["second_task_id"]
        symmetric_data["second_task_id"] = relation_data["first_task_id"]

        symmetric_relation = TaskRelation(**symmetric_data)
        db.session.add(symmetric_relation)

    db.session.commit()

    return relation


def delete_task_relation(relation_id):
    relation = TaskRelation.query.get_or_404(relation_id)

    if relation.type in SYMMETRIC_RELATIONS:
        symmetric_relation = TaskRelation.query.filter(
            TaskRelation.first_task_id == relation.second_task_id,
            TaskRelation.second_task_id == relation.first_task_id,
            TaskRelation.type == relation.type,
        ).one()

        db.session.delete(symmetric_relation)

    db.session.delete(relation)
    db.session.commit()

    return relation


def get_lhs_related_tasks(task_id, filters=list()):
    all_filters = [TaskRelation.first_task_id == task_id] + filters
    return (
        db.session.query(TaskRelation, Task)
        .filter(*all_filters)
        .join(Task, TaskRelation.second_task_id == Task.id)
        .all()
    )


def get_rhs_related_tasks(task_id, filters=list()):
    all_filters = [TaskRelation.second_task_id == task_id] + filters
    return (
        db.session.query(TaskRelation, Task)
        .filter(*all_filters)
        .join(Task, TaskRelation.first_task_id == Task.id)
        .all()
    )


def get_related_tasks(task_id):
    return get_lhs_related_tasks(task_id) + get_rhs_related_tasks(task_id)


def is_task_blocked(task_id):
    for relation, task in get_lhs_related_tasks(task_id):
        if relation.type == RelationType.Dependent.value and task.status == TaskStatus.TODO.value:
            return True
    return False
