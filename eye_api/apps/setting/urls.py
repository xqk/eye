# Copyright: (c) xqk Organization. https://github.com/xqk/eye
# Copyright: (c) <xqkchina@gmail.com>
# Released under the AGPL-3.0 License.
# from django.urls import path
from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^$', SettingView.as_view()),
    url(r'^ldap_test/$', ldap_test),
    url(r'^email_test/$', email_test),
    url(r'^mfa/$', MFAView.as_view()),
    url(r'^about/$', get_about)
]
