# Copyright: (c) xqk Organization. https://github.com/xqk/eye
# Copyright: (c) <eye.icl.site@gmail.com>
# Released under the AGPL-3.0 License.
from django.urls import path

from .views import *

urlpatterns = [
    path('', RepositoryView.as_view()),
    path('<int:r_id>/', get_detail),
    path('request/', get_requests),
]
