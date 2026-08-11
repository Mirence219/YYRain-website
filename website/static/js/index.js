import SwitchDomManager, { TriggerMode } from "./module/dom_manager/switch_dom_manager.js";
import NormalDomManager from "./module/dom_manager/normal_dom_manager.js";

/**
 * 导航栏初始化
 */
function index_init() {
    menu_off();
    let default_theme = localStorage.getItem("theme");
    if (default_theme == null) default_theme = THEME.WHITE;
    console.log(default_theme);
    const default_theme_state = THEME_LIST.indexOf(default_theme);
    theme_button.set_state(default_theme_state);
    set_logo(default_theme);
    set_theme_img(default_theme);
    theme_img.set_hidden(false);  //避免闪烁，手动显示
    console.info("[INFO] 导航栏初始化完成");
}

//创建跟页面DOM管理器
const root_css = ":root";
const root_manager = new NormalDomManager();
root_manager.dom_bind_css(root_css);
root_manager.init();


function menu_on() {
    menu_button.set_data("state", "on");
    menu.set_data("view", "on");
}

function menu_off() {
    menu_button.set_data("state", "off");
    menu.set_data("view", "off");
}

//移动端菜单按钮
const menu_button_id = "menu";
const menu_handler_list = [menu_on, menu_off];
const menu_button = new SwitchDomManager(2, menu_handler_list);
menu_button.dom_bind_id(menu_button_id);
menu_button.init();

//移动端菜单列表
const menu_id = "mobile_menu";
const menu = new NormalDomManager();
menu.dom_bind_id(menu_id);
menu.init()


/**
 * 设置主题样式
 * @param {THEME} theme_name
 */
function set_theme(theme_name) {
    root_manager.set_data("theme", theme_name);
    localStorage.setItem("theme", theme_name);
    set_logo(theme_name);
    set_theme_img(theme_name);
    play_animation();
    console.info(`[INFO] 主题已设置为"${theme_name}"`);
}

/**
 * 修改主题按钮图标
 * @param {any} theme_name
 */
function set_theme_img(theme_name) {
    if (theme_name === THEME.WHITE) {
        theme_img.set_src("/static/image/theme_white.svg");
        theme_button.set_title("切换主题（当前：极昼白）");
    }
    else if (theme_name === THEME.DARK) {
        theme_img.set_src("/static/image/theme_dark.svg");
        theme_button.set_title("切换主题（当前：深空灰）");
    }
    else if (theme_name === THEME.PINK) {
        theme_img.set_src("/static/image/theme_pink.svg");
        theme_button.set_title("切换主题（当前：樱花粉）");
    }
}

/**
 * 修改logo主题样式
 * @param {THEME} theme_name
 */
function set_logo(theme_name) {
    if (theme_name === "dark") {
        logo.set_src("/static/image/nr_logo_dark.webp");
    }
    else {
        logo.set_src("/static/image/nr_logo.webp");
    }
}

/**
 * 播放按钮图标动画
 */
function play_animation() {
    theme_img.remove_class("fade_in_round");
    theme_img.el.offsetWidth;
    theme_img.add_class("fade_in_round");
}


//主题名称列表
const THEME = Object.freeze({
    WHITE: "white",
    DARK: "dark",
    PINK: "pink",
});
const THEME_LIST = Object.values(THEME);

//主题切换按钮
const theme_button_id = "theme_button";
const theme_handler_list = [
    () => set_theme(THEME.DARK),
    () => set_theme(THEME.PINK),
    () => set_theme(THEME.WHITE)
];
const theme_button = new SwitchDomManager(3, theme_handler_list);
theme_button.dom_bind_id(theme_button_id);
theme_button.init();

//主题按钮图标
const theme_img_id = "theme";
const theme_img = new NormalDomManager();
theme_img.dom_bind_id(theme_img_id);
theme_img.init();

//导航栏图标
const logo_id = "logo";
const logo = new NormalDomManager();
logo.dom_bind_id(logo_id);
logo.init();


//页面初始化
index_init();