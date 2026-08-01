from flask import Flask
from sqlalchemy import text
import logging
from datetime import datetime
import os

from src.constants import DEFAULT_HOST, DEFAULT_PORT
from src.logger import Logger
from src.__version__ import ACCESS_LOG_PATH, DB_PATH
from src.db_factory import db_factory

class WebApp:
    '''网页启动入口类'''
    def __init__(self):
        self.app = Flask(__name__)
        
        self.log_init() #日志最先初始化
        self.db_init()
        self.bp_init()

    def bp_init(self):
        '''蓝图对象初始化'''
        from src.view import blueprints_list
        for bp in blueprints_list:
            self.app.register_blueprint(bp)
            Logger.info(f"注册{bp.name}")
        Logger.info("蓝图对象注册完毕")

    def db_init(self):
        '''数据库链接初始化'''
        self.app.config["SQLALCHEMY_DATABASE_URI"] = DB_PATH
        self.app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

        #创建SQLAlchemy实例
        db_factory.creat_db(self.app)
        self.db = db_factory.get_db()

        # 测试数据库连通性
        with self.app.app_context():
            try:
                self.db.session.execute(text(""))
                Logger.info("数据库连通性测试正常")
            except Exception as e:
                Logger.error(f"数据库连接失败：{e}", exc_info=True)
                raise 

            Logger.info("数据表校验/创建完成")

            self.db.create_all()
        
        Logger.info("数据库链接初始化完成")

    def log_init(self):
        '''日志记录器初始化'''
        Logger.init()
        Logger.init_output()
        app_logger = Logger.get_logger()
        
        Logger.info("后端日志记录器初始化完成")

        self.app.logger = app_logger
        self.app.logger.propagate = False

        # 将访问日志输出到单独的文件
        werkzeug_logger = logging.getLogger("werkzeug")

        # 移除现有handlers
        for h in list(werkzeug_logger.handlers):
            werkzeug_logger.removeHandler(h)
        access_handler = logging.FileHandler(ACCESS_LOG_PATH, encoding="utf-8")
        access_handler.setLevel(app_logger.level)

        # 复用Logger的formatter
        fmt = None
        if app_logger.handlers:
            fmt = getattr(app_logger.handlers[0], "formatter", None)
        if fmt:
            access_handler.setFormatter(fmt)

        werkzeug_logger.addHandler(access_handler)
        werkzeug_logger.setLevel(logging.WARNING)
        werkzeug_logger.propagate = False

        Logger.info("访问日志记录器初始化完成")


    def run(self, host=DEFAULT_HOST, port=DEFAULT_PORT):
        '''启动网页'''
        Logger.info("网页服务即将启动")
        self.app.run(host=host, port=port)
