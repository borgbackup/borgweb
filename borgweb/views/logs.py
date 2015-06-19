"""
logs view
"""

import os

from flask import current_app, render_template, jsonify

from . import blueprint


def _get_logs():
    log_dir = current_app.config['LOG_DIR']
    log_dir = os.path.abspath(log_dir)
    try:
        log_files = os.listdir(log_dir)
    except OSError:
        log_files = []
    return log_dir, sorted(log_files, reverse=True)


def _get_log_lines(log_dir, log_file, offset, linecount=None):
    log_file = os.path.join(log_dir, log_file)
    with open(log_file, 'r') as f:
        f.seek(offset)
        if linecount is None:
            log_lines = f.readlines()
        else:
            log_lines = []
            for i in range(linecount):
                line = f.readline()
                if not line:
                    break
                log_lines.append(line)
        log_lines = [line.rstrip('\n') for line in log_lines]
        offset = f.tell()
    return log_file, offset, log_lines


@blueprint.route('/logs/<int:index>/<offset>:<linecount>')
def get_log_fragment(index, offset, linecount):
    try:
        offset = int(offset)
    except ValueError:
        offset = 0
    try:
        linecount = int(linecount)
    except ValueError:
        linecount = None
    log_dir, log_files = _get_logs()
    try:
        log_file = log_files[index]
    except IndexError:
        log_file = ''
    if log_file:
        log_file, offset, log_lines = _get_log_lines(log_dir, log_file, offset, linecount)
    else:
        log_lines = []
    return jsonify(dict(fname=log_file, lines=log_lines, offset=offset))


@blueprint.route('/logs/<int:index>')
def get_log(index):
    log_dir, log_files = _get_logs()
    try:
        log_file = log_files[index]
    except IndexError:
        log_file = ''
    else:
        log_file = os.path.join(log_dir, log_file)
    return jsonify(dict(log_file=log_file))


@blueprint.route('/logs')
def get_logs():
    log_dir, log_files = _get_logs()
    return jsonify(dict(log_dir=log_dir,
                        log_files=list(enumerate(log_files))))

