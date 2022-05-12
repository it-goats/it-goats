from bode.app import db
from bode.models.task import TaskStatus
from bode.models.task_relation import DirectedRelationType, RelationType, TaskRelation


def get_lhs_related_tasks(task_id, filters=list()):
    from bode.models.task import Task

    all_filters = [TaskRelation.first_task_id == task_id] + filters
    return (
        db.session.query(TaskRelation, Task)
        .filter(*all_filters)
        .join(Task, TaskRelation.second_task_id == Task.id)
        .all()
    )


def get_rhs_related_tasks(task_id, filters=list()):
    from bode.models.task import Task

    all_filters = [TaskRelation.second_task_id == task_id] + filters
    return (
        db.session.query(TaskRelation, Task)
        .filter(*all_filters)
        .join(Task, TaskRelation.first_task_id == Task.id)
        .all()
    )


def get_related_tasks(task_id):
    return get_lhs_related_tasks(task_id) + get_rhs_related_tasks(task_id)


def map_to_related_task_schema(relation: TaskRelation, task_id):
    match relation.type:
        case RelationType.Dependent.value:
            if task_id == relation.first_task_id:
                return DirectedRelationType.IsBlockedBy.value
            return DirectedRelationType.Blocks.value
        case RelationType.Subtask.value:
            if task_id == relation.first_task_id:
                return DirectedRelationType.Supertask.value
            return DirectedRelationType.Subtask.value
        case _:
            return DirectedRelationType.Interchangable.value


def get_relation_types(task_id):
    relations_lhs = db.session.query(TaskRelation).filter(TaskRelation.first_task_id == task_id).all()
    relations_rhs = db.session.query(TaskRelation).filter(TaskRelation.second_task_id == task_id).all()
    return {map_to_related_task_schema(relation, task_id) for relation in relations_lhs + relations_rhs}


def is_task_blocked(task_id):
    for relation, task in get_lhs_related_tasks(task_id):
        if relation.type == RelationType.Dependent.value and task.status == TaskStatus.TODO.value:
            return True
    return False
