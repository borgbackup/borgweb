"""
backup view
"""

import subprocess
import time

from flask import current_app, render_template, jsonify

from . import blueprint

process = None


@blueprint.route('/backup/start', methods=['POST'])
def backup_start():
    env = dict(current_app.config)
    now = time.time()
    fmt = '%Y-%m-%d-%H:%M:%S'
    env['LOCALTIME'] = time.strftime(fmt, time.localtime(now))
    env['UTC'] = time.strftime(fmt, time.gmtime(now))
    cmd = env['BACKUP_CMD'].format(**env)
    global process
    if process is None or process.returncode is not None:
        # no process ever run or process has terminated
        process = subprocess.Popen(cmd, shell=True, stdin=None, stdout=None, stderr=None)
        msg = "started, pid=%d" % process.pid
    else:
        msg = "already running"
    return jsonify(dict(msg=msg, pid=process.pid))


@blueprint.route('/backup/stop', methods=['POST'])
def backup_stop():
    global process
    if process is None:
        rc = -1
        msg = 'not running'
    else:
        try:
            process.terminate()
            for t in range(10):
                rc = process.poll()
                if rc is not None:
                    msg = 'terminated'
                    break  # process has terminated
                time.sleep(1)
            else:
                process.kill()
                msg = 'killed'
                rc = -1
        except ProcessLookupError:
            rc = -1
            msg = 'not running'
    return jsonify(dict(msg=msg, rc=rc))


@blueprint.route('/backup/status')
def backup_rc():
    global process
    if process is not None:
        rc = process.poll()
        if rc is None:
            msg = 'running'
        else:
            msg = 'not running, last rc=%d' % rc
    else:
        msg = 'not running'
        rc = -1
    return jsonify(dict(msg=msg, rc=rc))

