from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import IntegrityError

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
            return Tag.create(tag_data["name"])
        except IntegrityError:
            abort(409, message="Item already exists")


@blueprint.route("/<tag_id>")
class TagsById(MethodView):
    @blueprint.response(200, TagSchema)
    def delete(self, tag_id):
        return Tag.delete(tag_id)
