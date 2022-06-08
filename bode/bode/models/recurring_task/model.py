import uuid

from sqlalchemy import Enum
from sqlalchemy.dialects.postgresql import UUID

from bode.app import db
from bode.models.enums import TaskStatus
from bode.models.utc_datetime import UTCDateTime


class RecurringTask(db.Model):
    __tablename__ = "recurring_tasks"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = db.Column(db.String(80), nullable=True)
    description = db.Column(db.String(1024), nullable=True)
    due_date = db.Column(UTCDateTime(), nullable=True)
    status = db.Column(Enum(*TaskStatus.list(), name="task_status"), nullable=True)

    main_task_id = db.Column(UUID(as_uuid=True), db.ForeignKey("tasks.id"), nullable=False)
    instance_key = db.Column(db.String(64), nullable=False)
    is_deleted = db.Column(db.Boolean(), nullable=False, server_default="false")

    def __repr__(self):
        return f'<RecurringTask {self.id} \n  parent_id="{self.main_task_id}">'
