import uuid

from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.exc import NoResultFound

from bode.app import db


class Tag(db.Model):
    __tablename__ = "tags"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task_id = db.Column(
        UUID(as_uuid=True), ForeignKey("tasks.id"), nullable=False
    )
    name = db.Column(db.String(80), unique=True, nullable=False)

    task = db.relationship("Task", back_populates="tags")

    def create(**tag_data):
        tag = Tag(**tag_data)

        db.session.add(tag)
        db.session.commit()

        return tag

    def delete(tag_id):
        tag = Tag.query.get(tag_id)

        if tag is None:
            raise NoResultFound

        db.session.delete(tag)
        db.session.commit()

        return tag

    def __repr__(self):
        return f'<Tag {self.id} \n  name="{self.name}">'
