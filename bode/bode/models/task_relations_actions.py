from bode.app import db
from bode.models.task_relation import RelationType, TaskRelation
from bode.resources.task_relations.schemas import DirectedRelationType


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
            type = (
                DirectedRelationType.Blocks.value
                if task_id == relation.first_task_id
                else DirectedRelationType.IsBlockedBy.value
            )
        case RelationType.Subtask.value:
            type = (
                DirectedRelationType.Supertask.value
                if task_id == relation.first_task_id
                else DirectedRelationType.Subtask.value
            )
        case _:
            type = DirectedRelationType.Interchangable.value

    return type


def get_relation_types(task_id):
    filters = [TaskRelation.first_task_id == task_id or TaskRelation.second_task_id == task_id]
    relations = TaskRelation.query.filter(*filters).all()
    return {map_to_related_task_schema(relation, task_id) for relation in relations}
