import VideoSelector from './module/video_selector.js';

const video_selector = new VideoSelector("#videoPlayer");
const news_count = 6;

document.addEventListener('DOMContentLoaded', function () {
    // ========== 视频列表 ==========
    axios.get("/api/video/all")
        .then(res => {
            console.log('视频数据接收成功：', res.data);
            const video_arr = res.data;
            const wrap_dom = document.getElementById("video_list_wrap");
            const player_el = document.querySelector("#video");
            let flag = false;
            let html_str = "";

            video_arr.forEach(item => {
                let class_list = "video_button button";

                if (Number(item.sort_order) > 0) {
                    class_list += " top_video";
                }
                if (item.is_newest == 1) {
                    class_list += " newest_video";
                }

                html_str += `
                <li>
                    <div class="${class_list}" data-src="${item.iframe_url}">${item.name}</div>
                </li>
            `;
                if (!flag) {
                    player_el.src = item.iframe_url;
                    flag = true;
                }
                console.log('节目单构建完成');
            });

            queueMicrotask(() => {
                video_selector.init();                // DOM查找元素
                video_selector.bind_buttons(".video_button"); // 绑定点击
            });


            wrap_dom.innerHTML = html_str || "<li>暂无节目数据</li>";
        })
        .catch(err => {
            console.error("视频加载失败：", err);
            const wrap_dom = document.getElementById("video_list_wrap");
            wrap_dom.innerHTML = "<li>连接服务器异常</li>";
        });

    // ========== 公告列表 ==========
    axios.get("/api/news", {
        params: { page: 1, size: news_count }
    })
        .then(res => {
            console.log('公告数据接收成功：', res.data);
            const news_arr = res.data.data;
            const wrap_dom = document.getElementById("news_list_wrap");
            let html_str = "";

            news_arr.forEach(item => {
                let class_list = "news_button button";
                if (item.is_newest == 1) {
                    class_list += " newest_news";
                }
                if (item.is_hot == 1) {
                    class_list += " hot_news";
                }
                if (Number(item.sort_order) > 0) {
                    class_list += " top_news";
                }

                html_str += `
                <li>
                    <a class="${class_list}" href="${item.url}" target="_blank">${item.name}</a>
                </li>
                <hr>
            `;
            });

            wrap_dom.innerHTML = html_str || "<li>暂无公告数据</li>";
        })
        .catch(err => {
            console.error("公告加载失败：", err);
            const wrap_dom = document.getElementById("news_list_wrap");
            wrap_dom.innerHTML = "<li>连接服务器异常</li>";
        });

});