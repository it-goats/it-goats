from dateutil import rrule
from marshmallow import EXCLUDE, ValidationError, fields, validate

from bode.models.enums import DirectedRelationType, TaskStatus
from bode.models.task_relation.actions import is_task_blocked
from bode.resources.base_schema import BaseSchema
from bode.resources.tags.schemas import TagInputSchema, TagSchema


def validate_rrule(rrule_str: str):
    try:
        rrule.rrulestr(rrule_str)
    except ValueError as error:
        raise ValidationError(str(error))


class TaskInputSchema(BaseSchema):
    class Meta:
        unknown = EXCLUDE

    description = fields.String(validate=validate.Length(0, 1024), default="")
    due_date = fields.DateTime(allow_none=True)
    rrule = fields.String(allow_none=True, required=False, validate=validate_rrule)
    status = fields.String(validate=validate.OneOf(TaskStatus.list()), default=TaskStatus.TODO.value)
    tags = fields.List(fields.Nested(TagInputSchema), default=[])
    title = fields.String(validate=validate.Length(1, 80), required=True)


class TaskSchema(BaseSchema):
    id = fields.UUID(dump_only=True)
    title = fields.String()
    description = fields.String()
    due_date = fields.DateTime()
    status = fields.String(validate=validate.OneOf(TaskStatus.list()))
    rrule = fields.String()
    is_blocked = fields.Function(lambda task: task.status != TaskStatus.DONE.value and is_task_blocked(task.id))
    tags = fields.List(fields.Nested(TagSchema))
    relation_types = fields.List(fields.String(validate=validate.OneOf(DirectedRelationType.list())))


class TaskFiltersSchema(BaseSchema):
    status = fields.String()
    tags = fields.List(fields.String())
    date_from = fields.DateTime()
    date_to = fields.DateTime()
    title = fields.String()
