# -*- encoding: utf-8 *-*
import sys

min_python = (3, 4)
if sys.version_info < min_python:
    print("BorgWeb requires Python %d.%d or later" % min_python)
    sys.exit(1)

from setuptools import setup, find_packages

with open('README.rst', 'r') as fd:
    long_description = fd.read()

setup(
    name='borgweb',
    use_scm_version=dict(write_to='borgweb/_version.py'),
    author='The Borg Collective (see AUTHORS file)',
    author_email='borgbackup@python.org',
    url='https://borgweb.readthedocs.io/',
    description='Browser-based user interface for BorgBackup',
    long_description=long_description,
    license='BSD',
    platforms=['Linux', 'MacOS X', 'FreeBSD', 'OpenBSD', 'NetBSD', ],
    classifiers=[
        'Development Status :: 4 - Beta',
        'Environment :: Console',
        'Intended Audience :: System Administrators',
        'License :: OSI Approved :: BSD License',
        'Operating System :: POSIX :: BSD :: FreeBSD',
        'Operating System :: POSIX :: BSD :: OpenBSD',
        'Operating System :: POSIX :: BSD :: NetBSD',
        'Operating System :: MacOS :: MacOS X',
        'Operating System :: POSIX :: Linux',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Topic :: System :: Archiving :: Backup',
    ],
    packages=find_packages(),
    package_data={
        'borgweb': [
            'static/*.*',  # does NOT match subdirectories!
            'static/bootstrap/*',
            'static/fonts/*',
            'static/i18n/*',
            'templates/*',
        ],
    },
    include_package_data=True,
    zip_safe=False,
    entry_points={
        'console_scripts': [
            'borgweb = borgweb.app:main',
        ]
    },
    setup_requires=['setuptools_scm>=1.7'],
    install_requires=[
        'flask',
    ],
)
