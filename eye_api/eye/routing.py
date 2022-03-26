# Copyright: (c) xqk Organization. https://github.com/xqk/eye
# Copyright: (c) <eye.icl.site@gmail.com>
# Released under the AGPL-3.0 License.
from channels.routing import ProtocolTypeRouter
from consumer import routing

application = ProtocolTypeRouter({
    'websocket': routing.ws_router
})
