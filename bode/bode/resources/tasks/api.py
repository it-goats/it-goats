from flask import abort
from flask.views import MethodView
from flask_smorest import Blueprint
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import DataError

from bode.models.task import Task
from bode.resources.tasks.schemas import TaskSchema

blueprint = Blueprint("tasks", "tasks", url_prefix="/tasks")


@blueprint.route("")
class Tasks(MethodView):
    @blueprint.response(200, TaskSchema(many=True))
    def get(self):
        return Task.query.all()

    @blueprint.arguments(TaskSchema)
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

    @blueprint.response(200, TaskSchema)
    def delete(self, task_id):
        try:
            return Task.delete(task_id)
        except NoResultFound:
            abort(404, message="Item not found.")
