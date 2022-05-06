from flask.views import MethodView
from flask_smorest import Blueprint, abort
from psycopg2 import IntegrityError
from sqlalchemy import or_
from sqlalchemy.exc import DataError, NoResultFound

from bode.models import task_actions
from bode.models.tag import Tag
from bode.models.task import Task
from bode.resources.tags.schemas import TagInputSchema
from bode.resources.tasks.schemas import TaskInputSchema, TaskParamSchema, TaskSchema

blueprint = Blueprint("tasks", "tasks", url_prefix="/tasks")


@blueprint.route("")
class Tasks(MethodView):
    @blueprint.arguments(TaskParamSchema, location="query")
    @blueprint.response(200, TaskSchema(many=True))
    def get(self, params: TaskParamSchema):
        status = params.get("status")
        tags = params.get("tags")
        date_from = params.get("date_from")
        date_to = params.get("date_to")
        title = params.get("title")

        all_filters = []
        if status and status == "todo":
            all_filters.append(Task.is_done == False)  # noqa
        if title:
            all_filters.append(Task.title.ilike(f"%{title}%"))
        if date_from:
            all_filters.append(Task.due_date >= date_from)
        if date_to:
            all_filters.append(Task.due_date <= date_to)
        if tags:
            or_filters = [Task.tags.any(Tag.name == tag) for tag in tags]
            all_filters.append(or_(*or_filters))
        return Task.query.order_by(Task.is_done, Task.due_date).filter(*all_filters).all()

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
            return task_actions.edit_task(task_id, **task_data)
        except NoResultFound:
            abort(404, message="Item not found.")

    @blueprint.response(200, TaskSchema)
    def delete(self, task_id):
        try:
            return task_actions.delete_task(task_id)
        except NoResultFound:
            abort(404, message="Item not found.")


@blueprint.route("/<task_id>/tags")
class TaskTags(MethodView):
    @blueprint.arguments(TagInputSchema)
    @blueprint.response(200, TaskSchema)
    def post(self, tags_data, task_id):
        try:
            return Task.add_tag(task_id, **tags_data)
        except IntegrityError:
            abort(409, message="Tag already assigned to the task.")

    @blueprint.arguments(TagInputSchema)
    @blueprint.response(200, TaskSchema)
    def delete(self, tags_data, task_id):
        try:
            return Task.remove_tag(task_id, **tags_data)
        except NoResultFound:
            abort(404, message="The task is not assigned to the task.")
