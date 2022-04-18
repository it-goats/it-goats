from flask import abort
from flask.views import MethodView
from flask_smorest import Blueprint
from sqlalchemy.exc import IntegrityError, NoResultFound

from bode.models.tag import Tag
from bode.resources.tags.schemas import TagInputSchema, TagSchema

blueprint = Blueprint("tags", "tags", url_prefix="/tags")


@blueprint.route("")
class Tags(MethodView):
    @blueprint.response(200, TagSchema(many=True))
    def get(self):
        return Tag.query.all()

    @blueprint.arguments(TagInputSchema)
    @blueprint.response(201, TagSchema)
    def post(self, tag_data):
        try:
            return Tag.create(**tag_data)
        except IntegrityError:
            abort(400)


@blueprint.route("/<tag_id>")
class TagsById(MethodView):
    @blueprint.response(200, TagSchema)
    def delete(self, tag_id):
        try:
            return Tag.delete(tag_id)
        except NoResultFound:
            abort(404)
