import uuid

from sqlalchemy.dialects.postgresql import UUID

from bode.app import db
from bode.models.task_tag import task_tag


class Tag(db.Model):
    __tablename__ = "tags"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(80), unique=True, nullable=False)

    task = db.relationship("Task", secondary=task_tag, back_populates="tags")

    def create(tag_name):
        tag = Tag(name=tag_name)

        db.session.add(tag)
        db.session.commit()

        return tag

    def delete(tag_id):
        tag = Tag.query.get_or_404(tag_id)

        db.session.delete(tag)
        db.session.commit()

        return tag

    def get_by_name(tag_name):
        return Tag.query.filter(Tag.name == tag_name).first()

    def __repr__(self):
        return f'<Tag {self.id} \n  name="{self.name}">'
