from flask import Blueprint

blueprint = Blueprint('borgweb', __name__)

from . import index, logs, backup
