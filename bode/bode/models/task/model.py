import uuid

from sqlalchemy import Enum
from sqlalchemy.dialects.postgresql import UUID

from bode.extensions import db
from bode.models.enums import TaskStatus
from bode.models.tag.model import task_tag
from bode.models.utc_datetime import UTCDateTime
from bode.models.utils import get_directed_relation_type


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    description = db.Column(db.String(1024), nullable=False, server_default="")
    due_date = db.Column(UTCDateTime(), nullable=True)
    notify_before_minutes = db.Column(db.Integer(), nullable=True)
    rrule = db.Column(db.Text(), nullable=True)
    status = db.Column(Enum(*TaskStatus.list(), name="task_status"), nullable=False, server_default="TODO")
    title = db.Column(db.String(80), nullable=False)

    tags = db.relationship("Tag", secondary=task_tag, back_populates="task")

    lhs_relations = db.relationship("TaskRelation", primaryjoin="Task.id==TaskRelation.first_task_id")
    rhs_relations = db.relationship("TaskRelation", primaryjoin="Task.id==TaskRelation.second_task_id")

    __table_args__ = (db.CheckConstraint("notify_before_minutes > 0", name="positive_notify_before_minutes"),)

    @property
    def relations(self):
        self.lhs_relations + self.rhs_relations

    @property
    def relation_types(self):
        relations = self.lhs_relations + self.rhs_relations
        return {get_directed_relation_type(relation, self.id) for relation in relations}

    def __repr__(self):
        return f'<Task {self.id} \n  title="{self.title}" due date={str(self.due_date)} status={self.status}>'

    def __iter__(self):
        for column in Task.__table__.columns:
            yield (column.name, str(getattr(self, column.name)))
