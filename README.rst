What is BorgWeb?
================

BorgWeb is a browser-based user interface for `Borg Backup <https://borgweb.readthedocs.io/>`_.

The UI is intended to help with everyday tasks, it is not intended as a full UI to everything borg can do.

You'll need help of an admin to install and configure it, as well as to restore backups.

Main features
-------------

- BorgWeb (the web service) usually runs on the machine that is backed up with
  BorgBackup. You can use a web browser to access BorgWeb from the same
  machine or from another machine.
- BorgWeb can operate using a builtin web server or as WSGI app using an
  external web server (like e.g. apache + mod_wsgi).
- using the web browser you can:

  * review backup log files
  * start a backup


Links
=====

* `Documentation <https://borgweb.readthedocs.io/en/latest/>`_
* `PyPI packages <https://pypi.python.org/pypi/borgweb/>`_
* `Github <https://github.com/borgbackup/borgweb/>`_
* `Issue Tracker <https://github.com/borgbackup/borgweb/issues/>`_


Notes
-----

NOT RELEASED DEVELOPMENT VERSIONS HAVE UNKNOWN COMPATIBILITY PROPERTIES.

THIS IS SOFTWARE IN DEVELOPMENT, DECIDE YOURSELF WHETHER IT FITS YOUR NEEDS.

Please also see the `LICENSE <https://github.com/borgbackup/borgweb/blob/master/LICENSE>`_ for more information.
