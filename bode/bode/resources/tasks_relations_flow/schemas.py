from marshmallow import fields

from bode.resources.base_schema import BaseSchema
from bode.resources.tasks.schemas import TaskSchema


class SimpleTaskRelationSchema(BaseSchema):
    id = fields.UUID(dump_only=True)
    first_task_id = fields.UUID()
    second_task_id = fields.UUID()
    type = fields.String()


class TaskRelationGraphSchema(BaseSchema):
    task_vertex = fields.Nested(TaskSchema)
    adjacency_list = fields.List(fields.Tuple((fields.Nested(TaskSchema), fields.String())))
