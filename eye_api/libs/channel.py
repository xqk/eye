# Copyright: (c) xqk Organization. https://github.com/xqk/eye
# Copyright: (c) <xqkchina@gmail.com>
# Released under the AGPL-3.0 License.
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import uuid

layer = get_channel_layer()


class Channel:
    @staticmethod
    def get_token():
        return uuid.uuid4().hex

    @staticmethod
    def send_notify(title, content):
        message = {
            'type': 'notify.message',
            'title': title,
            'content': content
        }
        async_to_sync(layer.group_send)('notify', message)
