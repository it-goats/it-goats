from marshmallow import Schema, fields, validate


class TaskSchema(Schema):
    id = fields.UUID(dump_only=True)
    title = fields.String(validate=validate.Length(1, 80))
