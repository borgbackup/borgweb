import os

from flask import current_app, render_template

from . import blueprint


@blueprint.route('/')
def index():
    log_dir = current_app.config['LOG_DIR']
    log_files = os.listdir(log_dir)
    log_file = log_files[0] if log_files else None
    if log_file:
        log_file = os.path.join(log_dir, log_file)
        with open(log_file, 'r') as f:
            log_content = f.read()
    else:
        log_content = 'No log available.'
    return render_template('index.html', log_content=log_content)
