from collections import defaultdict

from sqlalchemy import or_

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


class FindUnion:
    def __init__(self, uuids):
        self.parents = dict.fromkeys(uuids, -1)
        self.ranks = dict.fromkeys(uuids, 0)

    def find(self, x):
        if self.parents[x] == -1:
            return x

        self.parents[x] = self.find(self.parents[x])
        return self.parents[x]

    def union(self, x, y):
        parents = self.parents
        ranks = self.ranks

        x_root = self.find(x)
        y_root = self.find(y)

        if ranks[x_root] > ranks[y_root]:
            parents[y_root] = x_root
        elif ranks[x_root] < ranks[y_root]:
            parents[x_root] = y_root
        elif x_root != y_root:
            parents[y_root] = x_root
            ranks[x_root] += 1


class Graph:
    def __init__(self, V):
        self.V = V
        self.graph = defaultdict(list)

    def add_edge(self, u, v):
        self.graph[u].append(v)

    def compress(self, uuids):
        self.find_union = FindUnion(uuids)
        find, union = self.find_union.find, self.find_union.union

        for i in self.graph:
            for j in self.graph[i]:
                x = find(i)
                y = find(j)
                if x != y:
                    union(x, y)

        return self.find_union.parents


def get_transitive_interchangable_related_tasks(task_id, filters=list()):
    from bode.models.task import Task

    def get_unique_uuids(uuids):
        return list(set(uuids))

    all_interchangable_tasks = db.session.query(TaskRelation).filter(*filters).all()

    graph = Graph(len(all_interchangable_tasks))
    uuids = []

    for relation in all_interchangable_tasks:
        first_task_id, second_task_id = relation.first_task_id, relation.second_task_id
        graph.add_edge(str(first_task_id), str(second_task_id))
        uuids.append(str(first_task_id))
        uuids.append(str(second_task_id))

    parents = graph.compress(get_unique_uuids(uuids))

    interchangable_tasks = []
    task_parent = parents[task_id] if task_id in parents.keys() and parents[task_id] != -1 else task_id

    for key, val in parents.items():
        if task_parent == graph.find_union.find(key):
            interchangable_tasks.append(key)

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
