.. include:: global.rst.inc
.. _internals:

Internals
=========

This page documents the internal workings of |project_name|.

What we use
-----------

* Flask and Werkzeug - Python web micro-framework and http toolbox
* Bootstrap and jQuery - CSS framework, Javascript library
* |project_name_backup| - for doing the backups

Develop JS
~~~~~~~~~~
#. Have NodeJS/io.js and NPM installed.
#. ``git clone https://github.com/borgbackup/borgweb.git``
#. ``cd borgweb/js``
#. ``npm install``
#. ``gulp watch``
#. Edit JS files within ``js/``; files will automatically be bundle into ``borgweb/static/bundle.js``
