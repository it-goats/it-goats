import uuid

from sqlalchemy.dialects.postgresql import ENUM, UUID

from bode.app import db
from bode.models.enums import RelationType


class TaskRelation(db.Model):
    """
    Type meaning:
    T1 := first_task_id
    T2 := second_task_id

    type = SUBTASKS -> T2 is subtask of T1
    type = DEPENDENT -> T2 blocks T1
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

    def __repr__(self):
        return f"""<TaskRelation
        {self.first_task_id} <{self.type}> {self.second_task_id}
        >"""
