/*
TouchGesture
MIT © Mirence
https://github.com/Mirence219/yyrain-website
*/

import PageConfig from "../handler_config/page_config.js";
import AbstractHandler from "./abstract_handler.js";

/**
 * 分页滑动处理器
 */
export default class PageHandler extends AbstractHandler {
    #accel;             //实际加速度

    #axial;             //轴向
    #length_name;       //长度名称
    #matrix_name;    

    #start_displacement;  //初始位移
    #start_velocity;    //初始速率
    #start_time;        //初始时间

    #now_displacement     //DOM位移
    #length;            //页长
    #page;              //当前页码（从0开始）
    #max_perc;          //最大位移百分比
    #min_perc;          //最小位移百分比
    #dom_perc           //当前位置百分比

    #now_sample;
    #last_sample;

    #started = false;

    constructor(axis_sampler, el, config) {
        super(axis_sampler, el, config);
        this.#axial = this._axis_sampler.axial;
        if (this.#axial === "x") {
            this.#length_name = "offsetWidth";
            this.#matrix_name = "m41";
        }
        else {
            this.#length_name = "offsetHeight";
            this.#matrix_name = "m42";
        }
        this._config = new PageConfig();
    }

    start() {
        //点击不触发
        if (this._axis_sampler.samples.length <= 2) {
            return;
        }

        this.#now_sample = this._axis_sampler.samples.at(-1);
        this.#last_sample = this._axis_sampler.samples.at(-2);

        const d_time_ms = this.#now_sample.time - this.#last_sample.time;
        const d_displacement = this.#now_sample[this.#axial] - this.#last_sample[this.#axial];
        this.#start_velocity = Math.max(Math.min(d_displacement / (d_time_ms / 1000), this._config.max_velocity), -this._config.max_velocity);
        this.#start_time = this.#now_sample.time;

        this.#length = this._el[this.#length_name];
        const matrix = new WebKitCSSMatrix(getComputedStyle(this._el).transform);
        this.#start_displacement = matrix[this.#matrix_name];

        this.#page = Math.max(0, Math.min(this._config.page_num - 1, - Math.floor(this.#start_displacement / this.#length) - 1)); //页码计算

        const start_prec = this.#start_displacement / this.#length;
        //边缘不触发
        if (start_prec <= parseFloat(this._config.min) / 100 || start_prec >= parseFloat(this._config.max) / 100) {
            if (this.#dom_perc <= this.#min_perc) {
                this.#page = Math.max(0, Math.min(this._config.page_num - 1, this.#page + 1));
            }
            this._output.page = this.#page;
            console.debug(`[DEBUG] 分页滑动：已到达边界，当前页码为${this.#page}`);
            return;
        }

        this.#accel = (-1) ** Math.floor(this.#start_displacement / (this.#length / 2) + 101) * this._config.base_accel;  //根据位置判断加速度方向
        
        this.#min_perc = - this.#page - 1;
        this.#max_perc = - this.#page;

        /*console.log("加速度为：", this.#accel);
        console.log("初速度为：", this.#start_velocity);
        console.log("页码：", this.#page);*/

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
        const displacement = this.#start_velocity * run_time + this.#accel * run_time ** 2 / 2;
        this.#now_displacement = this.#start_displacement + displacement;
        this.#length = this._el[this.#length_name];             //获取当前长度
        this.#dom_perc = this.#now_displacement / this.#length;   //获取当前百分比
        

        const next_accel = (-1) ** Math.floor(this.#now_displacement / (this.#length / 2) + 101) * this._config.base_accel;  //根据位置判断加速度方向
        if (Math.sign(next_accel) !== Math.sign(this.#accel)) {
            this.#accel = next_accel;
            this.#start_displacement = this.#now_displacement;
            this.#start_time = now_time;
        }

        /*console.log("当前时间", run_time);
        console.log("当前位移", displacement);
        console.log("当前加速度", this.#accel);*/

        if (this.#dom_perc <= this.#min_perc || this.#dom_perc >= this.#max_perc) {
            if (this.#dom_perc <= this.#min_perc) {
                this.#dom_perc = this.#min_perc;
                this.#page = this.#page + 1;
            }
            else if (this.#dom_perc >= this.#max_perc) {
                this.#dom_perc = this.#max_perc;
            }
            this._output.page = this.#page;
            console.debug(`[DEBUG] 分页滑动：已到达边界，当前页码为${this.#page}`);
            this.stop();
        }

        if (this._config.percentage) {
            this._record({ coordinate: this.#dom_perc * 100 });   //记录DOM当前百分比位置
        }
        else {
            this._record({ coordinate: this.#now_displacement });   //记录DOM当前位置
        }
    }

    get working() {
        return this.#started;
    }

    set working(_) {
        throw new Error('无法赋值只读属性"working"');
    }
}