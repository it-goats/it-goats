from bode.app import db

task_tag = db.Table(
    "task_tag", db.Column("task_id", db.ForeignKey("tasks.id")), db.Column("tag_id", db.ForeignKey("tags.id"))
)
