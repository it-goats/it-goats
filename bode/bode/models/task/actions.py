from dateutil import rrule
from sqlalchemy.exc import IntegrityError, NoResultFound

from bode.app import db
from bode.models.enums import RelationType, TaskStatus
from bode.models.recurring_task.model import RecurringTask
from bode.models.tag.actions import create_tag, get_tag_by_name
from bode.models.task.model import Task
from bode.models.task_relation.actions import delete_task_relation, get_related_tasks
from bode.models.utils import make_recurring_task_data_from_task

recurring_task_parameters = ["due_date", "description", "status"]


def delete_task(task_id, instance_key=None):
    """Function deletes task, all it's relations and all it's subtasks recursively."""

    def is_subtask_relation(relation):
        return relation.type == RelationType.Subtask.value and str(relation.first_task_id) == task_id

    if instance_key is not None:
        task = get_task(task_id)
        recurring_task = RecurringTask.query.filter(
            RecurringTask.main_task_id == task_id, RecurringTask.instance_key == instance_key
        ).one_or_none()
        if recurring_task is None:
            recurring_task_data = make_recurring_task_data_from_task(task, int(instance_key))
            recurring_task_data["is_deleted"] = True
            recurring_task = RecurringTask(**recurring_task_data)
            db.session.add(recurring_task)
        else:
            recurring_task.is_deleted = True
        db.session.commit()
        return task

    relation_task_pairs = get_related_tasks(task_id)

    for relation, related_task in relation_task_pairs:
        delete_task_relation(relation.id)
        if is_subtask_relation(relation):
            delete_task(str(related_task.id))

    task = get_task(task_id)
    db.session.delete(task)
    db.session.commit()
    return task


def edit_task(task_id, **task_data):
    """Function edits task. If task is checked, all interchangable tasks with status todo will be indirectly checked."""

    def is_interchangable_relation(relation):
        return relation.type == RelationType.Interchangable.value and str(relation.first_task_id) == task_id

    def is_subtask_relation(relation):
        return relation.type == RelationType.Subtask.value and str(relation.first_task_id) == task_id

    task = get_task(task_id)

    recurring_task_data = {}

    for key, value in task_data.items():
        if task.rrule and key in recurring_task_parameters:
            recurring_task_data[key] = value
            continue
        if key == "tags" or key == "instance_key":
            continue
        setattr(task, key, value)

    if recurring_task_data:
        recurring_task_key = task_data["instance_key"]
        recurring_task = RecurringTask.query.filter(
            RecurringTask.main_task_id == task_id, RecurringTask.instance_key == recurring_task_key
        ).one_or_none()
        if recurring_task is not None:
            RecurringTask.edit(recurring_task.id, recurring_task_data)
        else:
            recurring_task_old_data = make_recurring_task_data_from_task(task, int(recurring_task_key))
            for key, value in recurring_task_data.items():
                recurring_task_old_data[key] = value
            recurring_task = RecurringTask(**recurring_task_old_data)
            db.session.add(recurring_task)
        db.session.commit()
        return task

    db.session.commit()

    if task_data["status"] != TaskStatus.TODO.value:
        for relation, related_task in get_related_tasks(task_id):
            if is_interchangable_relation(relation):
                if related_task.status != TaskStatus.TODO.value:
                    continue
                inter_task_data = {
                    "status": TaskStatus.INDIRECTLY_DONE.value,
                }
                edit_task(str(related_task.id), **inter_task_data)
            if is_subtask_relation(relation):
                if related_task.status == TaskStatus.DONE.value:
                    continue
                subtask_data = {
                    "status": TaskStatus.DONE.value,
                }
                edit_task(str(related_task.id), **subtask_data)

    return task


def get_task(task_id):
    return Task.query.get_or_404(task_id)


def make_task_from_reccuring_task(reccuring_task):
    task = get_task(reccuring_task.main_task_id).copy()
    for key in recurring_task_parameters:
        setattr(task, key, getattr(reccuring_task, key))
    task.instance_key = reccuring_task.instance_key
    return task


def get_tasks_from_rrule(task, after, before):
    rrule_object = rrule.rrulestr(task.rrule)
    instance_num = 1 if task.due_date == after else len(rrule_object.between(task.due_date, after)) + 2
    dates = rrule_object.between(after, before, inc=True)
    result = []
    for num, date in zip(range(instance_num, instance_num + len(dates)), dates):
        new_task = task.copy()
        new_task.due_date = date
        new_task.instance_key = num
        result.append(new_task)
    return result


def get_tasks_between(after, before):
    # tasks without rrule
    list1 = Task.query.filter(Task.rrule is None, Task.due_date >= after, Task.due_date <= before).all()

    # tasks from reccuring table
    recurring_tasks = RecurringTask.query.filter(
        not RecurringTask.is_deleted, RecurringTask.due_date >= after, RecurringTask.due_date <= before
    ).all()
    list2 = [make_task_from_reccuring_task(reccuring_task) for reccuring_task in recurring_tasks]

    # tasks from rrule
    rrule_tasks = Task.query.filter(Task.rrule is not None).all()
    list3 = [new_task for task in rrule_tasks for new_task in get_tasks_from_rrule(task, after, before)]

    return list1 + list2 + list3


def create_task(**task_data):
    task = Task(**task_data)

    db.session.add(task)
    db.session.commit()

    return task


def add_tag_to_task(task_id, **tag_data):
    task = get_task(task_id)
    tag_name = tag_data["name"]
    tag = get_tag_by_name(tag_name)
    if tag is None:
        tag = create_tag(tag_name)

    if tag in task.tags:
        raise IntegrityError

    task.tags.append(tag)
    db.session.commit()

    return task


def remove_tag_from_task(task_id, **tag_data):
    task = get_task(task_id)
    tag_name = tag_data["name"]
    tag = get_tag_by_name(tag_name)

    if tag not in task.tags:
        raise NoResultFound

    task.tags.remove(tag)
    db.session.commit()

    return task
