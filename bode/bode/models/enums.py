from enum import Enum


class TaskStatus(Enum):
    TODO = "TODO"
    INDIRECTLY_DONE = "INDIRECTLY_DONE"
    DONE = "DONE"

    @classmethod
    def list(cls):
        return [c.value for c in cls]


class RelationType(Enum):
    Dependent = "DEPENDENT"
    Interchangable = "INTERCHANGABLE"
    Subtask = "SUBTASK"

    @classmethod
    def list(cls):
        return [c.value for c in cls]


class DirectedRelationType(Enum):
    Blocks = "blocks"
    IsBlockedBy = "is_blocked_by"
    Subtask = "subtask"
    Supertask = "supertask"
    Interchangable = "interchangable"

    @classmethod
    def list(cls):
        return [c.value for c in cls]


SYMMETRIC_RELATIONS = [RelationType.Interchangable.value]
