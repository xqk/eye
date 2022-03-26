# Copyright: (c) xqk Organization. https://github.com/xqk/eye
# Copyright: (c) <eye.icl.site@gmail.com>
# Released under the AGPL-3.0 License.
from django.urls import path
from channels.routing import URLRouter
from consumer.middleware import AuthMiddleware
from consumer.consumers import *

ws_router = AuthMiddleware(
    URLRouter([
        path('ws/exec/<str:token>/', ExecConsumer),
        path('ws/ssh/<int:id>/', SSHConsumer),
        path('ws/<str:module>/<str:token>/', ComConsumer),
        path('ws/notify/', NotifyConsumer),
    ])
)
