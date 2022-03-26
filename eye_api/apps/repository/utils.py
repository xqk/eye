# Copyright: (c) xqk Organization. https://github.com/xqk/eye
# Copyright: (c) <eye.icl.site@gmail.com>
# Released under the AGPL-3.0 License.
from django_redis import get_redis_connection
from django.conf import settings
from django.db import close_old_connections
from libs.utils import AttrDict, human_time, render_str
from apps.repository.models import Repository
from apps.app.utils import fetch_repo
from apps.config.utils import compose_configs
from apps.deploy.helper import Helper
import json
import uuid
import os

REPOS_DIR = settings.REPOS_DIR
BUILD_DIR = settings.BUILD_DIR


def dispatch(rep: Repository, helper=None):
    rep.status = '1'
    alone_build = helper is None
    if not helper:
        rds = get_redis_connection()
        rds_key = f'{settings.BUILD_KEY}:{rep.eye_version}'
        helper = Helper(rds, rds_key)
        rep.save()
    try:
        api_token = uuid.uuid4().hex
        helper.rds.setex(api_token, 60 * 60, f'{rep.app_id},{rep.env_id}')
        helper.send_info('local', f'\033[32m完成√\033[0m\r\n{human_time()} 构建准备...        ')
        env = AttrDict(
            eye_APP_NAME=rep.app.name,
            eye_APP_KEY=rep.app.key,
            eye_APP_ID=str(rep.app_id),
            eye_DEPLOY_ID=str(rep.deploy_id),
            eye_BUILD_ID=str(rep.id),
            eye_ENV_ID=str(rep.env_id),
            eye_ENV_KEY=rep.env.key,
            eye_VERSION=rep.version,
            eye_BUILD_VERSION=rep.eye_version,
            eye_API_TOKEN=api_token,
            eye_REPOS_DIR=REPOS_DIR,
        )
        # append configs
        configs = compose_configs(rep.app, rep.env_id)
        configs_env = {f'_eye_{k.upper()}': v for k, v in configs.items()}
        env.update(configs_env)

        _build(rep, helper, env)
        rep.status = '5'
    except Exception as e:
        rep.status = '2'
        raise e
    finally:
        helper.local(f'cd {REPOS_DIR} && rm -rf {rep.eye_version}')
        close_old_connections()
        if alone_build:
            helper.clear()
            rep.save()
            return rep
        elif rep.status == '5':
            rep.save()


def _build(rep: Repository, helper, env):
    extend = rep.deploy.extend_obj
    extras = json.loads(rep.extra)
    git_dir = os.path.join(REPOS_DIR, str(rep.deploy_id))
    build_dir = os.path.join(REPOS_DIR, rep.eye_version)
    tar_file = os.path.join(BUILD_DIR, f'{rep.eye_version}.tar.gz')
    if extras[0] == 'branch':
        tree_ish = extras[2]
        env.update(eye_GIT_BRANCH=extras[1], eye_GIT_COMMIT_ID=extras[2])
    else:
        tree_ish = extras[1]
        env.update(eye_GIT_TAG=extras[1])
    env.update(eye_DST_DIR=render_str(extend.dst_dir, env))
    fetch_repo(rep.deploy_id, extend.git_repo)
    helper.send_info('local', '\033[32m完成√\033[0m\r\n')

    if extend.hook_pre_server:
        helper.send_step('local', 1, f'{human_time()} 检出前任务...\r\n')
        helper.local(f'cd {git_dir} && {extend.hook_pre_server}', env)

    helper.send_step('local', 2, f'{human_time()} 执行检出...        ')
    command = f'cd {git_dir} && git archive --prefix={rep.eye_version}/ {tree_ish} | (cd .. && tar xf -)'
    helper.local(command)
    helper.send_info('local', '\033[32m完成√\033[0m\r\n')

    if extend.hook_post_server:
        helper.send_step('local', 3, f'{human_time()} 检出后任务...\r\n')
        helper.local(f'cd {build_dir} && {extend.hook_post_server}', env)

    helper.send_step('local', 4, f'\r\n{human_time()} 执行打包...        ')
    filter_rule, exclude, contain = json.loads(extend.filter_rule), '', rep.eye_version
    files = helper.parse_filter_rule(filter_rule['data'], env=env)
    if files:
        if filter_rule['type'] == 'exclude':
            excludes = []
            for x in files:
                if x.startswith('/'):
                    excludes.append(f'--exclude={rep.eye_version}{x}')
                else:
                    excludes.append(f'--exclude={x}')
            exclude = ' '.join(excludes)
        else:
            contain = ' '.join(f'{rep.eye_version}/{x}' for x in files)
    helper.local(f'mkdir -p {BUILD_DIR} && cd {REPOS_DIR} && tar zcf {tar_file} {exclude} {contain}')
    helper.send_step('local', 5, f'\033[32m完成√\033[0m')
    helper.send_step('local', 100, f'\r\n\r\n{human_time()} ** \033[32m构建成功\033[0m **')
