import uuid

from enum import Enum

from sqlalchemy.dialects.postgresql import ENUM, UUID

from bode.app import db


class RelationType(Enum):
    Dependent = "DEPENDENT"
    Interchangable = "INTERCHANGABLE"
    Subtask = "SUBTASK"

    @classmethod
    def list(cls):
        return [c.value for c in cls]


SYMMETRIC_RELATIONS = [RelationType.Interchangable.value]


class TaskRelation(db.Model):
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

    def __repr__(self):
        return f"""<TaskRelation
        {self.first_task_id} <{self.relationship}> {self.second_task_id}
        >"""