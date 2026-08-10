import NormalDomManager from "./normal_dom_manager.js"

export const TriggerMode = Object.freeze({
    CLICK: "click",                // 左键单击
    MOUSE_DOWN: "mousedown",       // 鼠标按下
    MOUSE_UP: "mouseup",           // 鼠标抬起
    DBL_CLICK: "dblclick",         // 左键双击
    CONTEXT_MENU: "contextmenu",   // 右键单击
    MOUSE_ENTER: "mouseenter",     // 鼠标移入
    MOUSE_LEAVE: "mouseleave",     // 鼠标移出
    MOUSE_OVER: "mouseover",       // 鼠标移入(冒泡)
    MOUSE_OUT: "mouseout",         // 鼠标移出(冒泡)
    MOUSE_MOVE: "mousemove",       // 鼠标移动

    KEY_DOWN: "keydown",           // 按键按下
    KEY_UP: "keyup",               // 按键松开

    TOUCH_START: "touchstart",     // 手指按下
    TOUCH_END: "touchend",         // 手指抬起
    TOUCH_MOVE: "touchmove",       // 手指滑动

    FOCUS: "focus",                // 获取焦点
    BLUR: "blur",                  // 失去焦点

    SCROLL: "scroll"               // 区域滚动
});

const TRIGGER_MODE_LIST = Object.values(TriggerMode);

/**
 * 开关类型DOM管理器
 */
export default class SwitchDomManager extends NormalDomManager {
    #state_index;
    #state_count;
    #handlers;
    #trigger_mode;
    #enable;

    /**
     * @param {number} state_count 状态数量，默认为2
     * @param {Array<Function>} handlers 触发事件序列
     * @param {TriggerMode} trigger_mode 触发模式，默认为点击左键
     */
    constructor(state_count = 2, handlers = null, trigger_mode = TriggerMode.CLICK) {
        super();
        console.debug("[DEBUG] 创建开关类型DOM对象管理器");
        if (state_count < 2) {
            throw new Error("开关状态数至少为2");
        }
        if (!TRIGGER_MODE_LIST.includes(trigger_mode)) {
            throw new Error(`不支持的事件触发模式，目前支持下列模式:${TRIGGER_MODE_LIST.join(", ")}`);
        }
        this.#state_count = state_count;
        this.#handlers = handlers;
        this.#trigger_mode = trigger_mode;
        this.#state_index = 0;
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
     * 绑定/切换事件触发函数
     */
    #bind_handler() {
        this._el.addEventListener(this.#trigger_mode, () => {
            console.debug(`[DEBUG] 元素触发${this.#trigger_mode},当前可用状态：${this.#enable ? "可用": "不可用"}`)
            if (this.#enable){
                this.#handlers[this.#state_index]?.();
                this.#state_index = (this.#state_index + 1) % this.#state_count;
            }
        })
    }

    /**
     * 设置状态档位
     * @param {number} state_num 索引，支持输入负索引
     */
    set_state(state_num) {
        if (!Number.isInteger(state_num)) {
            console.error("[ERROR] 设置状态失败：输入的值不是整数")
            return;
        }
        if (!(-this.#state_count <= state_num && state_num < this.#state_count)) {
            console.error("[ERROR] 设置状态失败：超出索引")
            return;
        }
        if (state_num > 0) {
            this.#state_index = state_num;
        }
        else {
            this.#state_index = this.#state_count + state_num;
        }
        console.debug(`[DEBUG] 元素状态设置为${this.#state_index}`);
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
     * 获取元素当前状态档位
     * @returns {number}
     */
    get_state() {
        return this.#state_index;
    }

    /**
     * 查询元素是否可用
     * @returns {boolean}
     */
    is_enable() {
        return this.#enable;
    }
}
