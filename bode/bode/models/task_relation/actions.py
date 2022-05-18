from sqlalchemy import or_

from bode.app import db
from bode.models.enums import SYMMETRIC_RELATIONS, RelationType, TaskStatus
from bode.models.task.model import Task
from bode.models.task_relation.model import TaskRelation
from bode.utils.graph import Graph


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


def get_transitive_interchangable_related_tasks(task_id, filters=list()):
    def get_distinct_uuids(uuids):
        return list(set(uuids))

    def get_relation_graph(relations):
        graph = Graph()
        uuids = []

        for relation in relations:
            first_task_id, second_task_id = relation.first_task_id, relation.second_task_id
            graph.add_edge(str(first_task_id), str(second_task_id))
            uuids.append(str(first_task_id))
            uuids.append(str(second_task_id))

        return graph, uuids

    def group_tasks_subsets():
        task_parent = graph.disjoint_sets.find(task_id) if task_id in parents.keys() else task_id
        tasks_subset = [key for key in parents.keys() if graph.disjoint_sets.find(key) == task_parent]
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
        .distinct(Task.id)
        .all()
    )
