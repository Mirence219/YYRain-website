/*
TouchGesture
MIT © Mirence
https://github.com/Mirence219/yyrain-website
*/

/**
 * 处理器基类
 */
export default class AbstractHandler {

    constructor(axis_sampler, el, config) {
        if (this.constructor.name == "AbstractHandler") {
            throw new Error("禁止实例化抽象基类AbstractHandler");
        }
        this._axis_sampler = axis_sampler;
        this._cooridinate = null;
        this._config = config;
        this._el = el;
        this._motion = []  //DOM状态数据
        this._output = {};  //输出数据
    }

    /**
     * 开始计算（初始化）
     */
    start() {
        throw new Error("子类必须实现start方法");
    }

    /**
     * 终止计算（暂停）
     */
    stop() {
        throw new Error("子类必须实现stop方法");
    }

    /**
     * 计算数据
     */
    refresh() {
        throw new Error("子类必须实现refresh方法");
    }

    /**
     * 记录运动数据
     */
    _record(obj) {
        this._motion.push(obj);
        /*console.log(`${this.constructor.name}记录了一个运动数据：`, obj);*/
    }

    get result() {
        return this._cooridinate;
    }

    set result(_) {
        throw new Error("result为只读属性");
    }

    get config() {
        return this._config;
    }

    set config(_) {
        throw new Error("config为只读属性");
    }

    get motion() {
        return this._motion;
    }

    get min() {
        return this._config.min;
    }

    get max() {
        return this._config.max;
    }

    get output() {
        return this._output;
    }
}