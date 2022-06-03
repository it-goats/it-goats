from flask.views import MethodView
from flask_smorest import Blueprint, abort
from psycopg2 import IntegrityError
from sqlalchemy import and_
from sqlalchemy.exc import DataError, NoResultFound

from bode.models.enums import TaskStatus
from bode.models.tag.model import Tag
from bode.models.task.actions import (
    add_tag_to_task,
    create_task,
    delete_task,
    edit_task,
    remove_tag_from_task,
)
from bode.models.task.model import Task
from bode.resources.tags.schemas import TagInputSchema
from bode.resources.tasks.schemas import TaskFiltersSchema, TaskInputSchema, TaskSchema

blueprint = Blueprint("tasks", "tasks", url_prefix="/tasks")


@blueprint.route("")
class Tasks(MethodView):
    @blueprint.arguments(TaskFiltersSchema, location="query")
    @blueprint.response(200, TaskSchema(many=True))
    def get(self, params: TaskFiltersSchema):
        status = params.get("status")
        tags = params.get("tags")
        date_from = params.get("date_from")
        date_to = params.get("date_to")
        title = params.get("title")

        all_filters = []
        if status and status in TaskStatus.list():
            all_filters.append(Task.status == status)  # noqa
        if title:
            all_filters.append(Task.title.ilike(f"%{title}%"))
        if date_from:
            all_filters.append(Task.due_date >= date_from)
        if date_to:
            all_filters.append(Task.due_date <= date_to)
        if tags:
            or_filters = [Task.tags.any(Tag.name == tag) for tag in tags]
            all_filters.append(and_(*or_filters))
        return Task.query.order_by(Task.status, Task.due_date).filter(*all_filters).all()

    @blueprint.arguments(TaskInputSchema)
    @blueprint.response(201, TaskSchema)
    def post(self, task_data):
        return create_task(**task_data)


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
            return edit_task(task_id, **task_data)
        except NoResultFound:
            abort(404, message="Item not found.")

    @blueprint.response(200, TaskSchema)
    def delete(self, task_id):
        try:
            return delete_task(task_id)
        except NoResultFound:
            abort(404, message="Item not found.")


@blueprint.route("/<task_id>/tags")
class TaskTags(MethodView):
    @blueprint.arguments(TagInputSchema)
    @blueprint.response(200, TaskSchema)
    def post(self, tags_data, task_id):
        try:
            return add_tag_to_task(task_id, **tags_data)
        except IntegrityError:
            abort(409, message="Tag already assigned to the task.")

    @blueprint.arguments(TagInputSchema)
    @blueprint.response(200, TaskSchema)
    def delete(self, tags_data, task_id):
        try:
            return remove_tag_from_task(task_id, **tags_data)
        except NoResultFound:
            abort(404, message="The task is not assigned to the task.")
