from enum import Enum


class DirectedRelationType(Enum):
    Blocks = "blocks"
    IsBlockedBy = "is_blocked_by"
    Subtask = "subtask"
    Supertask = "supertask"
    Interchangable = "interchangable"

    @classmethod
    def list(cls):
        return [c.value for c in cls]
