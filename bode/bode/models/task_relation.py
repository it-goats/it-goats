import uuid

from enum import Enum

from sqlalchemy.dialects.postgresql import ENUM, UUID

from bode.app import db
from bode.models.task import Task


class RelationType(Enum):
    Dependent = "DEPENDENT"
    Interchangable = "INTERCHANGABLE"
    Subtask = "SUBTASK"

    @classmethod
    def list(cls):
        return [c.value for c in cls]


SYMMETRIC_RELATIONS = [RelationType.Interchangable.value]


class TaskRelation(db.Model):
    """
    Type meaning:
    T1 := first_task_id
    T2 := second_task_id

    type = SUBTASKS -> T2 is subtask of T1
    type = DEPENDENT -> T2 is dependent on T1
    type = INTERCHANGABLE -> T1 is interchangable with T2 and (T2, T1, INTERCHANGABLE) record is in the database
    """

    __tablename__ = "tasks_relations"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_task_id = db.Column(UUID(as_uuid=True), db.ForeignKey("tasks.id"), nullable=False)
    second_task_id = db.Column(UUID(as_uuid=True), db.ForeignKey("tasks.id"), nullable=False)
    type = db.Column(ENUM(*RelationType.list(), name="task_relation_type"), nullable=False)

    __table_args__ = (
        db.Index(
            "task_relations_index",
            first_task_id,
            second_task_id,
            unique=True,
        ),
        db.CheckConstraint("first_task_id <> second_task_id", name="self_relation_check"),
    )

    def create(**relation_data):
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

    def delete(relation_id):
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
        return TaskRelation.get_lhs_related_tasks(task_id) + TaskRelation.get_rhs_related_tasks(task_id)

    def __repr__(self):
        return f"""<TaskRelation
        {self.first_task_id} <{self.type}> {self.second_task_id}
        >"""
