# Copyright: (c) xqk Organization. https://github.com/xqk/eye
# Copyright: (c) <xqkchina@gmail.com>
# Released under the AGPL-3.0 License.
from django.urls import path

from .views import *

urlpatterns = [
    path('', FileView.as_view()),
    path('object/', ObjectView.as_view()),
]
