import uuid

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.exc import IntegrityError, NoResultFound

from bode.app import db
from bode.models.tag import Tag
from bode.models.task_tag import task_tag
from bode.models.utc_datetime import UTCDateTime


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(1024), nullable=False, server_default="")
    due_date = db.Column(UTCDateTime(), nullable=True)
    is_done = db.Column(db.Boolean, nullable=False, server_default="false")

    tags = db.relationship("Tag", secondary=task_tag, back_populates="task")

    def get(task_id):
        return Task.query.get_or_404(task_id)

    def create(**task_data):
        task = Task(**task_data)

        db.session.add(task)
        db.session.commit()

        return task

    def add_tag(task_id, **tag_data):
        task = Task.get(task_id)
        tag_name = tag_data["name"]
        tag = Tag.get_by_name(tag_name)
        if tag is None:
            tag = Tag.create(tag_name)

        if tag in task.tags:
            raise IntegrityError

        task.tags.append(tag)
        db.session.commit()

        return task

    def remove_tag(task_id, **tag_data):
        task = Task.get(task_id)
        tag_name = tag_data["name"]
        tag = Tag.get_by_name(tag_name)

        if tag not in task.tags:
            raise NoResultFound

        task.tags.remove(tag)
        db.session.commit()

        return task

    def __repr__(self):
        return f'<Task {self.id} \n  title="{self.title}">'
