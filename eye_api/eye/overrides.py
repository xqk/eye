DEBUG = False
ALLOWED_HOSTS = ['127.0.0.1']
SECRET_KEY = 'gwlFdl70YVQ.z2RjzsuRhEhqy.zX2VrNaP09Vf4TjED5Z@%#r7'

DATABASES = {
    'default': {
        'ATOMIC_REQUESTS': True,
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'eye',
        'USER': 'eye',
        'PASSWORD': 'eye.icl.site',
        'HOST': 'localhost',
        'OPTIONS': {
            'unix_socket': '/var/lib/mysql/mysql.sock',
            'charset': 'utf8mb4',
            'sql_mode': 'STRICT_TRANS_TABLES',
        }
    }
}