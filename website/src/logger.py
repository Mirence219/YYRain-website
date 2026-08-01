import logging
import os
from datetime import datetime

from src.__version__ import LOG_DIR

LEVEL_DIC = {
    "DEBUG": 0,
    "INFO": 1,
    "WARNING": 2,
    "ERROR": 3,
    "CRITICAL": 4,
    "EXCEPTION": 5
}

class classproperty(property):
    def __get__(self, instance, owner):
        return self.fget(owner)

class Logger:
    '''日志记录器（全局单例，封装logging模块）'''
    _level = 0  # 默认 DEBUG 级别
    _LOGGER_NAME = "LittleClock"
    _logger = None
    _handler = None


    @classmethod
    def init(cls):
        '''日志初始化'''
        cls._log_name = datetime.now().strftime("%Y_%m_%d_%H_%M_%S") + ".log"
        cls._log_path = os.path.join(LOG_DIR, cls._log_name)
        cls._logger = logging.getLogger(cls._LOGGER_NAME)
        cls._logger.setLevel(logging.DEBUG)


    @classmethod
    def init_output(cls):
        '''初始化日志输出（确认路径可用后调用）'''
        cls._handler = logging.FileHandler(cls._log_path)
        cls._logger.addHandler(cls._handler)

        log_str = cls._format_msg(f"[INFO]新建日志文件'{cls._log_path}'")
        cls._logger.info(log_str)
        print(log_str)


    @classmethod
    def shutdown(cls):
        '''程序退出前写入磁盘'''
        cls.info("正在关闭日志记录器。。。")
        if cls._logger is None:
            return
        for handler in cls._logger.handlers:
            handler.flush()
            handler.close()


    @classmethod
    def set_level(cls, level_str: str):
        '''设置日志输出等级'''
        if level_str in LEVEL_DIC:
            cls._level = LEVEL_DIC[level_str]

    @classproperty
    def level(cls):
        return cls._level

    @classmethod
    def _format_msg(cls, msg: str, *args, **kwargs) -> str:
        """内部：拼接消息 + 时间戳"""
        # 格式化日志内容
        try:
            content = msg.format(*args, **kwargs)
        except (IndexError, KeyError):
            content = f"{msg} args={args} kwargs={kwargs}"
        # 拼接时间
        time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return f"[{time_str}]{content}"

    @classmethod
    def debug(cls, msg: str, *args, **kwargs):
        '''DEBUG级日志输出'''
        if LEVEL_DIC["DEBUG"] < cls._level:
            return
        log_str = cls._format_msg(f"[DEBUG]{msg}", *args, **kwargs)
        print(log_str)
        cls._logger.debug(log_str)

    @classmethod
    def info(cls, msg: str, *args, **kwargs):
        '''INFO级日志输出'''
        if LEVEL_DIC["INFO"] < cls._level:
            return
        log_str = cls._format_msg(f"[INFO]{msg}", *args, **kwargs)
        print(log_str)
        cls._logger.info(log_str)

    @classmethod
    def warning(cls, msg: str, *args, **kwargs):
        '''WARNING级日志输出'''
        if LEVEL_DIC["WARNING"] < cls._level:
            return
        log_str = cls._format_msg(f"[WARNING]{msg}", *args, **kwargs)
        print(log_str)
        cls._logger.warning(log_str)

    @classmethod
    def error(cls, msg: str, *args, **kwargs):
        '''ERROR级日志输出'''
        if LEVEL_DIC["ERROR"] < cls._level:
            return
        log_str = cls._format_msg(f"[ERROR]{msg}", *args, **kwargs)
        print(log_str)
        cls._logger.error(log_str)

    @classmethod
    def critical(cls, msg: str, *args, **kwargs):
        '''CRITICAL级日志输出'''
        if LEVEL_DIC["CRITICAL"] < cls._level:
            return
        log_str = cls._format_msg(f"[CRITICAL]{msg}", *args, **kwargs)
        print(log_str)
        cls._logger.critical(log_str)

    @classmethod
    def exception(cls, msg: str, *args, **kwargs):
        '''EXCEPTION级日志输出（异常专用）'''
        if LEVEL_DIC["EXCEPTION"] < cls._level:
            return
        log_str = cls._format_msg(f"[EXCEPTION]{msg}", *args, **kwargs)
        print(log_str)
        cls._logger.exception(log_str)

    @classmethod
    def get_logger(cls):
        '''获取原生logger对象'''
        return cls._logger

