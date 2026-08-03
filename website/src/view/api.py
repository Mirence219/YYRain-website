from flask import Blueprint, request, jsonify
from src.db_modle import NewList, VideoList

api_bp = Blueprint("api", __name__, url_prefix="/api")

@api_bp.route("/news/all")
def get_all_news():
    '''返回新闻列表json'''
    new_lists = NewList.query.filter(NewList.enabled == 1).order_by(NewList.sort_order.desc(), NewList.id.desc()).all()
    return jsonify([new_list.to_dict() for new_list in new_lists])


@api_bp.route("/news", methods=["GET"])
def get_news():
    '''返回单页、单个新闻详情json'''
    page = request.args.get("page", 1, type=int)
    size = request.args.get("size", 10, type=int)
    news_id = request.args.get("id", -1, type=int)

    if news_id != -1:
        news = NewList.query.get(news_id)
        if not news:
            return jsonify({"error":"news不存在"})
        return jsonify(news.to_dict())
            
    news_lists = NewList.query.filter(NewList.enabled == 1).order_by(NewList.sort_order.desc(), NewList.id.desc()).paginate(page=page, per_page=size, error_out=False)
    max_page = news_lists.pages
    json_dict = {
        "max_page": max_page,
        "data": [news_list.to_dict() for news_list in news_lists.items]
    }
    return jsonify(json_dict)


@api_bp.route("/video/all", methods=["GET"])
def video_list():
    '''返回视频列表json'''
    video_lists = VideoList.query.filter(VideoList.enabled == 1).order_by(VideoList.sort_order.desc(), VideoList.id.desc()).all()
    return jsonify([video_list.to_dict() for video_list in video_lists])
