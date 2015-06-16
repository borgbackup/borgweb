"""
main view
"""

import os
from functools import lru_cache

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


@lru_cache(maxsize=4)
def _get_all_log_lines(log_dir, log_file):
    log_file = os.path.join(log_dir, log_file)
    with open(log_file, 'r') as f:
        log_lines = list(f)
    return log_file, log_lines


@blueprint.route('/logs/<int:index>/<start>:<end>')
def get_log_fragment(index, start, end):
    try:
        start = int(start)
    except ValueError:
        start = None
    try:
        end = int(end)
    except ValueError:
        end = None
    log_dir, log_files = _get_logs()
    try:
        log_file = log_files[index]
    except IndexError:
        log_file = ''
    if log_file:
        log_file, log_lines = _get_all_log_lines(log_dir, log_file)
        log_lines = log_lines[start:end]
    else:
        log_lines = []
    log_content = ''.join(log_lines)
    return jsonify(dict(log_file=log_file,
                        log_content=log_content))


@blueprint.route('/logs/<int:index>')
def get_log(index):
    log_dir, log_files = _get_logs()
    try:
        log_file = log_files[index]
    except IndexError:
        log_file = ''
    if log_file:
        log_file = os.path.join(log_dir, log_file)
        log_file, log_lines = _get_all_log_lines(log_dir, log_file)
        log_length = len(log_lines)
    else:
        log_length = 0
    return jsonify(dict(log_file=log_file,
                        log_length=log_length))


@blueprint.route('/logs')
def get_logs():
    log_dir, log_files = _get_logs()
    return jsonify(dict(log_dir=log_dir,
                        log_files=list(enumerate(log_files))))


@blueprint.route('/')
def index():
    return render_template('index.html')
