__version__ = "0.1.0"

from flask import Flask
from flask_cors import CORS
from flask_migrate import upgrade
from flask_smorest import Blueprint

from bode.mail_service.sending import start_notify

from .config import Config
from .extensions import api, db, migrate
from .resources import tags, task_relations, tasks

CONFIG = Config()


def create_app():
    app = Flask(__name__)
    app.config["API_TITLE"] = "Bode"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.2"

    app.config["SQLALCHEMY_DATABASE_URI"] = CONFIG.DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    register_extensions(app)
    register_blueprints(app)

    with app.app_context():
        if CONFIG.AUTO_MIGRATE:
            upgrade()

    start_notify(app)

    return app


def register_extensions(app):
    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)
    CORS(app)
    return None


def register_blueprints(app):
    api_blueprint = Blueprint("api", "api", url_prefix="/api/v1")
    api_blueprint.register_blueprint(tasks.api.blueprint)
    api_blueprint.register_blueprint(tags.api.blueprint)
    api_blueprint.register_blueprint(task_relations.api.blueprint)

    app.register_blueprint(api_blueprint)
    return None
