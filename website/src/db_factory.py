from flask_sqlalchemy import SQLAlchemy

class DBFactory:
    def __init__(self):
        self._db = None

    def creat_db(self, app):
        '''创建数据库实例'''
        self._db = SQLAlchemy(app)

    def get_db(self) -> SQLAlchemy | None: 
        '''返回数据库实例'''
        return self._db

db_factory = DBFactory()