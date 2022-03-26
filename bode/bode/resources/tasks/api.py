from flask.views import MethodView
from flask_smorest import Blueprint

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
