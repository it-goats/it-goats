from marshmallow import fields

from bode.resources.base_schema import BaseSchema


class SettingsInputSchema(BaseSchema):
    email = fields.Email(required=True, allow_none=True)


class SettingsSchema(BaseSchema):
    email = fields.Email()


class OKSchema(BaseSchema):
    ok = fields.String()
