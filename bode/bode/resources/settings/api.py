from flask.views import MethodView
from flask_smorest import Blueprint

from bode.mail_service.sending import check_tasks_to_notify
from bode.models.notifications_data.model import NotificationsData
from bode.resources.settings.schemas import (
    OKSchema,
    SettingsInputSchema,
    SettingsSchema,
)

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


@blueprint.route("__secret_notifications_endpoint__")
class SettingSecret(MethodView):
    @blueprint.response(200, OKSchema)
    def post(self):
        check_tasks_to_notify()

        return {"ok": "ok"}
