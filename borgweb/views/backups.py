"""
backup view
"""

import subprocess
import time

from flask import current_app, render_template, jsonify

from . import blueprint

from . import logs

process = None


@blueprint.route('/backups', methods=['GET'])
def get_backups():
    repos = dict(current_app.config["BACKUP_REPOS"])
    output = {}
    for repo, backups in repos.items():
        # Set an empty array to append to if we dont have repo
        if(hasattr(output, repo) != True):
            output[repo] = []
        for backup in backups["backups"]:
            # TODO get the logs based on the backup name
            log_dir, log_files = logs._get_logs(repo)
            # Set the default status to not run
            backup["last_result"] = "warning"
            # If we have done atleast one backup for the repo set the status
            if(len(log_files) > 0):
                backup["last_result"] = logs.getLogFileStatus(log_dir + "/" + log_files[0]);

            output[repo].append(backup)

    return jsonify(output)
