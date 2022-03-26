# Copyright: (c) xqk Organization. https://github.com/xqk/eye
# Copyright: (c) <eye.icl.site@gmail.com>
# Released under the AGPL-3.0 License.
from django.conf.urls import url

from .views import *

urlpatterns = [
    url(r'template/$', TemplateView.as_view()),
    url(r'history/$', get_histories),
    url(r'do/$', do_task),
]
