from flask import Blueprint, render_template, abort

from src.db_modle import NewList

news_bp = Blueprint("news", __name__)

@news_bp.route("/news")
def news():
    return render_template("news.html")


@news_bp.route("/news/<int:news_id>")
def news_detail(news_id):
    """展示单条公告/新闻的详情页（未启用）"""
    news_item = NewList.query.get(news_id)
    if not news_item or news_item.enabled != 1:
        abort(404)
    return render_template("news_detail.html", news=news_item.to_dict())
