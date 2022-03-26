# Copyright: (c) xqk Organization. https://github.com/xqk/eye
# Copyright: (c) <xqkchina@gmail.com>
# Released under the AGPL-3.0 License.
from django.urls import path

from .views import *

urlpatterns = [
    path('', ConfigView.as_view()),
    path('parse/json/', parse_json),
    path('parse/text/', parse_text),
    path('diff/', post_diff),
    path('environment/', EnvironmentView.as_view()),
    path('service/', ServiceView.as_view()),
    path('history/', HistoryView.as_view()),
]
