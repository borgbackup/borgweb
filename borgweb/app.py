import os

from flask import Flask
from flask import g as flaskg

from .views import blueprint


def create_app():
    app = Flask(__name__)

    app.config.from_object('borgweb.config.Config')
    if os.environ.get('BORGWEB_CONFIG'):
        app.config.from_envvar('BORGWEB_CONFIG')

    app.register_blueprint(blueprint)

    app.jinja_env.globals['flaskg'] = flaskg

    return app

