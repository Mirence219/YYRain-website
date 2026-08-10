import SwitchDomManager, { TriggerMode } from "./module/dom_manager/switch_dom_manager.js";
import NormalDomManager from "./module/dom_manager/normal_dom_manager.js";

function index_init() {
    menu_off();
}
function menu_on() {
    menu_button.set_data("state", "on");
    menu.set_data("view", "on");
}

function menu_off() {
    menu_button.set_data("state", "off");
    menu.set_data("view", "off");
}

//移动端菜单按钮
const hardler_list = [menu_on, menu_off];
const menu_button_id = "menu";
const menu_button = new SwitchDomManager(2, hardler_list);
menu_button.dom_bind_id(menu_button_id);
menu_button.init();

//移动端菜单列表
const menu_class = ".menu.mobile";
const menu = new NormalDomManager();
menu.dom_bind_css(menu_class);
menu.init()

//页面初始化
index_init();