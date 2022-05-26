import uuid

from sqlalchemy.dialects.postgresql import UUID

from bode.app import db

task_tag = db.Table(
    "task_tag", db.Column("task_id", db.ForeignKey("tasks.id")), db.Column("tag_id", db.ForeignKey("tags.id"))
)


class Tag(db.Model):
    __tablename__ = "tags"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(80), unique=True, nullable=False)

    task = db.relationship("Task", secondary=task_tag, back_populates="tags")

    def __repr__(self):
        return f'<Tag {self.id} \n  name="{self.name}">'
