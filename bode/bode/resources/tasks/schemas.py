from marshmallow import fields, validate

from bode.resources.base_schema import BaseSchema


class TaskInputSchema(BaseSchema):
    title = fields.String(validate=validate.Length(1, 80), required=True)
    description = fields.String(validate=validate.Length(0, 1024), default="")
    due_date = fields.DateTime(allow_none=True)


class TaskSchema(BaseSchema):
    id = fields.UUID(dump_only=True)
    title = fields.String()
    description = fields.String()
    due_date = fields.DateTime()
