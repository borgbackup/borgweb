What is BorgWeb?
----------------
BorgWeb is a browser-based user interface for Borg Backup.

NOT RELEASED DEVELOPMENT VERSIONS HAVE UNKNOWN COMPATIBILITY PROPERTIES.

THIS IS SOFTWARE IN DEVELOPMENT, DECIDE YOURSELF WHETHER IT FITS YOUR NEEDS.

Please also see the LICENSE for more information.

Installation
~~~~~~~~~~~~
Currently, only installation from git repo checkout is supported.

Use pip install -e . from the top-level borgweb directory to install it into
same virtualenv as you use for borgbackup.

Configuration
~~~~~~~~~~~~~
The builtin default configuration expects a "repo/" directory and a "logs/"
directory in the current working directory.

You can override this by pointing to a custom configuration file via the
environment variable BORGWEB_CONFIG. The configuration file must only have
lines like this (and NO indentation)::

  KEY = value  # KEY must be all-uppercase, valid python syntax

See borgweb/config.py for the currently supported keys and example values.


Easy to use
~~~~~~~~~~~
After installation, run "borgweb" and point your browser to the URL you see
in its output.

Main features
~~~~~~~~~~~~~
- BorgWeb (the web service) usually runs on the machine that is backed up with
  BorgBackup. You can use a web browser to access BorgWeb from the same
  machine or from another machine.
- BorgWeb can operate using a builtin flask-based web server or as WSGI app
  using an external web server (like e.g. apache + mod_wsgi).
- using the web browser you can:

  * review backup log files
  * start a backup

