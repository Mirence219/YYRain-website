/*
TouchGesture
MIT © Mirence
https://github.com/Mirence219/yyrain-website
*/

import InertialConfig from "../handler_config/inertial_config.js";
import AbstractHandler from "./abstract_handler.js";

/**
 * 惯性滑动处理器
 */
export default class InertialHandler extends AbstractHandler {
    #accel;             //实际加速度

    #axial;             //轴向
    #start_coordinate;  //水平坐标起点
    #start_velocity;    //初始速率
    #start_time;        //初始时间
    #velocity;          //当前速度
    #next_velocity;     //下一帧速度

    #now_sample;
    #last_sample;

    #started = false;

    constructor(axis_sampler, el, config) {
        super(axis_sampler, el, config);
        this.#axial = this._axis_sampler.axial; 

        this._config = new InertialConfig();
    }

    start() {
        //点击不触发
        if (this._axis_sampler.samples.length <= 2) {
            return;
        }
        
        this.#now_sample = this._axis_sampler.samples.at(-1);
        this.#last_sample = this._axis_sampler.samples.at(-2);

        //静止不触发
        if (this.#now_sample[this.#axial] === this.#last_sample[this.#axial]) {
            return;
        }

        const d_time_ms = this.#now_sample.time - this.#last_sample.time;
        const d_displacement = this.#now_sample[this.#axial] - this.#last_sample[this.#axial];
        this.#start_coordinate = this.#now_sample[this.#axial];
        this.#start_velocity = Math.max(Math.min(d_displacement / (d_time_ms / 1000), this._config.max_velocity), -this._config.max_velocity);
        this.#next_velocity = this.#start_velocity;
        this.#start_time = this.#now_sample.time;
        this.#accel = Math.sign(this.#start_velocity) * this._config.base_accel;
        /*console.log("加速度为：", this.#accel);
        console.log("初速度为：", this.#start_velocity);*/

        this.#started = true;
    }

    stop() {
        this.#started = false;
    }

    refresh() {
        if (!this.#started) {
            console.error("[ERROR] 刷新失败：计算器未启动");
            return;
        }
        const now_time = performance.now();
        const run_time = (now_time - this.#start_time) / 1000;
        this.#velocity = this.#next_velocity;
        this.#next_velocity = this.#start_velocity + run_time * this.#accel; //速度的绝对值减小
        const displacement = this.#start_velocity * run_time + this.#accel * run_time ** 2 / 2;

        /*console.log("当前时间", run_time);
        console.log("当前位移", displacement);
        console.log("当前速度", this.#velocity);*/

        this.#last_sample = this.#now_sample;
        this.#now_sample = this._axis_sampler.record(this.#start_coordinate + displacement); //添加记录并获取最新采样

        if (Math.sign(this.#velocity) !== Math.sign(this.#next_velocity)) {
            this.stop();
        }
    }

    get working() {
        return this.#started;
    }

    set working(_) {
        throw new Error('无法赋值只读属性"working"');
    }
}
