/*
TouchGesture
MIT © Mirence
https://github.com/Mirence219/yyrain-website
*/

import AbstractConfig from "./abstract_config.js";


/**
 * 分页滑动参数配置
 */
export default class PageConfig extends AbstractConfig {
    _config;
    constructor() {
        super();
        this._config = {
            max_velocity: 2000,         //最大速度（标量）
            base_accel: 2000,           //基准加速度
            page_num: 1,                //页数
            percentage: true,           //是否使用百分比
            max: 0
        }
        this._schema = {
            max_velocity: { type: ["number"], min: 0 },
            base_accel: { type: ["number"] },
            page_num: { type: ["number"], min: 1 },
            percentage: { type: ["boolean"] }
        };
    }

    get max_velocity() {
        return this._config.max_velocity;
    }

    get base_accel() {
        return this._config.base_accel;
    }

    get page_num() {
        return this._config.page_num;
    }

    get page() {
        return this._config.page;
    }

    set page(num) {
        this._config.page = num;
    }

    get percentage() {
        return this._config.percentage;
    }

    get max() {
        return this._config.max;
    }
    get min() {
        return `${-100 * (this.page_num - 1)}%`;
    }
}