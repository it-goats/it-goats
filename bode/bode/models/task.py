import uuid

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.exc import NoResultFound

from bode.app import db
from bode.models.utc_datetime import UTCDateTime


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(1024), nullable=False, server_default="")
    due_date = db.Column(UTCDateTime(), nullable=True)
    done = db.Column(db.Boolean, nullable=False)

    def create(**task_data):
        task = Task(**task_data)

        db.session.add(task)
        db.session.commit()

        return task

    def edit(task_id, **task_data):
        task = Task.query.get(task_id)

        if task is None:
            raise NoResultFound

        task.title = task_data["title"]
        task.description = task_data["description"]
        task.due_date = task_data["due_date"]
        task.done = task_data["done"]

        db.session.commit()

        return task

    def delete(task_id):
        task = Task.query.get(task_id)

        if task is None:
            raise NoResultFound

        db.session.delete(task)
        db.session.commit()

        return task

    def __repr__(self):
        return f'<Task {self.id} \n  title="{self.title}">'
