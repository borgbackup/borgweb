class Config(object):
    """This is the basic configuration class for BorgWeb."""

    #: log file directory
    LOG_DIR = 'logs'
    REPOSITORY = 'repo'
    NAME = 'localhost'

    # when you click on "start backup", this command will be given to a OS
    # shell to execute it.
    # if you just need something simple (like "borg create ..."), just put
    # the command here. if you need something more complex, write a script and
    # call it from here.
    # commands will be executed as the same user as the one used for running
    # borgweb. for running commands as root, you'll need to use sudo (and
    # configure it in an appropriate and secure way).
    # template placeholders like {LOG_DIR} (and other stuff set in the config)
    # will be expanded to their value before the shell command is executed.
    BACKUP_CMD = "BORG_LOGGING_CONF=logging.conf borg create --show-rc {REPOSITORY}::{NAME}-{LOCALTIME} . >{LOG_DIR}/{NAME}-{LOCALTIME} 2>&1 </dev/null"

