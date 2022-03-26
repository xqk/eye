#!/bin/bash
# Copyright: (c) xqk Organization. https://github.com/xqk/eye
# Copyright: (c) <eye.icl.site@gmail.com>
# Released under the AGPL-3.0 License.

set -e


function spuy_banner() {

echo "                           ";
echo " ####  #####  #    #  #### ";
echo "#      #    # #    # #    #";
echo " ####  #    # #    # #     ";
echo "     # #####  #    # #  ###";
echo "#    # #      #    # #    #";
echo " ####  #       ####   #### ";
echo "                           ";

}


function init_system_lib() {
    source /etc/os-release
    case $ID in
        centos|fedora|rhel)
            echo "开始安装/更新可能缺少的依赖: git mariadb-server mariadb-devel python3-devel gcc openldap-devel redis nginx supervisor python36"
            yum install -y epel-release
            yum install -y git mariadb-server mariadb-devel python3-devel gcc openldap-devel redis nginx supervisor python36
            sed -i 's/ default_server//g' /etc/nginx/nginx.conf
            MYSQL_CONF=/etc/my.cnf.d/eye.cnf
            SUPERVISOR_CONF=/etc/supervisord.d/eye.ini
            REDIS_SRV=redis
            SUPERVISOR_SRV=supervisord
            ;;

        debian|ubuntu|devuan)
            echo "开始安装/更新可能缺少的依赖: git mariadb-server libmariadbd-dev python3-venv libsasl2-dev libldap2-dev redis-server nginx supervisor"
            apt update
            apt install -y git mariadb-server libmariadbd-dev python3-dev python3-venv libsasl2-dev libldap2-dev redis-server nginx supervisor
            rm -f /etc/nginx/sites-enabled/default
            MYSQL_CONF=/etc/mysql/conf.d/eye.cnf
            SUPERVISOR_CONF=/etc/supervisor/conf.d/eye.conf
            REDIS_SRV=redis-server
            SUPERVISOR_SRV=supervisor
            ;;
        *)
            exit 1
            ;;
    esac
}


function install_eye() {
  echo "开始安装eye..."
  mkdir -p /data
  cd /data
  git clone --depth=1 https://github.com/xqk/eye.git
  curl -o /tmp/web_latest.tar.gz https://eye.icl.site/installer/web_latest.tar.gz
  tar xf /tmp/web_latest.tar.gz -C eye/eye_web/
  cd eye/eye_api
  python3 -m venv venv
  source venv/bin/activate

  pip install wheel -i https://pypi.doubanio.com/simple/
  pip install gunicorn mysqlclient -i https://pypi.doubanio.com/simple/
  pip install -r requirements.txt -i https://pypi.doubanio.com/simple/
}


function setup_conf() {

  echo "开始配置eye配置..."
# mysql conf
cat << EOF > $MYSQL_CONF
[mysqld]
bind-address=127.0.0.1
EOF

# eye conf
cat << EOF > eye/overrides.py
DEBUG = False
ALLOWED_HOSTS = ['127.0.0.1']

DATABASES = {
    'default': {
        'ATOMIC_REQUESTS': True,
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'eye',
        'USER': 'eye',
        'PASSWORD': 'eye.icl.site',
        'HOST': '127.0.0.1',
        'OPTIONS': {
            'charset': 'utf8mb4',
            'sql_mode': 'STRICT_TRANS_TABLES',
        }
    }
}
EOF

cat << EOF > $SUPERVISOR_CONF
[program:eye-api]
command = bash /data/eye/eye_api/tools/start-api.sh
autostart = true
stdout_logfile = /data/eye/eye_api/logs/api.log
redirect_stderr = true

[program:eye-ws]
command = bash /data/eye/eye_api/tools/start-ws.sh
autostart = true
stdout_logfile = /data/eye/eye_api/logs/ws.log
redirect_stderr = true

[program:eye-worker]
command = bash /data/eye/eye_api/tools/start-worker.sh
autostart = true
stdout_logfile = /data/eye/eye_api/logs/worker.log
redirect_stderr = true

[program:eye-monitor]
command = bash /data/eye/eye_api/tools/start-monitor.sh
autostart = true
stdout_logfile = /data/eye/eye_api/logs/monitor.log
redirect_stderr = true

[program:eye-scheduler]
command = bash /data/eye/eye_api/tools/start-scheduler.sh
autostart = true
stdout_logfile = /data/eye/eye_api/logs/scheduler.log
redirect_stderr = true
EOF

cat << EOF > /etc/nginx/conf.d/eye.conf
server {
        listen 80 default_server;
        root /data/eye/eye_web/build/;

        location ^~ /api/ {
                rewrite ^/api(.*) \$1 break;
                proxy_pass http://127.0.0.1:9001;
                proxy_redirect off;
                proxy_set_header X-Real-IP \$remote_addr;
        }

        location ^~ /api/ws/ {
                rewrite ^/api(.*) \$1 break;
                proxy_pass http://127.0.0.1:9002;
                proxy_http_version 1.1;
                proxy_set_header Upgrade \$http_upgrade;
                proxy_set_header Connection "Upgrade";
                proxy_set_header X-Real-IP \$remote_addr;
        }

        error_page 404 /index.html;
}
EOF


systemctl start mariadb
systemctl enable mariadb

mysql -e "create database eye default character set utf8mb4 collate utf8mb4_unicode_ci;"
mysql -e "grant all on eye.* to eye@127.0.0.1 identified by 'eye.icl.site'"
mysql -e "flush privileges"

python manage.py initdb
python manage.py useradd -u admin -p eye.icl.site -s -n 管理员


systemctl enable nginx
systemctl enable $REDIS_SRV
systemctl enable $SUPERVISOR_SRV

systemctl restart nginx
systemctl start $REDIS_SRV
systemctl restart $SUPERVISOR_SRV

}


spuy_banner
init_system_lib
install_eye
setup_conf

echo -e "\n\n\033[33m安全警告：默认的数据库和Redis服务并不安全，请确保其仅监听在127.0.0.1，推荐参考官网文档自行加固安全配置！\033[0m"
echo -e "\033[32m安装成功！\033[0m"
echo "默认管理员账户：admin  密码：eye.icl.site"
echo "默认数据库用户：eye   密码：eye.icl.site"
