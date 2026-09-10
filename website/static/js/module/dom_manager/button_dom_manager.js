import NormalDomManager, { TriggerMode, TRIGGER_MODE_LIST } from "./normal_dom_manager.js"


export default class ButtonDomManager extends NormalDomManager {

    #handler
    #trigger_mode
    #enable

    constructor(handlers = null, trigger_mode = TriggerMode.CLICK) {
        super();
        console.debug("[DEBUG] 创建按钮类型DOM对象管理器");
        if (!TRIGGER_MODE_LIST.includes(trigger_mode)) {
            throw new Error(`不支持的事件触发模式，目前支持下列模式:${TRIGGER_MODE_LIST.join(", ")}`);
        }
        this.#handler = handlers;
        this.#trigger_mode = trigger_mode;
        this.#enable = true;
    }

    /**
     * 初始化
     */
    init() {
        if (super.init() != 0) {
            return;
        }
        this.#bind_handler();
    }

    /**
     * 绑定回调函数
     */
    #bind_handler() {
        this._el.addEventListener(this.#trigger_mode, () => {
            console.debug(`[DEBUG] 元素触发${this.#trigger_mode},当前可用状态：${this.#enable ? "可用" : "不可用"}`)
            if (this.#enable) {
                this.#handler?.();
            }
        })
    }

    /**
     * 设置元素可用状态
     * @param {boolean} value
     */
    set_enable(value) {
        this.#enable = !!value;
        console.debug(`[DEBUG] 元素可用状态设置为${this.#enable ? "可用" : "不可用"}`);
    }

    /**
     * 查询元素是否可用
     * @returns {boolean}
     */
    is_enable() {
        return this.#enable;
    }
}