from flask.views import MethodView
from flask_smorest import Blueprint, abort
from psycopg2 import DataError
from sqlalchemy.exc import IntegrityError

from bode.app import db
from bode.models.task import Task
from bode.models.task_relation import TaskRelation
from bode.resources.task_relations.schemas import (
    SimpleTaskRelationSchema,
    TaskRelationInputSchema,
    TasksRelatedSchema,
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

    @blueprint.response(200, SimpleTaskRelationSchema(many=True))
    def get(self):
        return TaskRelation.query.all()


@blueprint.route("/<relation_id>")
class TasksRelationsById(MethodView):
    @blueprint.response(200, SimpleTaskRelationSchema)
    def delete(self, relation_id):
        return TaskRelation.delete(relation_id)


@blueprint.route("/<task_id>/<relation_type>")
class TasksRelatedByIdAndRelationType(MethodView):
    @blueprint.response(200, TasksRelatedSchema(many=True))
    def get(self, task_id, relation_type):
        try:
            result = (
                db.session.query(TaskRelation.id, Task)
                .join(Task, Task.id == TaskRelation.second_task_id)
                .filter(TaskRelation.first_task_id == task_id)
                .filter(TaskRelation.type == relation_type)
                .all()
            )
            return [{"id": rel_id, "task": task} for rel_id, task in result]
        except DataError:
            abort(404)
