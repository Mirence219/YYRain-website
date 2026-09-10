/*
TouchGesture
MIT © Mirence
https://github.com/Mirence219/yyrain-website
*/

import AbstractConfig from "./abstract_config.js";


/**
 * 惯性滑动参数配置
 */
export default class InertialConfig extends AbstractConfig {
    _config;
    constructor() {
        super();
        this._config = {
            max_velocity : 2000,    //最大速度（标量）
            base_accel: -2000,     //基准加速度
        }
        this._schema = {
            max_velocity: { type: ["number"], min: 0 },
            base_accel: { type: ["number"] },
        };
    }

    get max_velocity() {
        return this._config.max_velocity;
    }

    get base_accel() {
        return this._config.base_accel;
    }
}