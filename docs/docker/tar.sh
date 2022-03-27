# Copyright: (c) xqk Organization. https://github.com/xqk/eye
# Copyright: (c) <xqkchina@gmail.com>
# Released under the AGPL-3.0 License.

rm -rf eye.tar.gz && cd ../../../ && tar zcvf eye.tar.gz --exclude=eye/eye_web/node_modules --exclude=eye/.git eye && mv -f eye.tar.gz eye/docs/docker && cd eye/docs/docker