What is BorgWeb?
----------------
BorgWeb is a browser-based user interface for Borg Backup.

NOT RELEASED DEVELOPMENT VERSIONS HAVE UNKNOWN COMPATIBILITY PROPERTIES.

THIS IS SOFTWARE IN DEVELOPMENT, DECIDE YOURSELF WHETHER IT FITS YOUR NEEDS.

Please also see the LICENSE for more informations.

Installation
~~~~~~~~~~~~
Currently, only installation from git repo checkout is supported.

Use pip install -e . from the toplevel borgweb directory to install it into
same virtualenv as you use for borgbackup.

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

