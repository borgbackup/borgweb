# -*- encoding: utf-8 *-*
import sys

import versioneer
versioneer.VCS = 'git'
versioneer.style = 'pep440'
versioneer.versionfile_source = 'borgweb/_version.py'
versioneer.versionfile_build = 'borgweb/_version.py'
versioneer.tag_prefix = ''
versioneer.parentdir_prefix = 'borgweb-'  # dirname like 'myproject-1.2.0'

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

cmdclass = versioneer.get_cmdclass()

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
    packages=['borgweb', 'borgweb._tests'],
    scripts=['scripts/borgweb'],
    cmdclass=cmdclass,
    install_requires=[],
)
