.. include:: global.rst.inc
.. _installation:

Installation
============

|project_name| requires:

* Python_ >= 3.3
* some python dependencies, see install_requires in setup.py

Currently, only installation from git repo checkout is supported.

Use pip install -e . from the top-level |project_name| directory to install
it into same virtualenv as you use for |project_name_backup|.

To install the complete environment for development you can do the following: ::

    # Install Python code and dependencies:
    virtualenv --python=python3 borg-env
    source borg-env/bin/activate
    pip install tox pytest
    git clone https://github.com/borgbackup/borgweb.git
    cd borgweb
    pip install -e .
    
    # Install JS code and dependencies:
    cd js
    npm install
    
    # Start the local Flask webserver:
    cd ../../
    mkdir logs
    ./borg-env/bin/borgweb
    
    # Start the watch process and Browsersync
    # In another shell navigate to `borgweb/js` and enter:
    gulp watch


Configuration
=============
The builtin default configuration expects a "repo/" directory and a "logs/"
directory in the current working directory. This is mostly development and
testing, we do not expect normal setups to use the default configuration.

You can override this by pointing to a custom configuration file via the
environment variable BORGWEB_CONFIG.

The configuration file must only have lines like this (and NO indentation)::

  KEY = value  # KEY must be all-uppercase, valid python syntax

See borgweb/config.py for the currently supported keys and example values.
