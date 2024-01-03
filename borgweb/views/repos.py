"""
repos
"""

import subprocess
import time

from flask import current_app, render_template, jsonify

from . import blueprint

process = None


@blueprint.route('/repos', methods=['GET'])
def get_repos():
    return jsonify(current_app.config['BACKUP_REPOS'])
