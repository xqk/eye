#!/bin/bash
# Copyright: (c) xqk Organization. https://github.com/xqk/eye
# Copyright: (c) <eye.icl.site@gmail.com>
# Released under the AGPL-3.0 License.
# start api service

cd $(dirname $(dirname $0))
if [ -f ./venv/bin/activate ]; then
  source ./venv/bin/activate
fi
exec gunicorn -b 127.0.0.1:9001 -w 2 --threads 8 --access-logfile - eye.wsgi
