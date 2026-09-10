from flask import Blueprint, redirect, render_template, abort, url_for
import os
import html

from src.db_modle import NewsDetail, NewsList, NewsImg, UserInfo
from src.md_it import render_markdown, extract_headings
from src.constants import IMAGE_DIR

news_bp = Blueprint("news", __name__, url_prefix = "/news")

@news_bp.route("/")
def news():
    '''公告列表'''
    return render_template("news.html")


@news_bp.route("/detail", strict_slashes = False)
def news_detail_redirect():
    '''重定向'''
    return redirect(url_for("news.news"))


@news_bp.route("/detail/<int:news_id>", strict_slashes = False)
def news_detail(news_id):
    '''公告详情页'''
    #公告信息
    news_item = NewsList.query.get(news_id)
    #公告详情
    news_detail = NewsDetail.query.get(news_id)
    #公告封面
    news_cover_info = NewsImg.query.get(news_id)
    if news_cover_info:
        news_cover_id = news_cover_info.img_id
        news_cover_api = f"/api/image/{news_cover_id}"
        news_cover_html = f'<img src="{news_cover_api}" alt="公告封面"/>'
    else:
        news_cover_html = ""
    #公告发布作者
    uid = NewsDetail.query.get(news_id).uid
    user_name = UserInfo.query.get(uid).user_name
    if not (news_item and news_detail) or not news_item.enabled or not news_item.intrasite:
        abort(404)

    #公告目录
    directory_html = ""

    if news_detail.markdown:
        headings = extract_headings(news_detail.content)
        news_detail.content = render_markdown(news_detail.content)
        for heading in headings:
            heading_level = heading["level"]
            heading_id = heading["id"]
            heading_title = heading["title"]
            directory_html += f'<li><a href="#{heading_id}" class="directory_level_{heading_level}">{heading_title}</a></li>'
        directory_html = f'''<div class="news_content_directory_wrap">
                            <div class="box news_content_directory_switch button">
                                目  录
                            </div>
                            <div class="box news_content_directory" data-active="false">
                                <p>目 录</p><hr /><ul>{directory_html}</ul>
                            </div>
                        </div>'''
    else:
        news_detail.content = html.escape(news_detail.content)

    return render_template(
        "news_detail.html", 
        news_detail = news_detail, 
        news_item = news_item, 
        news_cover = news_cover_html, 
        user_name = user_name,
        directory =  directory_html
    )
            
