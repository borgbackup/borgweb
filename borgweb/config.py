class Config(object):
    """This is the basic configuration class for BorgWeb."""

    #: log file directory
    LOG_DIR = 'logs'
    REPOSITORY = 'repo'
    NAME = 'localhost'
    BACKUP_CMD = "borg create -v {REPOSITORY}::{NAME}-{UTC} ~/.icons >{LOG_DIR}/{NAME}-{UTC} 2>&1"

