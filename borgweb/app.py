import os

from flask import Flask, render_template
from flask import g as flaskg

from .views import blueprint

DEBUG = False


def err404(error):
    return render_template('error.html', error=error), 404


def create_app():
    app = Flask(__name__)

    app.config.from_object('borgweb.config.Config')
    if os.environ.get('BORGWEB_CONFIG'):
        app.config.from_envvar('BORGWEB_CONFIG')

    app.register_blueprint(blueprint)

    app.jinja_env.globals['flaskg'] = flaskg
    app.error_handler_spec[None][404] = err404

    return app


def main():
    application = create_app()
    application.run(debug=DEBUG)


if __name__ == '__main__':
    main()
