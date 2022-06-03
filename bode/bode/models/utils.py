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
