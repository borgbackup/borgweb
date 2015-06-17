.. include:: global.rst.inc
.. _usage:

Usage
=====

Start the server process
------------------------

For using |project_name|, you need to start its web service first.

To start the builtin server, run "borgweb".

You should see the builtin server starting and announcing the URL it serves.
It will continue running, outputting log information until you stop it.

To stop the builtin server, type Ctrl-C or close the window.

Alternatively, experienced python web administrators can also use
|project_name| as a WSGI app, see the borgweb.wsgi python module.

Point your browser at the service URL
-------------------------------------

Use a web browser like Firefox and visit the web service URL.

For the builtin server it usually is: http://127.0.0.1:5000/

|project_name| requires Javascript, so make sure it is not disabled.
