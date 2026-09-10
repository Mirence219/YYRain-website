import ButtonDomManager from "./module/dom_manager/button_dom_manager.js";
import NormalDomManager from "./module/dom_manager/normal_dom_manager.js";

//目录
const directory = new NormalDomManager;
const directory_class = "news_content_directory";
directory.dom_bind_class(directory_class);
directory.init();

//目录开关
const directory_switch = new ButtonDomManager(() => {
    directory.set_data("active", "true");
})
const directory_switch_class = "news_content_directory_switch";
directory_switch.dom_bind_class(directory_switch_class);
directory_switch.init()

//点击外部关闭目录
document.addEventListener("click", (e) => {
    if (!directory.el.contains(e.target) && !directory_switch.el.contains(e.target)) {
        if (directory.get_data("active") === "true") {
            console.info("[INFO] 关闭菜单");
            directory.set_data("active", "false");
            const anm = directory_switch.style.animation;
            directory_switch.style.animation = "none";
            requestAnimationFrame(() => {
                directory_switch.style.animation = anm;
            })
        }
    }
})