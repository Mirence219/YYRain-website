/*
TouchGesture
MIT © Mirence
https://github.com/Mirence219/yyrain-website
*/

import { DomManagerSymbol } from "../dom_manager/normal_dom_manager.js";

/**
 * 手势基类
 */
export default class AbstractGesture {
    constructor(el) {
        if (this.constructor.name == "AbstractGesture") {
            throw new Error("禁止实例化抽象基类AbstractGesture");
        }
        if (!(el?.[DomManagerSymbol] || el instanceof HTMLElement)) {
            throw new Error("只能传入原生DOM或DomManager对象")
        }
        if (el?.[DomManagerSymbol]) {
            this._el = el.el;
        }
        else {
            this._el = el;
        }
        this._axis_sampler = null;
        this._handler = null;
        this._callback_list = {
            workstart: [],
            workend: []
        };
        this._enable = true;
        console.info(`[INFO] 创建${this.constructor.name}模块，接收了一个${this._el.constructor.name}`);
    }

    /**
     * 添加监听事件回调
     * @param {string} event
     * @param {Function} callback
     */
    add_event_listener(event, callback) {
        if (typeof callback !== "function") {
            console.error("[ERROR] 监听失败：只能传入函数");
            return;
        }
        this._callback_list[event].push(callback);
    }

    /**
     * 删除监听事件回调
     * @param {sting} event
     * @param {Function} callback
     */
    remove_event_listener(event, callback) {
        if (typeof callback !== "function") {
            console.error("[ERROR] 监听失败：只能传入函数");
            return;
        }
        this._callback_list[event] = this._callback_list[event].filter(fn => fn !== callback);
    }

    /**
     * 执行回调函数
     * @param {string} event
     */
    _run_event_callback(event) {
        this._callback_list[event].forEach(fn => {
            try {
                fn();
            }
            catch (e) {
                console.error("[ERROR] 回调函数报错：", e);
            }
        });
    }

    /**
     * 更新某一项
     * @param {string} opt
     * @param {any} val
     */
    update_config(opt, val) {
        this._handler.config.update(opt, val);
    }


    /**
     * 更新多项
     * @param {Object} obj
     */
    update_all_config(obj) {
        this._handler.config.update_all(obj);
    }

    /**
     * 替换配置对象
     * @param {AbstractConfig} config
     * @returns
     */
    set_config(config) {
        if (!(typeof config === "AbstractConfig")) {
            console.error("配置失败：只能传入AbstractConfig子类对象");
            return;
        }
        this._handler.config = config;
    }

    set_enable(enable) {
        this._enable = !!enable;
    }

    get enable() {
        return this._enable;
    }

    get output() {
        return this._handler.output;
    }
}