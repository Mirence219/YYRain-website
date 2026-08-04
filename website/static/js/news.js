import get_time_ago from "./moudle/time_ago.js";

const default_page = 1;
const default_size = 9;
let max_page = 1;
const max_button_count = 4; //最大页码按钮数量(包括首页、末页),小于3会炸

document.addEventListener('DOMContentLoaded', () =>{
    load_news(default_page, default_size);
    const page_selector = new PageSelector();
    page_selector.bind_page_buttons_wrap();
});

class PageSelector {
    constructor() {
        this.page_button_wrap = document.getElementById("news_pagination");
        this.page = default_page;
        this.size = default_size;
        console.log("[INFO] 页码选择器初始化完成");
    }

    bind_page_buttons_wrap() {
        if (!this.page_button_wrap) return;
        this.page_button_wrap.addEventListener("click", (event) => {
            // 点击输入框时不触发
            if (event.target.tagName === "INPUT") return;
            const btn_el = event.target.closest("button, .page_jump_button");
            if (!btn_el) return;

            if (btn_el.classList.contains("page_num_button")) {
                this.page = Number(btn_el.dataset.page);
                load_news(this.page, this.size);
                console.log(`[DEBUG] 点击：第${this.page}页`);
            } else if (btn_el.classList.contains("page_next_button")) {
                this.page++;
                load_news(this.page, this.size);
                console.log(`[DEBUG] 点击：下一页（第${this.page}页）`);
            } else if (btn_el.classList.contains("page_last_button")) {
                this.page--;
                load_news(this.page, this.size);
                console.log(`[DEBUG] 点击：上一页（第${this.page}页）`);
            } else if (btn_el.classList.contains("page_jump_button")) {
                const jump_input = document.getElementById("news_page_jump_input");
                const jump_page = parseInt(jump_input.value);
                if (!isNaN(jump_page) && jump_page >= 1 && jump_page != this.page && jump_page <= max_page) {
                    this.page = jump_page;
                    load_news(this.page, this.size);
                    console.debug(`[DEBUG] 跳转到第${this.page}页`);
                } else if (jump_page == this.page) {
                    console.info("[INFO] 与本页相同的页码值，不跳转");
                } else {
                    console.warn("[WARNING] 非法的页码值，不跳转");
                }
            }
        });
        console.log("[INFO] 按键容器绑定完成");
    }
}

function build_pagination_html(page_num_html, page, max_page) {
    return `
            <button class="page_last_button ${page <= 1 ? 'hidden' : ''}">上一页</button>
            <div class="page_numbers">${page_num_html}</div>
            <button class="page_next_button ${page >= max_page ? 'hidden' : ''}">下一页</button>
            `;
}

function load_news(page, size) {
    axios.get("/api/news", {
        params: { page: page, size: size }
    })
    .then(res => {
        console.log(`公告数据接收成功（页码：${page} 页长：${size}）：`, res.data);
        const news_arr = res.data.data || [];
        const wrap_dom = document.getElementById("news_list_page");
        const pagination_dom = document.getElementById("news_pagination");
        let page_num_html = "";
        let html_str = "";

        max_page = res.data.max_page || 1;

        // 计算显示页码
        const view_page_list = [];
        if (max_page <= max_button_count) {
            for (let i = 1; i <= max_page; i++) view_page_list.push(i);
        } else {
            const half = Math.floor((max_button_count - 3) / 2);
            let start_page = page - half;
            let end_page = page + half + ((max_button_count - 3) % 2);
            if (start_page <= 2) { start_page = 2; end_page = start_page + (max_button_count - 3); }
            if (end_page >= max_page - 1) { end_page = max_page - 1; start_page = end_page - (max_button_count - 3); }

            view_page_list.push(1);
            if (start_page > 2) view_page_list.push("...");
            for (let i = start_page; i <= end_page; i++) view_page_list.push(i);
            if (end_page < max_page - 1) view_page_list.push("...");
            view_page_list.push(max_page);
        }

        for (const i of view_page_list) {
            if (i === "...") {
                page_num_html += `<span class="page_num_ellipsis">...</span>`;
            } else {
                if (i == page) page_num_html += `<button class="page_num_button current_page_num_button" data-page="${i}" disabled>${i}</button>`;
                else page_num_html += `<button class="page_num_button" data-page="${i}">${i}</button>`;
            }
        }

        if (pagination_dom) {
            pagination_dom.innerHTML = build_pagination_html(page_num_html, page, max_page) + `\n` +
                `<div class="page_jump_button">第<input type="number" class="page_jump_input" id="news_page_jump_input" min="1" max="${max_page}" value="${page}" >页</div>`;
        }

        for (const item of news_arr) {
            let class_list = "news_button button";
            if (item.is_newest == 1) class_list += " newest_news";
            if (item.is_hot == 1) class_list += " hot_news";
            if (Number(item.sort_order) > 0) class_list += " top_news";

            const [date, time] = (item.creat_time || '').split(" ");
            const date_str = get_time_ago(date)

            html_str += `
                <li>
                    <a class="${class_list}" href="${item.url}" target="_blank">${item.name}</a>
                    <div class="news_brief">${item.brief_text || ''}</div>
                    <div class="news_meta">${date_str || ''}</div>
                </li>
                <hr>
            `;
        }

        if (wrap_dom) wrap_dom.innerHTML = html_str || "<li>暂无公告数据</li>";
    })
    .catch(err => {
        console.error("公告加载失败：", err);
        const wrap_dom = document.getElementById("news_list_page");
        if (wrap_dom) wrap_dom.innerHTML = "<li>连接服务器异常</li>";
    });
}
