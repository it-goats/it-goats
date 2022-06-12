from uuid import UUID

from flask.views import MethodView
from flask_smorest import Blueprint

from bode.models.task_relation.actions import get_relation_flow_graph
from bode.models.task_relation.model import TaskRelation
from bode.resources.tasks_relations_flow.schemas import (
    SimpleTaskRelationSchema,
    TaskRelationGraphSchema,
)

blueprint = Blueprint("task-relations-flow", "task-relations-flow", url_prefix="/task-relations-flow")


@blueprint.route("")
class TasksRelations(MethodView):
    @blueprint.response(200, SimpleTaskRelationSchema(many=True))
    def get(self):
        return TaskRelation.query.all()


@blueprint.route("/<task_id>")
class TasksFlowInRelationWith(MethodView):
    @blueprint.response(200, TaskRelationGraphSchema(many=True))
    def get(self, task_id: UUID):
        query_result = get_relation_flow_graph(task_id)

        return [
            {
                "task_vertex": task_vertex,
                "adjacency_list": [
                    {"task": task, "relation_type": relation_type} for task, relation_type in adjacency_list
                ],
            }
            for task_vertex, adjacency_list in query_result
        ]
