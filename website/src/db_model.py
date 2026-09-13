from src.db_factory import db_factory
from src.logger import Logger
from sqlalchemy import text

db = db_factory.get_db()

class NewsList(db.Model):
    __tablename__ = "news_list"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Text, nullable=False)
    url = db.Column(db.Text, nullable=True)
    intrasite = db.Column(db.Integer, default=1)
    is_newest = db.Column(db.Integer, default=0)
    is_hot = db.Column(db.Integer, default=0)
    enabled = db.Column(db.Integer, default=1)
    sort_order = db.Column(db.Integer, default=0)
    creat_time = db.Column(db.Text, server_default=text("(datetime('now', 'localtime'))"))
    brief_text = db.Column(db.Text, nullable=True)

    __table_args__ = (
        db.CheckConstraint("is_newest IN (0, 1)"),
        db.CheckConstraint("is_hot IN (0, 1)"),
        db.CheckConstraint("enabled IN (0, 1)"),
    )

    Logger.info("数据表news_list校验/创建完成")

    def __repr__(self):
        return f"<NewsList id={self.id}, name={self.name}>"

    def to_dict(self) -> dict:
        '''返回字典'''
        return {
            "id": self.id,
            "name": self.name,
            "url": self.url,
            "intrasite": self.intrasite,
            "is_newest": self.is_newest,
            "is_hot": self.is_hot,
            "enabled": self.enabled,
            "sort_order": self.sort_order,
            "creat_time": self.creat_time,
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


class UserInfo(db.Model):
    __tablename__ = "user_info"

    uid = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.Text, nullable=False)

    Logger.info("数据表user_info校验/创建完成")

    def __repr__(self):
        return f"<UserInfo uid={self.uid}, name={self.user_name}>"

    def to_dict(self) -> dict:
        return {
            "uid": self.uid,
            "user_name": self.user_name,
        }


class NewsDetail(db.Model):
    __tablename__ = "news_detail"

    id = db.Column(db.Integer, db.ForeignKey("news_list.id"), primary_key=True, autoincrement=False)
    uid = db.Column(db.Integer, db.ForeignKey("user_info.uid"), nullable=False)
    title = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    markdown = db.Column(db.Integer, default=0)

    __table_args__ = (
        db.CheckConstraint("markdown IN (0, 1)"),
    )

    Logger.info("数据表news_detail校验/创建完成")

    # 关系
    user = db.relationship(
        "UserInfo",
        backref=db.backref("news_details", lazy="dynamic"),
        foreign_keys=[uid]
    )
    # 由于 id 同时为主键与外键，建立到 NewsList 的一对一关系
    news = db.relationship(
        "NewsList",
        backref=db.backref("detail", uselist=False),
        foreign_keys=[id],
        uselist=False
    )

    def __repr__(self):
        return f"<NewsDetail id={self.id}, title={self.title}, uid={self.uid}>"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "uid": self.uid,
            "title": self.title,
            "content": self.content,
            "markdown": self.markdown,
        }


class ImgInfo(db.Model):
    __tablename__ = "img_info"

    img_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    img_name = db.Column(db.Text, nullable=False)
    img_path = db.Column(db.Text, nullable=False)
    img_hash = db.Column(db.Text, nullable=False, unique=True)
    enable = db.Column(db.Integer, nullable=False, default=1)

    __table_args__ = (
        db.CheckConstraint("enable IN (0, 1)"),
    )

    Logger.info("数据表img_info校验/创建完成")

    def __repr__(self):
        return f"<ImgInfo img_id={self.img_id}, img_name={self.img_name}>"

    def to_dict(self) -> dict:
        return {
            "img_id": self.img_id,
            "img_name": self.img_name,
            "img_path": self.img_path,
            "img_hash": self.img_hash,
            "enable": self.enable,
        }


class NewsImg(db.Model):
    __tablename__ = "news_img"

    news_id = db.Column(db.Integer, db.ForeignKey("news_list.id"), primary_key=True, autoincrement=True)
    img_id = db.Column(db.Integer, db.ForeignKey("img_info.img_id"), nullable=True)

    Logger.info("数据表news_img校验/创建完成")

    # 关系
    news = db.relationship(
        "NewsList",
        backref=db.backref("images", lazy="dynamic"),
        foreign_keys=[news_id]
    )
    img = db.relationship(
        "ImgInfo",
        backref=db.backref("used_in", lazy="dynamic"),
        foreign_keys=[img_id]
    )

    def __repr__(self):
        return f"<NewsImg news_id={self.news_id}, img_id={self.img_id}>"

    def to_dict(self) -> dict:
        return {
            "news_id": self.news_id,
            "img_id": self.img_id,
        }
