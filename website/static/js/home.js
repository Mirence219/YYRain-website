import VideoSelector from './module/video_selector.js';
import StateDomManager from "./module/dom_manager/state_dom_manager.js";
import NormalDomManager, { TriggerMode } from "./module/dom_manager/normal_dom_manager.js";
import ButtonDomManager from './module/dom_manager/button_dom_manager.js';
import DomManagerList from './module/dom_manager/dom_manager_list.js';
import OneWayGesture from './module/touch_gesture/one_way_gesture.js';


//节目列表
const video_selector = new VideoSelector("#video");
const VIDEO_API = "/api/video/all";

const video_list_id = "video_list_wrap";
const video_list_dom = new NormalDomManager();
video_list_dom.dom_bind_id(video_list_id);
video_list_dom.init();

const video_player_id = "video";
const video_player_dom = new NormalDomManager();
video_player_dom.dom_bind_id(video_player_id);
video_player_dom.init();

const video_button_class = ".video_button"

axios.get(VIDEO_API)
    .then(res => {
        console.debug("视频数据接收成功：", res.data);
        const video_arr = res.data;
        let flag = false;   //第一个作为默认播放视频
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
                video_player_dom.set_src(item.iframe_url);
                flag = true;
            }
            console.debug("[DEBUG]节目单构建完成");
        });

        queueMicrotask(() => {
            video_selector.init();                // DOM查找元素
            video_selector.bind_buttons(video_button_class); // 绑定点击
        });

        video_list_dom.set_html(html_str || "<li>暂无节目数据</li>");
    })
    .catch(err => {
        console.error("视频加载失败：", err);
        video_list_dom.set_html("<li>连接服务器异常</li>");
    });



//公告列表
const NEWS_COUNT = 7;
const NEWS_API = "api/news";

const news_list_id = "news_list_wrap";
const news_list_dom = new NormalDomManager();
news_list_dom.dom_bind_id(news_list_id);
news_list_dom.init();

let news_data = null;

/**
 * 获取公告列表
 */
async function load_news() {
    try {
        const news_res = await axios.get(NEWS_API, {
            params: { page: 1, size: NEWS_COUNT }
        });

        console.debug('[DEBUG] 公告数据接收成功：', news_res.data);
        news_data = news_res.data.data;
        let html_str = "";

        news_data.forEach(item => {
            let class_list = "news_button button";
            if (item.is_newest === 1) {
                class_list += " newest_news";
            }
            if (item.is_hot === 1) {
                class_list += " hot_news";
            }
            if (Number(item.sort_order) > 0) {
                class_list += " top_news";
            }

            const target_attr = item.url ? 'target="_blank"' : '';
            const href_val = item.url || `./news/detail/${item.id}`;

            html_str += `
                        <li>
                          <a class="${class_list}" href="${href_val}" ${target_attr}>${item.name}</a>
                        </li>
                        <hr />
                      `;
        });

        news_list_dom.set_html(html_str || "<li>暂无公告数据</li>");

    }
    catch (err) {
        console.error("公告加载失败：", err);
        news_list_dom.set_html("<li>连接服务器异常</li>");
    }
}

await load_news();

//公告封面
const img_html_list = [];
const IMAGE_API = "api/image/"
let news_cover_count = 0;

/**
 * 获取公告封面
 */
async function get_news_cover() {
    const promise_arr = news_data.map(async (item) => {
        const cover_api = `api/news_cover`;
        const res = await axios.get(cover_api, { params: { id: item.id } });
        if (res.data.data !== null) {
            const cover_id = res.data.data.img_id;
            console.debug(`[DEBUG] 查询到news_id=${item.id}的封面id为${cover_id}`);
            news_cover_count++;
            return `
            <li>
                <a href="news/detail/${item.id}">
                    <img src="${IMAGE_API}${cover_id}" />
                </a>
                <p>${item.name}</p>
            </li>`;
        }
        console.debug(`[DEBUG] 未查询到news_id=${item.id}的封面`);
        return null; //无封面返回null
    });

    const results = await Promise.all(promise_arr);
    img_html_list.push(...results.filter(html => html !== null));
}

await get_news_cover();
let img_index = 0;  //当前图片索引

/**
 * 切换到下一张图片操作
 */
function next_img() {
    console.info("[INFO] 切换下一张图片");
    news_img_index_list[img_index].set_data("active", "false");
    img_index++;
    switch_img(img_index);
    if (img_index == news_cover_count) {
        img_index = 0;
        news_img_list.el.addEventListener("transitionend", switch_last_img);
    }
    news_img_index_list[img_index].set_data("active", "true");
}

/**
 * 切换到上一张图片操作
 */
function last_img() {
    console.info("[INFO] 切换上一张图片");
    news_img_index_list[img_index].set_data("active", "false");
    img_index--;
    switch_img(img_index);
    if (img_index == -1) {
        img_index = news_cover_count - 1;
        news_img_list.el.addEventListener("transitionend", switch_first_img);
    }
    news_img_index_list[img_index].set_data("active", "true");
}

/**
 * 切换到指定图片
 * @param {number} index
 */
function switch_img(index) {
    console.info(`[INFO] 切换第${index}张图片`);
    const percent = -(index + 1) * 100;
    news_img_list.style.transform = `translateX(${percent}%)`;
}

/**
 * 最后一张回到第一张
 */
