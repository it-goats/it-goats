from marshmallow import fields

from bode.resources.base_schema import BaseSchema
from bode.resources.tasks.schemas import TaskSchema


class SimpleTaskRelationSchema(BaseSchema):
    id = fields.UUID(dump_only=True)
    first_task_id = fields.UUID()
    second_task_id = fields.UUID()
    type = fields.String()


class TaskRelationTuplesListSchema(BaseSchema):
    task = fields.Nested(TaskSchema)
    relation_type = fields.String()


class TaskRelationGraphSchema(BaseSchema):
    task_vertex = fields.Nested(TaskSchema)
    adjacency_list = fields.List(fields.Nested(TaskRelationTuplesListSchema))
