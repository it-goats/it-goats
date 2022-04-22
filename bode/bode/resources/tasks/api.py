from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import DataError
from sqlalchemy.orm.exc import NoResultFound

from bode.models.task import Task
from bode.models.task_relation import TaskRelation
from bode.resources.tasks.schemas import TaskInputSchema, TaskSchema

blueprint = Blueprint("tasks", "tasks", url_prefix="/tasks")


@blueprint.route("")
class Tasks(MethodView):
    @blueprint.response(200, TaskSchema(many=True))
    def get(self):
        return Task.query.all()

    @blueprint.arguments(TaskInputSchema)
    @blueprint.response(201, TaskSchema)
    def post(self, task_data):
        return Task.create(**task_data)


@blueprint.route("/<task_id>")
class TasksById(MethodView):
    @blueprint.response(200, TaskSchema)
    def get(self, task_id):
        try:
            return Task.query.get(task_id) or abort(404)
        except DataError:
            abort(404)

    @blueprint.arguments(TaskInputSchema)
    @blueprint.response(200, TaskSchema)
    def put(self, task_data, task_id):
        try:
            return Task.edit(task_id, **task_data)
        except NoResultFound:
            abort(404, message="Item not found.")

    @blueprint.response(200, TaskSchema)
    def delete(self, task_id):
        try:
            return Task.delete(task_id)
        except NoResultFound:
            abort(404, message="Item not found.")


@blueprint.route("/<task_id>/<relation_type>")
class TasksRelatedByIdAndRelationType(MethodView):
    @blueprint.response(200, TaskSchema(many=True))
    def get(self, task_id, relation_type):
        try:
            return Task.query.join(TaskRelation.second_task_id).where(TaskRelation.first_task_id == task_id).where(
                TaskRelation.type == relation_type
            ).all() or abort(404)
        except DataError:
            abort(404)
