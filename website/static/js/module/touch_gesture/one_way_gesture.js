/*
TouchGesture
MIT © Mirence
https://github.com/Mirence219/yyrain-website
*/

import AbstractGesture from "./abstract_gesture.js";
import HorizontalAxisSampler from "./axis_sampler/horizontal_axis_sampler.js";
import VerticalAxisSampler from "./axis_sampler/vertical_axis_sampler.js";
import InertialHandler from "./handler/inertial_handler.js";
import PageHandler from "./handler/page_handler.js";

const PRESET = Object.freeze({
    horizontal_swipe: { sampler: HorizontalAxisSampler, handler: InertialHandler },
    vertical_swipe: { sampler: VerticalAxisSampler, handler: InertialHandler },
    horizontal_page: { sampler: HorizontalAxisSampler, handler: PageHandler },
    vertical_page: { sampler: VerticalAxisSampler, handler: PageHandler },
});

const PRESET_LIST = Object.keys(PRESET);

/**
 * 单向惯性手势
 */
export default class OneWayGesture extends AbstractGesture{

    #start_displacement;     //起始位移
    #start_coordinate;      //起始触摸坐标
    #now_displacement;        //当前位移
    #last_displacement = 0;
    #inited = false;
    #touching = false;
    #last_move_time = 0;
    #move_raf = null;
    #started = false;   //浏览器加载完成

    #matrix;
    #axial;                 //轴向
    #screen_coordinate_name;
    #matrix_name;
    #matrix_index;
    #transform_string;

    #length;     //长度（百分比模式需要）
    #length_name;

    /**
     * @param {AbstractDomManager | HTMLElement} el DOM对象
     * @param {PRESET} preset 预设
     * @param {{min: number|string, max: number|string}} interval 偏移范围
     * @param {boolean} percentage 百分比模式
     */
    constructor(el, preset, config = null) {
        super(el);
        
        if (!(PRESET_LIST.includes(preset))) {
            throw new Error(`不存在预设"${preset}"`);
        }

        if (!(config == null || typeof config === "AbstractConfig")) {
            throw new Error("config必须是AbstractConfig子类对象");
        }

        this._axis_sampler = new PRESET[preset].sampler;
        this._handler = new PRESET[preset].handler(this._axis_sampler, this._el, config);

        this.#axial = this._axis_sampler.axial;
        if (this.#axial === "x") {
            this.#screen_coordinate_name = "screenX";
            this.#matrix_name = "m41";
            this.#matrix_index = "12";
            this.#length_name = "offsetWidth";
            this.#transform_string = "translateX";

        }
        else if (this.#axial === "y") {
            this.#screen_coordinate_name = "screenY";
            this.#matrix_name = "m42";
            this.#matrix_index = "13";
            this.#length_name = "offsetHeight";
            this.#transform_string = "translateY";
        }

        console.info(`[INFO] 创建单向手势模块，预设"${preset}"`);
    }

    init() {
        //按下
        this._el.addEventListener("touchstart", (el) => {
            if (!this._enable) return;
            console.info("[INFO] 单向手势：按下");
            this.#touching = true;
            this.#started = true;
            this._run_event_callback("workstart");
            this._clear();
            this._stop();
            this.#matrix = new WebKitCSSMatrix(getComputedStyle(this._el).transform);  //DOM样式矩阵
            this.#start_displacement = this.#matrix[this.#matrix_name];    //从CSS样式获取当前位移
            this.#now_displacement = this.#start_displacement;
            const touch_list = el.touches[0];
            this.#start_coordinate = touch_list[this.#screen_coordinate_name]; 
            this._record();

            //按住
            const touching_tick = () => {
                if (!this.#touching) return;
                if (performance.now() - this.#last_move_time > 30) { //30ms未移动视为按住
                    console.info("[INFO] 单向手势：按住");
                    this._re_record();
                }
                requestAnimationFrame(touching_tick);
            }

            requestAnimationFrame(touching_tick);
        });

        //移动
        this._el.addEventListener("touchmove", (el) => {
            if (!this.#started) return;
            this.#touching = true;
            this.#last_move_time = performance.now();
            if (this.#move_raf !== null) return;

            this.#move_raf = requestAnimationFrame(() => {
                if (this.#touching) {
                    console.info("[INFO] 单向手势：拖动");
                    const touch_list = el.changedTouches[0];
                    this.#length = this._el[this.#length_name];
                    const max = parseFloat(this._handler._config.max) / 100 * this.#length;
                    const min = parseFloat(this._handler._config.min) / 100 * this.#length;
                    this.#now_displacement = Math.min(max, Math.max(min, this.#start_displacement + (touch_list[this.#screen_coordinate_name] - this.#start_coordinate)));
                    this._record();
                    this._update();
                }
                this.#move_raf = null;
            })
        })

        //松开
        this._el.addEventListener("touchend", () => {
            if (!this.#started) return;
            console.info("[INFO] 单向手势：松开");
            this.#touching = false;
            this._start();
            if (!this._is_handler_working()) {
                this._run_event_callback("workend");
                console.info("[INFO] 单向手势：未计算");
                return;
            }
            console.info("[INFO] 单向手势：开始计算");
            const touch_end = () => {
                if (!this.#touching) { 
                    this._refresh();
                    this._update();
                }
                if (this._is_handler_working()) {
                    requestAnimationFrame(touch_end);
                }
                else if (!this.#touching){
                    this._run_event_callback("workend");
                    console.info("[INFO] 单向手势：动画结束");
                }
            }
            requestAnimationFrame(touch_end);
        })

        //打断
        this._el.addEventListener("touchcancel", () => {
            this.#touching = false;
        })

        this.#inited = true;
        console.info("[INFO] 初始化单向手势");
    }

    /**
     * 记录触摸点
     */
    _record() {
        this._axis_sampler.record(this.#now_displacement);
    }

    /**
     * 重复采样
     */
    _re_record() {
        this._axis_sampler.re_record();
    }

    /**
     * 清除采样记录
     */
    _clear() {
        this._axis_sampler.clear();
    }

    /**
     * 启动计算器
     */
    _start() {
        this._handler.start();
    }

    /**
     * 关闭计算器
     */
    _stop() {
        this._handler.stop();
    }

    /**
     * 计算并刷新DOM位置
     */
    _refresh() {
        this._handler.refresh();
        this.#now_displacement = this._handler.motion.at(-1).coordinate;
    }

    /**
     * 更新DOM位置
     * @returns {number}
     */
    _update() {
        let border = 0;

        if (this._handler._config.percentage) {
            if (this.#touching) {
                this._el.style.transform = `${this.#transform_string}(${this.#now_displacement / this.#length * 100}%)`;
            }
            else {
                this._el.style.transform = `${this.#transform_string}(${this.#now_displacement}%)`;
            }
        }
        else {
            this.#matrix[this.#matrix_name] = this.#now_displacement;
            this._el.style.transform = this.#matrix.toString();
        }
        return border;
    }

    _is_handler_working() {
        return this._handler.working;
    }
}