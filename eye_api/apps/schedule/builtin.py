# Copyright: (c) xqk Organization. https://github.com/xqk/eye
# Copyright: (c) <xqkchina@gmail.com>
# Released under the AGPL-3.0 License.
from django.db import connections
from apps.account.models import History
from apps.alarm.models import Alarm
from apps.schedule.models import Task, History as TaskHistory
from apps.deploy.models import DeployRequest
from apps.exec.models import ExecHistory
from apps.notify.models import Notify
from apps.deploy.utils import dispatch
from libs.utils import parse_time, human_datetime, human_date
from datetime import datetime, timedelta
from threading import Thread


def auto_run_by_day():
    try:
        date_7 = human_date(datetime.now() - timedelta(days=7))
        date_30 = human_date(datetime.now() - timedelta(days=30))
        History.objects.filter(created_at__lt=date_30).delete()
        Notify.objects.filter(created_at__lt=date_7, unread=False).delete()
        Alarm.objects.filter(created_at__lt=date_30).delete()
        try:
            record = ExecHistory.objects.all()[50]
            ExecHistory.objects.filter(id__lt=record.id).delete()
        except IndexError:
            pass
        for task in Task.objects.all():
            try:
                record = TaskHistory.objects.filter(task_id=task.id)[50]
                TaskHistory.objects.filter(task_id=task.id, id__lt=record.id).delete()
            except IndexError:
                pass
    finally:
        connections.close_all()


def auto_run_by_minute():
    try:
        now = datetime.now()
        for req in DeployRequest.objects.filter(status='2'):
            if (now - parse_time(req.do_at)).seconds > 3600:
                req.status = '-3'
                req.save()
        for req in DeployRequest.objects.filter(status='1', plan__lte=now):
            req.status = '2'
            req.do_at = human_datetime()
            req.do_by = req.created_by
            req.save()
            Thread(target=dispatch, args=(req,)).start()
    finally:
        connections.close_all()
