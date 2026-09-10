import NormalDomManager from "./normal_dom_manager.js";

/**
 * DOM管理器列表
 */
export default class DomManagerList {

    #dom_manager_type;
    #inited;
    #el_list;
    #name;
    #dom_manager_list;

    /**
     * @param {string} css_selector CSS选择器
     * @param {NormalDomManager} dom_manager_type DOM管理器类型
     */
    constructor(dom_manager_type = NormalDomManager) {
        if (typeof dom_manager_type !== "function" || !(dom_manager_type.prototype instanceof NormalDomManager)) {
            throw new Error('"参数错误：只能传入NormalDomManager及其派生类实例！');
        }
        this.#dom_manager_type = dom_manager_type;
        this.#inited = false;
        this.#el_list = null;
        this.#name = this.#dom_manager_type.name;
        this.#dom_manager_list = [];    //管理器数组
    }

    /**
     * 初始化
     */
    init() {
        if (this.#inited) {
            console.error(`[ERROR] 初始化失败：该${this.#name}列表已初始化`);
            return;
        }
        if (!this.is_binded()) {
            console.error(`[ERROR] 初始化失败：该${this.#name}列表未绑定过元素`);
            return;
        }

        for (const manager of this.#dom_manager_list) {
            manager.init();
        }

        this.#inited = true;
        console.debug(`[DEBUG] 初始化${this.#name}列表`);
    }

    /**
     * 按CSS选择器批量绑定DOM
     * @param {string} css_selector CSS选择器字符串
     */
    bind_doms_css(css_selector) {
        if (css_selector == null) {
            console.error(`[ERROR] 参数错误："css_selector"不能为 null 或 undefined`);
            return;
        }
        if (this.is_binded()) {
            console.error(`[ERROR] 绑定失败：该${this.#name}实例列表已绑定过元素`);
            return;
        }

        const safe_css_selector = String(css_selector);
        this.#el_list = document.querySelectorAll(safe_css_selector);

        for (const el of this.#el_list) {
            const dom_manager = new this.#dom_manager_type();
            dom_manager.dom_bind_el(el);
            this.#dom_manager_list.push(dom_manager);
        }

        if (this.#el_list === null) {
            console.error(`[ERROR] 绑定失败：找不到符合CSS选择器"${safe_css_selector}"的元素`);
            return;
        }
        console.debug(`[DEBUG] 绑定成功：已绑定一批符合CSS选择器"${safe_css_selector}"的元素，并注册为${this.#name}`);
    }

    /**
     * 是否绑定DOM
     * @returns boolean
     */
    is_binded() {
        return this.#el_list != null;
    }

    /**
     * 是否初始化
     * @returns boolean
     */
    is_inited() {
        return this.#inited;
    }


    /**
     * 生成器
     */
    *[Symbol.iterator]() {
        if (!this.#inited) {
            console.error("[ERROR] 获取管理器对象失败：对象未初始化");
            return;
        }
        if (this.#dom_manager_list.length == 0) {
            console.error("[ERROR] 获取管理器对象失败：对象未绑定元素");
            return;
        }

        for (const manager of this.#dom_manager_list) {
            yield manager;
        }
    }

}