function switch_last_img() {
    console.debug("[DEBUG] 回到第一张");
    news_img_list.el.removeEventListener("transitionend", switch_last_img);
    news_img_list.style.transition = "none";
    news_img_list.style.transform = "translateX(-100%)";
    news_img_gestrue.set_enable(false);
    requestAnimationFrame( () =>
        requestAnimationFrame(() => {
            news_img_list.style.transition = "all 0.3s ease";
            news_img_gestrue.set_enable(true);
        })
    )
}

/**
 * 第一张回到最后一张
 */
function switch_first_img() {
    console.debug("[DEBUG] 回到最后一张");
    news_img_list.el.removeEventListener("transitionend", switch_first_img);
    news_img_list.style.transition = "none";
    news_img_list.style.transform = `translateX(${-(news_cover_count) * 100}%)`;
    news_img_gestrue.set_enable(false);
    requestAnimationFrame(() =>
        requestAnimationFrame(() => {
            news_img_list.style.transition = "all 0.3s ease";
            news_img_gestrue.set_enable(true);
        })
    )
}

/**
 * 创建/重置计时器
 * @param {number} callback
 */
function reset_interval(callback, time) {
    if (auto_switch_img != null) {
        clearInterval(auto_switch_img);
        auto_switch_img = null;
    }
    auto_switch_img = setInterval(callback, time);
}

/**
 * 停止/销毁计时器
 */
function stop_interval() {
    if (auto_switch_img != null) {
        clearInterval(auto_switch_img);
        auto_switch_img = null;
    }
}

img_html_list.unshift(img_html_list.at(-1));
img_html_list.push(img_html_list[1]);

const news_img_list = new NormalDomManager();
const news_img_list_id = "news_img_list";
news_img_list.dom_bind_id(news_img_list_id);
news_img_list.init()

const news_img_next_button = new ButtonDomManager(() => { next_img(); reset_interval(next_img, 3500); });
const news_img_next_button_class = "img_next_button";
news_img_next_button.dom_bind_class(news_img_next_button_class);
news_img_next_button.init()

const news_img_last_button = new ButtonDomManager(() => { last_img(); reset_interval(next_img, 3500); });
const news_img_last_button_class = "img_last_button";
news_img_last_button.dom_bind_class(news_img_last_button_class);
news_img_last_button.init();

//公告封面索引点
const news_img_index_warp = new NormalDomManager();
const news_img_index_warp_class = "img_index";
news_img_index_warp.dom_bind_class(news_img_index_warp_class);
news_img_index_warp.init();
let news_img_index_warp_html = "<ul>";
for (let i = 0; i < news_cover_count; i++) {
    news_img_index_warp_html += `<li><div class="index_dot" data-active="${i === 0 ? "true" : "false"}" data-index="${i}"></div></li>`;
}
news_img_index_warp_html += "</ul>"
news_img_index_warp.set_html(news_img_index_warp_html);

const news_img_index_list = [];
for (let i = 0; i < news_cover_count; i++) {
    news_img_index_list.push(new NormalDomManager());
    const css_selector = `.index_dot[data-index="${i}"]`;
    news_img_index_list[i].dom_bind_css(css_selector);
    news_img_index_list[i].init();
}


news_img_list.set_html(img_html_list.join("\n"));

//自动切换图片
let auto_switch_img = null;
reset_interval(next_img, 3500);

//动画期间禁用按钮
news_img_list.el.addEventListener("transitionstart", () => {
    news_img_next_button.set_enable(false);
    news_img_last_button.set_enable(false);
})

news_img_list.el.addEventListener("transitionend", () => {
    news_img_next_button.set_enable(true);
    news_img_last_button.set_enable(true);
})

//绑定触控手势
const news_img_gestrue = new OneWayGesture(news_img_list, "horizontal_page");
news_img_gestrue.update_config("page_num", news_cover_count + 2);
news_img_gestrue.init();

//触控期间禁用自动播放与按钮
news_img_gestrue.add_event_listener("workstart", () => {
    news_img_next_button.set_enable(false);
    news_img_last_button.set_enable(false);
    news_img_list.style.transition = "none";
    stop_interval();
})
news_img_gestrue.add_event_listener("workend", () => {
    news_img_next_button.set_enable(true);
    news_img_last_button.set_enable(true);
    news_img_list.style.transition = "all 0.3s ease";
    reset_interval(next_img, 3500);

    img_index = news_img_gestrue.output.page - 1;   //获取触控结束后的页码
    if (img_index == news_cover_count) {
        img_index = 0;
        switch_last_img();
    }
    if (img_index == -1) {
        img_index = news_cover_count - 1;
        switch_first_img();
    }
    for (const dot of news_img_index_list) {
        dot.set_data("active", "false");
    }
    console.info("[INFO] 当前页码:", img_index);
    news_img_index_list[img_index].set_data("active", "true");
})


//入口按钮
const STANDBY_ICON_SRC = "/static/image/no_icon.svg";
const STANDBY_ICON_CLASS = "no_img";

/**
 * 设置备用图标
 */
function set_standby_icon(icon_dom) {
    icon_dom.el.removeEventListener("error", set_standby_icon)
    icon_dom.add_class(STANDBY_ICON_CLASS);
    console.info("[INFO] 网站图标加载失败，改用备用图标");
}

let favicon_list = new DomManagerList(ButtonDomManager);
favicon_list.bind_doms_css(".entrance_img");
favicon_list.init();

for (const icon of favicon_list) {
    icon.el.addEventListener("error", () => set_standby_icon(icon));
}

setTimeout(() => {
    for (const icon of favicon_list) {
        if (icon.get_class().includes(STANDBY_ICON_CLASS)) {
            icon.set_src(STANDBY_ICON_SRC);
        }
    }
}, 3000);