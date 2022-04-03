from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.orm.exc import NoResultFound

from bode.models.task import Task
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
    @blueprint.response(201, TaskSchema)
    def delete(self, task_id):
        try:
            return Task.delete(task_id)
        except NoResultFound:
            abort(404, message="Item not found.")
