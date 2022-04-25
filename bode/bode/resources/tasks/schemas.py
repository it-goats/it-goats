from marshmallow import EXCLUDE, fields, validate

from bode.resources.base_schema import BaseSchema
from bode.resources.tags.schemas import TagInputSchema, TagSchema


class TaskInputSchema(BaseSchema):
    class Meta:
        unknown = EXCLUDE

    title = fields.String(validate=validate.Length(1, 80), required=True)
    description = fields.String(validate=validate.Length(0, 1024), default="")
    due_date = fields.DateTime(allow_none=True)
    is_done = fields.Boolean(default=False)
    tags = fields.List(fields.Nested(TagInputSchema), default=[])


class TaskSchema(BaseSchema):
    id = fields.UUID(dump_only=True)
    title = fields.String()
    description = fields.String()
    due_date = fields.DateTime()
    is_done = fields.Boolean()
    tags = fields.List(fields.Nested(TagSchema))
