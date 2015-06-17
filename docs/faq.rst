.. _faq:
.. include:: global.rst.inc

Frequently asked questions
==========================

Which platforms are supported?
    For the |project_name| web service, we try to support the same platforms
    as for |project_name_backup|.

    Additionally, you will need some sane browser to access the web service,
    like Firefox or Chrome/Chromium. Using MS Internet Explorer [IE] (or other
    other browsers based on it) is discouraged and unsupported.
    If you run a sane browser, accessing the service should work from desktop
    and mobile platforms, we try to adapt to your screen resolution.

Why a web-based / browser-based approach?
    We didn't implement a "normal" desktop application, but a web app because:

    - too many different desktop and mobile platforms to support (Linux, *BSD,
      Windows, Mac OS X, Android, iOS + a ton of different options per platform)
    - html5, css and js works (almost) everywhere and we even have same code /
      similar UI everywhere.
    - you can run the browser on the same machine as the backup software
      (typical desktop backup scenario), but you can also run it on another
      machine (server-without-GUI scenario) - more flexibility!
