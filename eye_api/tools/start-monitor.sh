#!/bin/bash
# Copyright: (c) xqk Organization. https://github.com/xqk/eye
# Copyright: (c) <eye.icl.site@gmail.com>
# Released under the AGPL-3.0 License.
# start monitor service

cd $(dirname $(dirname $0))
if [ -f ./venv/bin/activate ]; then
  source ./venv/bin/activate
fi

if command -v python3 &> /dev/null; then
  PYTHON=python3
else
  PYTHON=python
fi

exec $PYTHON manage.py runmonitor
