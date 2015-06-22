class Config(object):
    """This is the basic configuration class for BorgWeb."""

    #: log file directory
    LOG_DIR = 'logs'
    REPOSITORY = 'repo'
    NAME = 'localhost'
    BACKUP_CMD = "borg create -v {REPOSITORY}::{NAME}-{LOCALTIME} . >{LOG_DIR}/{NAME}-{LOCALTIME} 2>&1"

