/*
TouchGesture
MIT © Mirence
https://github.com/Mirence219/yyrain-website
*/

import AbstractAxisSampler from "./abstract_axis_sampler.js";

/**
 * 水平坐标采样器
 */
export default class HorizontalAxisSampler extends AbstractAxisSampler{

    constructor() {
        super();
        this.axial = "x";
    }

    /**
     * @param {number} x
     * @returns {{x: number, time: number}} 返回最新的采样对象
     */
    record(x) {
        if (typeof x !== "number") {
            console.error("参数错误：请传入数值");
            return;
        }

        const time = performance.now();
        const new_sample = { x: x, time: time };
        this._samples.push(new_sample);
        this._samples = this._samples.filter(new_sample => time - new_sample.time <= 120);
        return new_sample;
    }
}

