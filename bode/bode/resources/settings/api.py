from flask.views import MethodView
from flask_smorest import Blueprint

from bode.models.notifications_data.model import NotificationsData
from bode.resources.settings.schemas import SettingsInputSchema, SettingsSchema

blueprint = Blueprint("settings", "settings", url_prefix="/settings")


@blueprint.route("")
class Setting(MethodView):
    @blueprint.response(200, SettingsSchema)
    def get(self):
        return NotificationsData.get()

    @blueprint.arguments(SettingsInputSchema)
    @blueprint.response(201, SettingsSchema)
    def put(self, input):
        return NotificationsData.update_email(input["email"])
