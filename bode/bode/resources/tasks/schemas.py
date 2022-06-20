from dateutil import rrule
from marshmallow import EXCLUDE, ValidationError, fields, validate

from bode.models.enums import (
    DirectedRelationType,
    DirectedRelationTypeWithoutSubtaskAndSupertask,
    TaskStatus,
)
from bode.models.task_relation.actions import is_task_blocked
from bode.resources.base_schema import BaseSchema
from bode.resources.tags.schemas import TagSchema


class RelationInputSchema(BaseSchema):
    task_id = fields.UUID(required=True)
    type = fields.String(validate=validate.OneOf(DirectedRelationTypeWithoutSubtaskAndSupertask.list()), required=True)


def validate_rrule(rrule_str: str):
    try:
        rrule.rrulestr(rrule_str)
    except ValueError as error:
        raise ValidationError(str(error))


class TaskInputSchema(BaseSchema):
    class Meta:
        unknown = EXCLUDE

    title = fields.String(validate=validate.Length(1, 80), required=True)
    description = fields.String(validate=validate.Length(0, 1024), default="")
    due_date = fields.DateTime(allow_none=True)
    notify_before_minutes = fields.Integer(strict=True, validate=validate.Range(min=1), allow_none=True)
    rrule = fields.String(allow_none=True, required=False, validate=validate_rrule)
    status = fields.String(validate=validate.OneOf(TaskStatus.list()), default=TaskStatus.TODO.value)
    tags = fields.List(fields.String, default=[])
    relations = fields.List(fields.Nested(RelationInputSchema), default=[])
    subtasks = fields.List(fields.String, default=[])


class TaskEditionInputSchema(BaseSchema):
    class Meta:
        unknown = EXCLUDE

    title = fields.String(validate=validate.Length(1, 80))
    description = fields.String(validate=validate.Length(0, 1024), default="")
    due_date = fields.DateTime(allow_none=True)
    notify_before_minutes = fields.Integer(strict=True, validate=validate.Range(min=1), allow_none=True)
    rrule = fields.String(allow_none=True, required=False, validate=validate_rrule)
    status = fields.String(validate=validate.OneOf(TaskStatus.list()), default=TaskStatus.TODO.value)
    tags_to_add = fields.List(fields.String, default=[])
    tags_to_delete = fields.List(fields.String, default=[])
    relations_to_add = fields.List(fields.Nested(RelationInputSchema), default=[])
    relations_to_delete = fields.List(fields.String, default=[])
    subtasks_to_add = fields.List(fields.String, default=[])


class TaskSchema(BaseSchema):
    id = fields.UUID(dump_only=True)
    title = fields.String()
    description = fields.String()
    due_date = fields.DateTime()
    status = fields.String(validate=validate.OneOf(TaskStatus.list()))
    rrule = fields.String()
    notify_before_minutes = fields.Integer()
    is_blocked = fields.Function(lambda task: is_task_blocked(task.id))
    tags = fields.List(fields.Nested(TagSchema))
    relation_types = fields.List(fields.String(validate=validate.OneOf(DirectedRelationType.list())))


class TaskFiltersSchema(BaseSchema):
    status = fields.String()
    tags = fields.List(fields.String())
    date_from = fields.DateTime(required=True)
    date_to = fields.DateTime(required=True)
    title = fields.String()
