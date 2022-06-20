from flask.views import MethodView
from flask_smorest import Blueprint, abort
from psycopg2 import IntegrityError
from sqlalchemy import and_
from sqlalchemy.exc import DataError, NoResultFound
from sqlalchemy.orm.session import make_transient

from bode.models.enums import TaskStatus
from bode.models.recurring_task.model import RecurringTask
from bode.models.tag.model import Tag
from bode.models.task.actions import (
    add_tag_to_task,
    create_task,
    delete_task,
    edit_task,
    get_tasks_from_rrule,
    make_task_from_reccuring_task,
    remove_tag_from_task,
)
from bode.models.task.model import Task
from bode.resources.tags.schemas import TagInputSchema
from bode.resources.tasks.schemas import (
    TaskEditionInputSchema,
    TaskFiltersSchema,
    TaskInputSchema,
    TaskSchema,
)

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

        if date_from and date_to:
            all_filters = [Task.rrule == None]
        else:
            all_filters = []
        filters_reccuring_table = [RecurringTask.is_deleted == False]
        filters_without_dates = [Task.rrule != None]
        if status and status in TaskStatus.list():
            all_filters.append(Task.status == status)  # noqa
            filters_reccuring_table.append(RecurringTask.status == status)
            filters_without_dates.append(Task.status == status)
        if title:
            all_filters.append(Task.title.ilike(f"%{title}%"))
            filters_reccuring_table.append(RecurringTask.title.ilike(f"%{title}%"))
            filters_without_dates.append(Task.title.ilike(f"%{title}%"))
        if date_from:
            all_filters.append(Task.due_date >= date_from)
            filters_reccuring_table.append(RecurringTask.due_date >= date_from)
        if date_to:
            all_filters.append(Task.due_date <= date_to)
            filters_reccuring_table.append(RecurringTask.due_date <= date_to)
        if tags:
            or_filters = [Task.tags.any(Tag.name == tag) for tag in tags]
            all_filters.append(and_(*or_filters))
            filters_without_dates.append(and_(*or_filters))

        # tasks without rrule
        list1 = Task.query.order_by(Task.status, Task.due_date).filter(*all_filters).all()
        if not date_from or not date_to:
            result = []
            for task in list1:
                make_transient(task)
                recurring_task = RecurringTask.query.filter(
                    RecurringTask.instance_key == str(1), RecurringTask.main_task_id == task.id
                ).one_or_none()
                if recurring_task is not None:
                    task.status = recurring_task.status
                result.append(task)
            return result

        # tasks from reccuring table
        recurring_tasks = RecurringTask.query.filter(*filters_reccuring_table).all()
        list2 = [make_task_from_reccuring_task(reccuring_task) for reccuring_task in recurring_tasks]
        if tags:
            list2 = [task for task in list2 if len(set(task.tags) & set(tags)) > 0]

        # tasks from rrule
        rrule_tasks = Task.query.filter(*filters_without_dates).filter().all()
        list3 = [new_task for task in rrule_tasks for new_task in get_tasks_from_rrule(task, date_from, date_to)]

        all_elements = list1 + list2 + list3
        all_elements.sort(key=lambda task: task.due_date.replace(tzinfo=None))
        all_elements.sort(key=lambda task: task.status, reverse=True)
        return all_elements

    @blueprint.arguments(TaskInputSchema)
    @blueprint.response(201, TaskSchema)
    def post(self, task_data):
        return create_task(**task_data)


@blueprint.route("/<task_id>")
class TasksById(MethodView):
    @blueprint.response(200, TaskSchema)
    def get(self, task_id):
        try:
            task = Task.query.get(task_id) or abort(404)
            make_transient(task)
            recurring_task = RecurringTask.query.filter(
                RecurringTask.instance_key == str(1), RecurringTask.main_task_id == task.id
            ).one_or_none()
            if recurring_task is not None:
                task.status = recurring_task.status
            return task
        except DataError:
            abort(404)

    @blueprint.arguments(TaskEditionInputSchema)
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


def get_task(task_id):
    return Task.query.get_or_404(task_id)
