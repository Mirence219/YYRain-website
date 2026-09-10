/*
TouchGesture
MIT © Mirence
https://github.com/Mirence219/yyrain-website
*/

import AbstractAxisSampler from "./abstract_axis_sampler.js";

/**
 * 水平坐标采样器
 */
export default class VerticalAxisSampler extends AbstractAxisSampler {

    constructor() {
        super();
        this.axial = "y";
    }

    /**
     * @param {number} y
     * @returns {{y: number, time: number}} 返回最新的采样对象
     */
    record(y) {
        if (typeof y !== "number") {
            console.error("参数错误：请传入数值");
            return;
        }
        const time = performance.now();
        const new_sample = { y: y, time: time };
        this._samples.push(new_sample);
        this._samples = this._samples.filter(new_sample => time - new_sample.time <= 120);
        return new_sample;
    }
}

