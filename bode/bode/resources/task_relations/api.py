from uuid import UUID

from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import IntegrityError

from bode.models.task import Task
from bode.models.task_relation import RelationType, TaskRelation
from bode.resources.task_relations.schemas import (
    LHS_RELATION_TYPES,
    RHS_RELATION_TYPES,
    SYMMETRIC_RELATION_TYPES,
    DirectedRelationSchema,
    DirectedRelationType,
    RelatedTaskSchema,
    SimpleTaskRelationSchema,
    TaskRelationInputSchema,
)

blueprint = Blueprint("task-relations", "task-relations", url_prefix="/task-relations")


@blueprint.route("")
class TasksRelations(MethodView):
    @blueprint.arguments(TaskRelationInputSchema)
    @blueprint.response(201, SimpleTaskRelationSchema)
    def post(self, relation_data):
        try:
            return TaskRelation.create(**relation_data)
        except IntegrityError:
            abort(422, message="Relation already exists")

    @blueprint.response(200, SimpleTaskRelationSchema(many=True))
    def get(self):
        return TaskRelation.query.all()


@blueprint.route("/<relation_id>")
class TasksRelationsById(MethodView):
    @blueprint.response(200, SimpleTaskRelationSchema)
    def delete(self, relation_id):
        return TaskRelation.delete(relation_id)


@blueprint.route("/<task_id>")
class TasksInRelationWith(MethodView):
    def lhs_relation_filter(self, relation_type: str):
        match relation_type:
            case DirectedRelationType.DependsOn.value:
                return TaskRelation.type == RelationType.Dependent.value
            case DirectedRelationType.Subtask.value:
                return TaskRelation.type == RelationType.Subtask.value
            case DirectedRelationType.Interchangable.value:
                return TaskRelation.type == RelationType.Interchangable.value
            case _:
                return None

    def rhs_relation_filter(self, relation_type):
        match relation_type:
            case DirectedRelationType.IsDependentOn.value:
                return TaskRelation.type == RelationType.Dependent.value
            case DirectedRelationType.Supertask.value:
                return TaskRelation.type == RelationType.Subtask.value
            case DirectedRelationType.Interchangable.value:
                return TaskRelation.type == RelationType.Interchangable.value
            case _:
                return None

    def map_to_related_task_schema(self, relation: TaskRelation, task: Task):
        match relation.type:
            case RelationType.Dependent.value:
                type = (
                    DirectedRelationType.IsDependentOn.value
                    if task.id == relation.first_task_id
                    else DirectedRelationType.DependsOn.value
                )
            case RelationType.Subtask.value:
                type = (
                    DirectedRelationType.Supertask.value
                    if task.id == relation.first_task_id
                    else DirectedRelationType.Subtask.value
                )
            case _:
                type = DirectedRelationType.Interchangable.value

        return {"task": task, "relation_type": type, "relation_id": relation.id}

    @blueprint.arguments(DirectedRelationSchema, location="query")
    @blueprint.response(200, RelatedTaskSchema(many=True))
    def get(self, params: DirectedRelationSchema, task_id: UUID):
        relation_type = params.get("relation_type")

        query_result = []

        if not relation_type:
            query_result += TaskRelation.get_lhs_related_tasks(task_id)
            query_result += TaskRelation.get_rhs_related_tasks(
                task_id, [TaskRelation.type != RelationType.Interchangable.value]
            )

        elif relation_type in SYMMETRIC_RELATION_TYPES + LHS_RELATION_TYPES:
            query_result += TaskRelation.get_lhs_related_tasks(task_id, [self.lhs_relation_filter(relation_type)])

        elif relation_type in RHS_RELATION_TYPES:
            query_result += TaskRelation.get_rhs_related_tasks(task_id, [self.rhs_relation_filter(relation_type)])

        return map(lambda pair: self.map_to_related_task_schema(*pair), query_result)
