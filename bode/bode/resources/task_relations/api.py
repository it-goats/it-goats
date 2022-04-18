from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import IntegrityError

from bode.models.task_relation import TaskRelation
from bode.resources.task_relations.schemas import (
    SimpleTaskRelationSchema,
    TaskRelationInputSchema,
)

blueprint = Blueprint("task-relations", "task-relations", url_prefix="/task-relations")


@blueprint.route("")
class TasksRelations(MethodView):
    @blueprint.arguments(TaskRelationInputSchema)
    @blueprint.response(201, SimpleTaskRelationSchema)
    def post(self, relation_data):
        try:
            return TaskRelation.create(**relation_data)
        except IntegrityError:
            abort(422, message="Relation already exists")


@blueprint.route("/<relation_id>")
class TasksRelationsById(MethodView):
    @blueprint.response(200, SimpleTaskRelationSchema)
    def delete(self, relation_id):
        return TaskRelation.delete(relation_id)
