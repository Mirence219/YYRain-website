document.addEventListener('DOMContentLoaded', function () {
    // ========== 视频列表 ==========
    axios.get("/api/video/all")
    .then(res => {
        console.log('视频数据接收成功：', res.data);
        const videoArr = res.data;
        const wrapDom = document.getElementById("video_list_wrap");
        let htmlStr = "";

        videoArr.forEach(item => {
            let classList = "video_button button";

            if (Number(item.sort_order) > 0) {
                classList += " top_video";
            }
            if (item.is_newest == 1) {
                classList += " newest_video";
            }

            htmlStr += `
                <li>
                    <div class="${classList}" data-src="${item.iframe_url}">${item.name}</div>
                </li>
            `;
        });

        wrapDom.innerHTML = htmlStr || "<li>暂无节目数据</li>";
    })
    .catch(err => {
        console.error("视频加载失败：", err);
        const wrapDom = document.getElementById("video_list_wrap");
        wrapDom.innerHTML = "<li>网络异常，连接不到后端服务器</li>";
    });

    // ========== 公告列表 ==========
    axios.get("/api/news/all")
    .then(res => {
        console.log('公告数据接收成功：', res.data);
        const newsArr = res.data;
        const wrapDom = document.getElementById("news_list_wrap");
        let htmlStr = "";

        newsArr.forEach(item => {
            let classList = "news_button button";
            if (item.is_newest == 1) {
                classList += " newest_news";
            }
            if (item.is_hot == 1) {
                classList += " hot_news";
            }
            if (Number(item.sort_order) > 0) {
                classList += " top_news";
            }

            htmlStr += `
                <li>
                    <a class="${classList}" href="${item.url}" target="_blank">${item.name}</a>
                </li>
                <hr>
            `;
        });

        wrapDom.innerHTML = htmlStr || "<li>暂无公告数据</li>";
    })
    .catch(err => {
        console.error("公告加载失败：", err);
        const wrapDom = document.getElementById("news_list_wrap");
        wrapDom.innerHTML = "<li>网络异常，连接不到后端服务器</li>";
    });
});