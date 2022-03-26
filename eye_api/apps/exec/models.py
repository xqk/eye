# Copyright: (c) xqk Organization. https://github.com/xqk/eye
# Copyright: (c) <xqkchina@gmail.com>
# Released under the AGPL-3.0 License.
from django.db import models
from libs import ModelMixin, human_datetime
from apps.account.models import User
import json


class ExecTemplate(models.Model, ModelMixin):
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    body = models.TextField()
    interpreter = models.CharField(max_length=20, default='sh')
    host_ids = models.TextField(default='[]')
    desc = models.CharField(max_length=255, null=True)

    created_at = models.CharField(max_length=20, default=human_datetime)
    created_by = models.ForeignKey(User, models.PROTECT, related_name='+')
    updated_at = models.CharField(max_length=20, null=True)
    updated_by = models.ForeignKey(User, models.PROTECT, related_name='+', null=True)

    def __repr__(self):
        return '<ExecTemplate %r>' % self.name

    def to_view(self):
        tmp = self.to_dict()
        tmp['host_ids'] = json.loads(self.host_ids)
        return tmp

    class Meta:
        db_table = 'exec_templates'
        ordering = ('-id',)


class ExecHistory(models.Model, ModelMixin):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    template = models.ForeignKey(ExecTemplate, on_delete=models.SET_NULL, null=True)
    digest = models.CharField(max_length=32, db_index=True)
    interpreter = models.CharField(max_length=20)
    command = models.TextField()
    host_ids = models.TextField()
    updated_at = models.CharField(max_length=20, default=human_datetime)

    def to_view(self):
        tmp = self.to_dict()
        tmp['host_ids'] = json.loads(self.host_ids)
        if hasattr(self, 'template_name'):
            tmp['template_name'] = self.template_name
        return tmp

    class Meta:
        db_table = 'exec_histories'
        ordering = ('-updated_at',)
