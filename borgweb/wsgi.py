#!/usr/bin/python3

from .app import create_app

application = create_app()

if __name__ == '__main__':
    application.run(debug=True)
