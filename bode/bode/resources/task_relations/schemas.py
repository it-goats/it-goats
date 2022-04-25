from marshmallow import ValidationError, fields, validate, validates_schema

from bode.models.task_relation import RelationType
from bode.resources.base_schema import BaseSchema
from bode.resources.tasks.schemas import TaskSchema


class TaskRelationInputSchema(BaseSchema):
    first_task_id = fields.UUID(required=True)
    second_task_id = fields.UUID(required=True)
    type = fields.String(validate=validate.OneOf(RelationType.list()), required=True)

    @validates_schema
    def validate_task_ids(self, data, **kwargs):
        if data["first_task_id"] == data["second_task_id"]:
            raise ValidationError("firstTaskId must be different than secondTaskId")


class SimpleTaskRelationSchema(BaseSchema):
    id = fields.UUID(dump_only=True)
    first_task_id = fields.UUID()
    second_task_id = fields.UUID()
    type = fields.String()


class TasksRelatedSchema(BaseSchema):
    id = fields.UUID(dump_only=True)
    task = fields.Nested(TaskSchema)
