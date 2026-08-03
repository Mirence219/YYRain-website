const default_page = 1;
const default_size = 1;
let max_page = 1;
const max_button_count = 5; //最大页码按钮数量(包括首页、末页),小于3会炸

document.addEventListener('DOMContentLoaded', () =>{
    loadNews(default_page, default_size);
    let page_slecter = new PageSlecter();
    page_slecter.bindPageButtonsWarp();
    
});

class PageSlecter {
    constructor() {
        this.page_button_warp = document.getElementById("news_pagination");
        this.page_num_button_list_name = ".page_num_button";
        this.page_next_button_name = ".page_next_button";
        this.page_last_button_name = ".page_last_button";
        this.page_jump_button_name = ".page_jump_button"
        this.page = default_page;
        this.size = default_size;
        console.log("[INFO]页码选择器初始化完成")
    }

    bindPageButtonsWarp() {
            this.page_button_warp.addEventListener("click", (e) => {
                //点击输入框时不触发
                if (e.target.tagName === "INPUT")
                {
                    return;
                }
                const btn = e.target.closest("button, .page_jump_button");
                if (btn === null)
                {
                    return;
                }
                if (btn.classList.contains("page_num_button")) {
                    this.page = Number(btn.dataset.page);
                    loadNews(this.page, this.size);
                    console.log(`[DEBUG]点击：第${this.page}页`)
                }
                else if(btn.classList.contains("page_next_button")) {
                    this.page++;
                    loadNews(this.page, this.size);
                    console.log(`[DEBUG]点击：下一页（第${this.page}页）`)
                }
                else if(btn.classList.contains("page_last_button")) {
                    this.page--;
                    loadNews(this.page, this.size);
                    console.log(`[DEBUG]点击：上一页（第${this.page}页）`)
                }
                else if(btn.classList.contains("page_jump_button")) {
                    const jumpInput = document.getElementById("news_page_jump_input");
                    const jumpPage = parseInt(jumpInput.value);
                    if (!isNaN(jumpPage) && jumpPage >= 1 && jumpPage != this.page && jumpPage <= max_page) {
                        this.page = jumpPage;
                        loadNews(this.page, this.size);
                        console.debug(`[DEBUG]点击：跳转到第${this.page}页`);
                    }
                    else if (jumpPage == this.page) {
                        console.info("[INFO]与本页相同的页码值，不跳转")
                    }
                    else
                    {
                        console.warn("[WARNING]非法的页码值，不跳转")
                    }
                }
            });
        console.log("[INFO]按键容器绑定完成：")
    }
};

//渲染对应页
function loadNews(page, size) {
    axios.get("/api/news",{
            params: {
                page: page,
                size: size
            }
        })
    .then(res => {
        console.log(`公告数据接收成功（页码：${page} 页长：${size}）：`, res.data);
        const newsArr = res.data.data;
        const wrapDom = document.getElementById("news_list_page");
        const paginationDom = document.getElementById("news_pagination");
        let page_num = "";
        let htmlStr = "";

        max_page = res.data.max_page;

        //显示的页码
        let view_page_list = [1];
        if (max_page <= max_button_count)
        {
            for (let i = 2; i <= max_page; i++)
            {
                view_page_list.push(i);
            }
        }
        else
        {
            let start_page = page - Math.floor((max_button_count - 3) / 2);
            let end_page = page + Math.ceil((max_button_count - 3) / 2);
            let right = false;
            let left = false;
            if (start_page <= 2)
            {
                //左侧连接
                left = true;
                end_page += 2 - start_page;
                start_page = 2;
            }
            else if (end_page >= max_page - 1)
            {
                //右侧连接
                right = true;
                start_page -= end_page - (max_page - 1);
                end_page = max_page - 1;
            }
            if (left == false)
            {
                view_page_list.push("...");
            }
            for (let i = start_page; i <= end_page; i++)
            {
                view_page_list.push(i);
            }
            if (right == false)
            {
                view_page_list.push("...");
            }
            console.log(`[DEBUG]页码显示范围：1,${start_page}~${end_page},${max_page}`);
            view_page_list.push(max_page);
        }
        
        for (let i of view_page_list) {
            if (i === "...")
            {
                page_num += `<span class="page_num_ellipsis">...</span>`;
            }
            else if (typeof i === "number")
            {
                if (i == page) {
                    page_num += `<button class="page_num_button current_page_num_button" data-page="${i}" disabled>${i}</button>`;
                } else {
                    page_num += `<button class="page_num_button" data-page="${i}">${i}</button>`;
                }
            }
        }

        if (page <= 1)
        {
            paginationDom.innerHTML = `
            <button class="page_last_button hidden">上一页</button>
                <div>
                    ${page_num}
                </div>
            <button class="page_next_button">下一页</button>`;
        }
        else if (page >= max_page)
        {
            paginationDom.innerHTML = `
            <button class="page_last_button">上一页</button>
                <div>
                    ${page_num}
                </div>
            <button class="page_next_button hidden">下一页</button>`
        }
        else
        {
            paginationDom.innerHTML = `
            <button class="page_last_button">上一页</button>
                <div>
                    ${page_num}
                </div>
            <button class="page_next_button">下一页</button>`;
        }
        paginationDom.innerHTML +=`
            <div class="page_jump_button">
                第<input type="number" class="page_jump_input" id="news_page_jump_input" min="1" max="${max_page}" value="${page}" >页
            </div> `;

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

            const[date, time] = item.creat_time.split(" ");

            htmlStr += `
                <li>
                    <a class="${classList}" href="${item.url}" target="_blank">${item.name}</a>
                    <p>${date}</p>
                </li>
                <hr>
            `;
        });

        wrapDom.innerHTML = htmlStr || "<li>暂无公告数据</li>";
    })
    .catch(err => {
        console.error("公告加载失败：", err);
        const wrapDom = document.getElementById("news_list_wrap");
        wrapDom.innerHTML = "<li>连接服务器异常</li>";
    });
}

