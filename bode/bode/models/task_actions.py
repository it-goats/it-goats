from bode.app import db
from bode.models.task import Task
from bode.models.task_relation import RelationType, TaskRelation


def delete_task(task_id):
    """Function deletes task, all it's relations and all it's subtasks reursively."""

    def is_subtask_relation(relation, task_id):
        return relation.type == RelationType.Subtask.value and str(relation.first_task_id) == task_id

    relation_task_pairs = TaskRelation.get_related_tasks(task_id)

    for relation, related_task in relation_task_pairs:
        TaskRelation.delete(relation.id)
        if is_subtask_relation(relation, task_id):
            delete_task(str(related_task.id))

    task = Task.get(task_id)
    db.session.delete(task)
    db.session.commit()
    return task
