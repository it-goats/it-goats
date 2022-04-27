from enum import Enum

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


class DirectedRelationType(Enum):
    """Enum containing strings used for requesting relation types. It is used to handle unsymmetric relations."""

    IsDependentOn = "is_dependent_on"
    DependsOn = "depends_on"
    Subtask = "subtask"
    Supertask = "supertask"
    Interchangable = "interchangable"

    @classmethod
    def list(cls):
        return [c.value for c in cls]


SYMMETRIC_RELATION_TYPES = [DirectedRelationType.Interchangable.value]
LHS_RELATION_TYPES = [DirectedRelationType.DependsOn.value, DirectedRelationType.Subtask.value]
RHS_RELATION_TYPES = [DirectedRelationType.IsDependentOn.value, DirectedRelationType.Supertask.value]


class DirectedRelationSchema(BaseSchema):
    relation_type = fields.String(validate=validate.OneOf(DirectedRelationType.list()), default=None)


class RelatedTaskSchema(BaseSchema):
    task = fields.Nested(TaskSchema)
    relation_type = fields.String(validate=validate.OneOf(DirectedRelationType.list()), required=True)
    relation_id = fields.UUID(dump_only=True)
