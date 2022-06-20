from dateutil import rrule, tz

from bode.models.enums import DirectedRelationType, RelationType


def get_directed_relation_type(relation, task_id):
    match relation.type:
        case RelationType.Dependent.value:
            if task_id == relation.first_task_id:
                return DirectedRelationType.IsBlockedBy.value
            return DirectedRelationType.Blocks.value
        case RelationType.Subtask.value:
            if task_id == relation.first_task_id:
                return DirectedRelationType.Supertask.value
            return DirectedRelationType.Subtask.value
        case _:
            return DirectedRelationType.Interchangable.value


def make_recurring_task_data_from_task(task, instance_key):
    recurring_task_data = {}
    recurring_task_data["title"] = task.title
    recurring_task_data["description"] = task.description
    recurring_task_data["status"] = task.status
    rrule_generator = rrule.rrulestr(task.rrule).xafter(
        task.due_date.replace(tzinfo=None), count=instance_key, inc=True
    )
    *_, due_date = rrule_generator
    recurring_task_data["due_date"] = due_date.replace(tzinfo=tz.UTC)
    recurring_task_data["instance_key"] = instance_key
    recurring_task_data["main_task_id"] = task.id
    recurring_task_data["is_deleted"] = False
    return recurring_task_data
