from marshmallow import EXCLUDE, fields, validate

from bode.models.task import TaskStatus
from bode.resources.base_schema import BaseSchema
from bode.resources.directed_relation_type import DirectedRelationType
from bode.resources.tags.schemas import TagInputSchema, TagSchema


class TaskInputSchema(BaseSchema):
    class Meta:
        unknown = EXCLUDE

    title = fields.String(validate=validate.Length(1, 80), required=True)
    description = fields.String(validate=validate.Length(0, 1024), default="")
    due_date = fields.DateTime(allow_none=True)
    status = fields.String(validate=validate.OneOf(TaskStatus.list()), default=TaskStatus.TODO)
    tags = fields.List(fields.Nested(TagInputSchema), default=[])


class TaskSchema(BaseSchema):
    id = fields.UUID(dump_only=True)
    title = fields.String()
    description = fields.String()
    due_date = fields.DateTime()
    status = fields.String()
    tags = fields.List(fields.Nested(TagSchema))
    relation_types = fields.List(fields.String(validate=validate.OneOf(DirectedRelationType.list())))
