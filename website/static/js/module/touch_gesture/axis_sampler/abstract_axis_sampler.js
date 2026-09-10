/*
TouchGesture
MIT © Mirence
https://github.com/Mirence219/yyrain-website
*/


/**
 * 坐标采样器抽象基类
 */
export default class AbstractAxisSampler {

    constructor() {
        if (this.constructor.name == "AbstractAxisSampler") {
            throw new Error("禁止实例化抽象基类AbstractAxisSampler");
        }
        this._samples = []; //采样点列表
        this.axial = null;
    }

    /**
     * 记录采样点
     * @param {any} val
     */
    record(val) {
        throw new Error("子类必须实现record方法");
    }

    /**
     * 重复记录上一次的记录
     */
    re_record() {
        const time = performance.now();
        const new_sample = structuredClone(this._samples.at(-1));
        new_sample.time = time;
        this._samples.push(new_sample);
        this._samples = this._samples.filter(sample => time - sample.time <= 120);
    }

    /**
     * 清除采样点记录
     */
    clear() {
        this._samples = [];
    }

    /**
     * 返回采样点记录
     * @returns {Object}
     */
    get samples() {
        return this._samples;
    }

    set samples(_) {
        throw new Error("samples为只读属性");
    }
}

