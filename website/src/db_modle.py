from src.db_factory import db_factory
from src.logger import Logger

db = db_factory.get_db()

class NewList(db.Model):
    __tablename__ = "news_list"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Text, nullable=False)
    url = db.Column(db.Text, nullable=False)
    is_newest = db.Column(db.Integer, default=0)
    is_hot = db.Column(db.Integer, default=0)
    enabled = db.Column(db.Integer, default=1)
    sort_order = db.Column(db.Integer, default=0)
    creat_time = db.Column(db.Text, default=db.func.current_timestamp())
    content_text = db.Column(db.Text, nullable=True)
    brief_text = db.Column(db.Text, nullable=True)

    __table_args__ = (
        db.CheckConstraint("is_newest IN (0, 1)"),
        db.CheckConstraint("is_hot IN (0, 1)"),
        db.CheckConstraint("enabled IN (0, 1)"),
    )

    Logger.info("数据表news_list校验/创建完成")

    def __repr__(self):
        return f"<NewList id={self.id}, name={self.name}>"

    def to_dict(self) -> dict:
        '''返回字典'''
        return {
            "id": self.id,
            "name": self.name,
            "url": self.url,
            "is_newest": self.is_newest,
            "is_hot": self.is_hot,
            "enabled": self.enabled,
            "sort_order": self.sort_order,
            "creat_time": self.creat_time,
            "content_text": self.content_text,
            "brief_text": self.brief_text
        }


class VideoList(db.Model):
    __tablename__ = "video_list"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    bid = db.Column(db.Text, nullable=False)
    name = db.Column(db.Text, nullable=True)
    video_url = db.Column(db.Text, nullable=True)
    iframe_url = db.Column(db.Text, nullable=True)
    sort_order = db.Column(db.Integer, default=0)
    enabled = db.Column(db.Integer, default=1)
    create_time = db.Column(db.Text, default=db.func.current_timestamp())
    is_newest = db.Column(db.Integer, default=0)

    __table_args__ = (
        db.CheckConstraint("enabled IN (0, 1)"),
    )

    Logger.info("数据表video_list校验/创建完成")

    def __repr__(self):
        return f"<VideoList id={self.id}, bid={self.bid}, name={self.name}>"

    def to_dict(self) -> dict:
        '''返回字典'''
        return {
            "id": self.id,
            "bid": self.bid,
            "name": self.name,
            "video_url": self.video_url,
            "iframe_url": self.iframe_url,
            "sort_order": self.sort_order,
            "enabled": self.enabled,
            "create_time": self.create_time,
            "is_newest": self.is_newest 
        }
