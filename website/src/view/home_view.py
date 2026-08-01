from flask import Blueprint, render_template, request, jsonify

from src.db_modle import NewList, VideoList

home_bp = Blueprint("home", __name__)

@home_bp.route("/")
def home():
    return render_template("home.html")

@home_bp.route("/api/news/all", methods=["GET"])
def new_list():
    '''返回新闻列表json'''
    new_lists = NewList.query.filter(NewList.enabled == 1).order_by(NewList.sort_order.desc(), NewList.id.desc()).all()
    return jsonify([new_list.to_dict() for new_list in new_lists])

@home_bp.route("/api/video/all", methods=["GET"])
def video_list():
    '''返回视频列表json'''
    video_lists = VideoList.query.filter(VideoList.enabled == 1).order_by(VideoList.sort_order.desc(), VideoList.id.desc()).all()
    return jsonify([video_list.to_dict() for video_list in video_lists])
