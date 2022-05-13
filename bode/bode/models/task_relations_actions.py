from sqlalchemy import or_

from bode.app import db
from bode.models.task_relation import RelationType, TaskRelation
from bode.resources.task_relations.schemas import DirectedRelationType
from bode.utils.graph import Graph


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


def get_transitive_interchangable_related_tasks(task_id, filters=list()):
    from bode.models.task import Task

    def get_distinct_uuids(uuids):
        return list(set(uuids))

    def get_relation_graph(relations):
        graph = Graph(len(all_interchangable_tasks))
        uuids = []

        for relation in relations:
            first_task_id, second_task_id = relation.first_task_id, relation.second_task_id
            graph.add_edge(str(first_task_id), str(second_task_id))
            uuids.append(str(first_task_id))
            uuids.append(str(second_task_id))

        return graph, uuids

    def group_tasks_subsets():
        task_parent = parents[task_id] if task_id in parents.keys() and parents[task_id] != -1 else task_id
        tasks_subset = []
        for key in parents.keys():
            if task_parent == graph.find_union.find(key):
                tasks_subset.append(key)
        return tasks_subset

    all_interchangable_tasks = db.session.query(TaskRelation).filter(*filters).all()

    graph, uuids = get_relation_graph(all_interchangable_tasks)
    parents = graph.union_subsets(get_distinct_uuids(uuids))
    interchangable_tasks = group_tasks_subsets()

    return (
        db.session.query(TaskRelation, Task)
        .filter(*filters)
        .filter(
            or_(
                TaskRelation.second_task_id.in_(interchangable_tasks),
                TaskRelation.first_task_id.in_(interchangable_tasks),
            )
        )
        .join(Task, TaskRelation.second_task_id == Task.id)
        .filter(Task.id != task_id)
        .distinct(Task.title)
        .all()
    )
