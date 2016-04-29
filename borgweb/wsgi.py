#!/usr/bin/python3

DEBUG = False

from .app import create_app

application = create_app()

if __name__ == '__main__':
    application.run(debug=DEBUG)
