from marshmallow import Schema, fields, validate


class TaskSchema(Schema):
    id = fields.UUID()
    title = fields.String(validate=validate.Length(1, 80))
