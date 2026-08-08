//DOM对象管理器抽象基类
export default class AbstractDomManager {
    constructor() {
        if (new.target === AbstractDomManager) {
            throw new Error("不允许实例化抽象基类AbstractDomManager");
        }
        this.el = null;
        this.inited = false;
    }

    //初始化
    init() {
        if (!this.is_binded()) {
            console.error(`[ERROR]初始化失败：该${this.constructor.name}实例未绑定过元素`);
            return;
        }
        this.inited = true;
        console.debug(`[DEBUG]初始化${this.constructor.name}实例`);
    }

    //按class绑定DOM
    dom_bind_class(class_name) {
        if (this.is_binded()) {
            console.error(`[ERROR]绑定失败：该${this.constructor.name}实例已绑定过元素`);
            return;
        }
        this.el = document.querySelector(`.${class_name}`);
        if (this.el === null) {
            console.error(`[ERROR]绑定失败：找不到类为${class_name}的元素`);
            return;
        }
        console.debug(`[DEBUG]绑定成功：已绑定一个类为${class_name}的元素，并注册为${this.constructor.name}`);
    }

    //按id绑定DOM
    dom_bind_id(id_name) {
        if (this.is_binded()) {
            console.error(`[ERROR]绑定失败：该${this.constructor.name}实例已绑定过元素`);
            return;
        }
        this.el = document.querySelector(`#${id_name}`);
        if (this.el === null) {
            console.error(`[ERROR]绑定失败：找不到id为${id_name}的元素`);
            return;
        }
        console.debug(`[DEBUG]绑定成功：已绑定一个id为${id_name}的元素，并注册为${this.constructor.name}`);
    }

    //按tag绑定DOM
    dom_bind_tag(tag_name) {
        if (this.is_binded()) {
            console.error(`[ERROR]绑定失败：该${this.constructor.name}实例已绑定过元素`);
            return;
        }
        this.el = document.querySelector(tag_name);
        if (this.el === null) {
            console.error(`[ERROR]绑定失败：找不到tag为${tag_name}的元素`);
            return;
        }
        console.debug(`[DEBUG]绑定成功：已绑定一个tag为${tag_name}的元素，并注册为${this.constructor.name}`);
    }

    //按data绑定DOM
    dom_bind_data(data_name, data_value = null, relation = "=") {
        if (this.is_binded()) {
            console.error(`[ERROR]绑定失败：该${this.constructor.name}实例已绑定过元素`);
            return;
        }
        if (data_value !== null) {
            this.el = document.querySelector(`[${data_name}${relation}"${data_value}"]`);
            console.debug(`[DEBUG]绑定成功：已绑定一个${data_name}="${data_value}"的元素，并注册为${this.constructor.name}`);
        }
        else {
            this.el = document.querySelector(`[${data_name}]`);
            console.debug(`[DEBUG]绑定成功：已绑定一个拥有属性为${data_name}的元素，并注册为${this.constructor.name}`);
        }
        
        if (this.el === null) {
            console.error(`[ERROR]绑定失败：找不到${data_name}="${data_value}"的元素`);
            return;
        }
    }

    //按CSS样式选择器表达式绑定DOM
    dom_bind_css(css_selector) {
        if (this.is_binded()) {
            console.error(`[ERROR]绑定失败：该${this.constructor.name}实例已绑定过元素`);
            return;
        }
        this.el = document.querySelector(css_selector);
        if (this.el === null) {
            console.error(`[ERROR]绑定失败：找不到符合CSS选择器"${css_selector}"的元素`);
            return;
        }
        console.debug(`[DEBUG]绑定成功：已绑定一个符合CSS选择器"${css_selector}"的元素，并注册为${this.constructor.name}`);
    }

    //绑定DOM对象最近的父级元素
    dom_bind_closed_parent(dom_el) {
        if (this.is_binded()) {
            console.error(`[ERROR]绑定失败：该${this.constructor.name}实例已绑定过元素`);
            return;
        }
        this.el = dom_el.parentElement;
        console.debug(`[DEBUG]绑定成功：已绑定一个的父级元素，并注册为${this.constructor.name}`);
    }

    //绑定DOM对象最近的子级元素
    dom_bind_closed_child(dom_el) {
        if (this.is_binded()) {
            console.error(`[ERROR]绑定失败：该${this.constructor.name}实例已绑定过元素`);
            return;
        }
        this.el = dom_el.firstElementChild;
        if (this.el === null) {
            console.error(`[ERROR]绑定失败：找不到最近的子级元素`);
            return;
        }
        console.debug(`[DEBUG]绑定成功：已绑定一个子级元素，并注册为${this.constructor.name}`);
    }

    //返回当前实例是否已绑定DOM元素
    is_binded() {
        return this.el !== null;
    }

    is_inited() {
        return this.inited;
    }

    //返回当前实例绑定的DOM元素
    get_el() {
        return this.el;
    }
}