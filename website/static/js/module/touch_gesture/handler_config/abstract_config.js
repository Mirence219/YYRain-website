/*
TouchGesture
MIT © Mirence
https://github.com/Mirence219/yyrain-website
*/

/**
 * 参数配置抽象基类
 */
export default class AbstractConfig {
    _config;    //配置
    _schema;    //配置校验

    constructor() {
        if (this.constructor.name == "AbstractConfig") {
            throw new Error("禁止实例化抽象基类AbstractHandler");
        }
        this._config = {
            min: -Infinity,
            max: Infinity,
        };
        this._schema = {
            min: { type: ["number", "string"], verification: (val) => this.min_verification(val) },
            max: { type: ["number", "string"], verification: (val) => this.max_verification(val) },
        };
    }

    /**
     * 更新某一项
     * @param {string} opt
     * @param {any} val
     * @returns
     */
    update(opt, val) {
        if (!(Object.prototype.hasOwnProperty.call(this._config, opt))) {
            console.error(`[ERROR] 该处理器不存在 ${opt} 配置参数`);
            return;
        }
        if (this._schema[opt]) {
            if (!this._schema[opt].type.includes(typeof val)) {
                console.error(`[ERROR] 配置参数 ${opt} 必须是"${this._schema[opt].type.join(" 或 ")}" 类型`);
                return;
            }
            const type_list = this._schema[opt].type;
            if (type_list.includes("number")) {
                const { min, max } = this._schema[opt];
                if (typeof val !== "number") {
                    console.error(`[ERROR] 配置参数 ${opt} 必须是数字类型`);
                    return;
                }
                if (min !== undefined && val < min) {
                    console.error(`[ERROR] 配置参数 ${opt} 的值不能小于 ${min}`);
                    return;
                }
                if (max !== undefined && val > max) {
                    console.error(`[ERROR] 配置参数 ${opt} 的值不能大于 ${max}`);
                    return;
                }
            }
            const verification = this._schema.verification;
            if (verification && !verification(val)) {
                console.error(`[ERROR] 配置参数 ${opt} 的值不符合规则`);
                return;
            }
        }

        this._config[opt] = val;
        console.debug(`[DEBUG] 配置参数 ${opt} 已修改为 ${val}`);
    }

    /**
     * 更新多项
     * @param {Object} obj
     */
    update_all(obj) {
        Object.entries(obj).forEach(([key, val]) => { this.update(key, val) });
    }

    max_verification(val) {
        this.max_min_verification(val);
        if (val < this._config.min) {
            return false;
        }
        return true;
    }

    min_verification(val) {
        this.max_min_verification(val);
        if (val > this._config.max) {
            return false;
        }
        return true;
    }

    max_min_verification(val) {
        if (typeof val === "string") {
            const re = /^-?\d+(\.\d+)?%$/;
            if (!re.test(val)) {
                return false;
            }
        }
        return true;
    }
}