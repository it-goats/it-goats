from marshmallow import ValidationError, fields, validate, validates_schema

from bode.models.task_relation import RelationType
from bode.resources.base_schema import BaseSchema
from bode.resources.directed_relation_type import DirectedRelationType
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


SYMMETRIC_RELATION_TYPES = [DirectedRelationType.Interchangable.value]
LHS_RELATION_TYPES = [DirectedRelationType.IsBlockedBy.value, DirectedRelationType.Subtask.value]
RHS_RELATION_TYPES = [DirectedRelationType.Blocks.value, DirectedRelationType.Supertask.value]


class DirectedRelationSchema(BaseSchema):
    relation_type = fields.String(validate=validate.OneOf(DirectedRelationType.list()), default=None)


class RelatedTaskSchema(BaseSchema):
    task = fields.Nested(TaskSchema)
    relation_type = fields.String(validate=validate.OneOf(DirectedRelationType.list()), required=True)
    relation_id = fields.UUID(dump_only=True)
