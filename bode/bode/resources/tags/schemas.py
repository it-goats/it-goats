from marshmallow import EXCLUDE, fields, validate

from bode.resources.base_schema import BaseSchema


class TagInputSchema(BaseSchema):
    class Meta:
        unknown = EXCLUDE

    name = fields.String(validate=validate.Length(1, 80), required=True)


class TagSchema(BaseSchema):
    id = fields.UUID(dump_only=True)
    name = fields.String()
