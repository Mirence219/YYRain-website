from flask import Blueprint, request, jsonify, render_template, send_file
from pytest import param
from src.db_model import NewsList, VideoList, ImgInfo, NewsImg, UserInfo
from src.constants import IMAGE_DIR

import os


api_bp = Blueprint("api", __name__, url_prefix="/api")

@api_bp.route("/news/all")
def get_all_news():
    '''返回新闻列表json'''
    new_lists = NewsList.query.filter(NewsList.enabled == 1).order_by(NewsList.sort_order.desc(), NewsList.id.desc()).all()
    return jsonify([new_list.to_dict() for new_list in new_lists])


@api_bp.route("/news", methods=["GET"])
def get_news():
    '''返回单页、单个新闻详情json'''
    page = request.args.get("page", 1, type=int)
    size = request.args.get("size", 10, type=int)
    news_id = request.args.get("id", -1, type=int)

    if news_id != -1:
        news = NewsList.query.get(news_id)
        if not news:
            return jsonify({"error":"news不存在"})
        return jsonify(news.to_dict())
            
    news_lists = NewsList.query.filter(NewsList.enabled == 1).order_by(NewsList.sort_order.desc(), NewsList.id.desc()).paginate(page=page, per_page=size, error_out=False)
    max_page = news_lists.pages
    json_dict = {
        "max_page": max_page,
        "data": [news_list.to_dict() for news_list in news_lists.items]
    }
    return jsonify(json_dict)


@api_bp.route("/video/all")
def video_list():
    '''返回视频列表json'''
    video_lists = VideoList.query.filter(VideoList.enabled == 1).order_by(VideoList.sort_order.desc(), VideoList.id.desc()).all()
    return jsonify([video_list.to_dict() for video_list in video_lists])


@api_bp.route("/image/<int:img_id>")
def get_img(img_id):
    '''返回单个图片'''
    img = ImgInfo.query.get(img_id)
    if not img or not img.enable:
        return render_template("error/404.html"), 404
    
    img_path = os.path.join(IMAGE_DIR, img.img_path if img.img_path else "undefined")
    img_name = img.img_name if img.img_name else "image"
    img_type = img_path.split(".")[-1] if "." in img_path else "jpg"

    try:
        resp = send_file(img_path, mimetype=f'image/{img_type}', as_attachment=True, download_name=img_name)
        resp.headers["Cache-Control"] = "public, max-age=31536000"
        resp.headers["Content-Disposition"] = f'inline; filename="{img_name}"'
    
        return resp
    except:
        return render_template("error/404.html"), 404


@api_bp.route("/news_cover", methods = ["GET"])
def get_news_cover_id():
    '''返回封面编号'''
    news_id = request.args.get("id", type = int)
    if (news_id is None):
        return jsonify({"code": 400, "msg": "id参数必须为数字", "data": None}), 400

    news_cover_info = NewsImg.query.get(news_id)
    if not news_cover_info:
        return jsonify({"code": 0, "data": None})
    return jsonify({"code": 0, "data": news_cover_info.to_dict()})


@api_bp.route("/user_info", methods = ["GET"])
def get_user_info():
    uid = request.arg.get("uid", type = int)
    if (uid is None):
        return jsonify({"code": 400, "msg": "uid参数必须为数字", "data": None}), 400

    user_info = UserInfo.query.get(uid)
    if not user_info:
        return jsonify({"code": 0, "data": None})
    return jsonify({"code": 0, "data": {user_info.to_dict()}})
