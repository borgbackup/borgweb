# -*- encoding: utf-8 *-*
import sys

import versioneer

min_python = (3, 2)
if sys.version_info < min_python:
    print("BorgWeb requires Python %d.%d or later" % min_python)
    sys.exit(1)

try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

with open('README.rst', 'r') as fd:
    long_description = fd.read()

setup(
    name='borgweb',
    version=versioneer.get_version(),
    author='The Borg Collective (see AUTHORS file)',
    author_email='borgbackup@librelist.com',
    url='https://borgweb.github.io/',
    description='Browser-based user interface for BorgBackup',
    long_description=long_description,
    license='BSD',
    platforms=['Linux', 'MacOS X', 'FreeBSD', ],
    classifiers=[
        'Development Status :: 4 - Beta',
        'Environment :: Console',
        'Intended Audience :: System Administrators',
        'License :: OSI Approved :: BSD License',
        'Operating System :: POSIX :: BSD :: FreeBSD',
        'Operating System :: MacOS :: MacOS X',
        'Operating System :: POSIX :: Linux',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.2',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4',
        'Topic :: System :: Archiving :: Backup',
    ],
    packages=['borgweb', 'borgweb.views', 'borgweb._tests'],
    package_data={
        'borgweb.static': ['*', ],
        'borgweb.templates': ['*.html', ],
    },
    include_package_data=True,
    scripts=['scripts/borgweb'],
    cmdclass=versioneer.get_cmdclass(),
    install_requires=[
        'flask',
    ],
)
