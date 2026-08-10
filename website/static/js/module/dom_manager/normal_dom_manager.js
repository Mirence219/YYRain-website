/**
 * 普通DOM管理器
 */
export default class NormalDomManager {
    constructor() {
        this._el = null;
        this.inited = false;
    }

    /**
     * 初始化
     * 先绑定再初始化
     */
    init() {
        if (!this.is_binded()) {
            console.error(`[ERROR]初始化失败：该${this.constructor.name}实例未绑定过元素`);
            return -1;
        }
        this.inited = true;
        console.debug(`[DEBUG]初始化${this.constructor.name}实例`);
        return 0;
    }
    /**
     * 按class绑定DOM
     * @param {string} class_name
     * @returns
     */
    dom_bind_class(class_name) {
        if (class_name == null) {
            console.error(`[ERROR] 参数错误："class_name"不能为 null 或 undefined`);
            return;
        }
        if (this.is_binded()) {
            console.error(`[ERROR]绑定失败：该${this.constructor.name}实例已绑定过元素`);
            return;
        }
        
        const safe_class_name = CSS.escape(String(class_name));
        this._el = document.querySelector(`.${safe_class_name}`);
        if (this._el === null) {
            console.error(`[ERROR]绑定失败：找不到类为${safe_class_name}的元素`);
            return;
        }
        console.debug(`[DEBUG]绑定成功：已绑定一个类为${safe_class_name}的元素，并注册为${this.constructor.name}`);
    }

    /**
     * 按id绑定DOM
     * @param {string} id_name
     * @returns
     */
    dom_bind_id(id_name) {
        if (id_name == null) {
            console.error(`[ERROR] 参数错误："id_name"不能为 null 或 undefined`);
            return;
        }
        if (this.is_binded()) {
            console.error(`[ERROR]绑定失败：该${this.constructor.name}实例已绑定过元素`);
            return;
        }

        const safe_id_name = CSS.escape(String(id_name));
        this._el = document.querySelector(`#${safe_id_name}`);
        if (this._el === null) {
            console.error(`[ERROR]绑定失败：找不到id为${safe_id_name}的元素`);
            return;
        }
        console.debug(`[DEBUG]绑定成功：已绑定一个id为${safe_id_name}的元素，并注册为${this.constructor.name}`);
    }

    /**
     * 按tag绑定DOM
     * @param {string} tag_name
     * @returns
     */
    dom_bind_tag(tag_name) {
        if (tag_name == null) {
            console.error(`[ERROR] 参数错误："tag_name"不能为 null 或 undefined`);
            return;
        }
        if (this.is_binded()) {
            console.error(`[ERROR]绑定失败：该${this.constructor.name}实例已绑定过元素`);
            return;
        }

        const safe_tag_name = CSS.escape(String(tag_name));
        this._el = document.querySelector(safe_tag_name);
        if (this._el === null) {
            console.error(`[ERROR]绑定失败：找不到tag为${safe_tag_name}的元素`);
            return;
        }
        console.debug(`[DEBUG]绑定成功：已绑定一个tag为${safe_tag_name}的元素，并注册为${this.constructor.name}`);
    }

    /**
     * 按data绑定DOM
     * @param {string} data_name 属性名（传入时需包含"data-"）
     * @param {string} data_value 属性值（不受转义符影响）
     * @param {"=" | "^=" | "$=" | "*=" | "~=" | "|="} relation 查询关系
     * @param {"i" | "s"} modifier 修饰符
     * @returns
     */
    dom_bind_data(data_name, data_value = null, relation = "=", modifier = null) {
        if (data_name == null) {
            console.error(`[ERROR] 参数错误："data_name"不能为 null 或 undefined`);
            return;
        }
        if (this.is_binded()) {
            console.error(`[ERROR]绑定失败：该${this.constructor.name}实例已绑定过元素`);
            return;
        }

        let safe_data_value = null;

        const VAILD_RELATIONS = ["=", "^=", "$=", "*=", "~=", "|="];
        const VAILD_MODIFIERS = ["i", "s"];
        if (!VAILD_RELATIONS.includes(relation)) {
            console.error(`[ERROR] 绑定失败：不支持的关系符号"${relation}，仅支持：${VAILD_RELATIONS.join(", ")}"`);
            return;
        }

        if (modifier != null && !VAILD_MODIFIERS.includes(modifier)) {
            console.error(`[ERROR] 绑定失败：不支持的修饰符"${modifier}，仅支持：${VAILD_MODIFIERS.join(", ")}"`);
            return;
        }

        if (data_value !== null) {
            safe_data_value = CSS.escape(String(data_value));
        }

        const data_selector = (`[${data_name}${safe_data_value !== null ? `${relation}"${safe_data_value}"` : ""}${modifier !== null ? ` ${modifier}` : ""}]`)
        this._el = document.querySelector(data_selector);
        
        if (this._el === null) {
            console.error(`[ERROR]绑定失败：找不到${data_selector}的元素`);
            return;
        }
        console.debug(`[DEBUG] 绑定成功：已绑定一个符合属性${data_selector}的元素，并注册为${this.constructor.name}`);
    }

    /**
     * 按CSS样式选择器表达式绑定DOM
     * @param {string} css_selector
     */
    dom_bind_css(css_selector) {
        if (css_selector == null) {
            console.error(`[ERROR] 参数错误："css_selector"不能为 null 或 undefined`);
            return;
        }
        if (this.is_binded()) {
            console.error(`[ERROR]绑定失败：该${this.constructor.name}实例已绑定过元素`);
            return;
        }

        const safe_css_selector = String(css_selector);
        this._el = document.querySelector(safe_css_selector);
        if (this._el === null) {
            console.error(`[ERROR]绑定失败：找不到符合CSS选择器"${safe_css_selector}"的元素`);
            return;
        }
        console.debug(`[DEBUG]绑定成功：已绑定一个符合CSS选择器"${safe_css_selector}"的元素，并注册为${this.constructor.name}`);
    }

    /**
     * 绑定DOM对象最近的父级元素
     * @param {HTMLElement | NormalDomManager} dom_el DOM对象（原生和管理器皆可）
     */
    dom_bind_closed_parent(dom_el) {
        if (dom_el == null) {
            console.error(`[ERROR] 参数错误："dom_el"不能为 null 或 undefined`);
            return;
        }
        if (this.is_binded()) {
            console.error(`[ERROR] 绑定失败：该${this.constructor.name}实例已绑定过元素`);
            return;
        }

        let safe_dom_el = null;
        if (dom_el instanceof HTMLElement) {
            safe_dom_el = dom_el;
        }
        else if (dom_el instanceof NormalDomManager) {
            safe_dom_el = dom_el.get_el();
        }
        else {
            console.error(`[ERROR] 绑定失败：传入的不是DOM管理器对象或者原生对象`);
            return;
        }
        if (safe_dom_el == null) {
            console.error(`[ERROR] 绑定失败：传入的DOM为null或undefined)`);
            return;
        }

        try {
            this._el = safe_dom_el.parentElement;
        }
        catch (e) {
            console.error(`[ERROR] 绑定失败：报错：${e}`);
            return;
        }
        
        console.debug(`[DEBUG] 绑定成功：已绑定一个的父级元素，并注册为${this.constructor.name}`);
    }

    /**
     * 绑定DOM对象最近的子级元素
     * @param {HTMLElement | NormalDomManager} dom_el DOM对象（原生和管理器皆可）
     * @returns
     */
    dom_bind_closed_child(dom_el) {
        if (dom_el == null) {
            console.error(`[ERROR] 参数错误："dom_el"不能为 null 或 undefined`);
            return;
        }
        if (this.is_binded()) {
            console.error(`[ERROR]绑定失败：该${this.constructor.name}实例已绑定过元素`);
            return;
        }

        let safe_dom_el = null;
        if (dom_el instanceof HTMLElement) {
            safe_dom_el = dom_el;
        }
        else if (dom_el instanceof NormalDomManager) {
            safe_dom_el = dom_el.get_el();
        }
        else {
            console.error(`[ERROR] 绑定失败：传入的不是DOM管理器对象或者原生对象`);
            return;
        }
        if (safe_dom_el == null) {
            console.error(`[ERROR] 绑定失败：传入的DOM为null或undefined)`);
            return;
        }

        try {
            this._el = safe_dom_el.firstElementChild;
        }
        catch (e) {
            console.error(`[ERROR] 绑定失败：报错：${e}`);
            return;
        }
        
        if (this._el === null) {
            console.error(`[ERROR]绑定失败：找不到最近的子级元素`);
            return;
        }
        console.debug(`[DEBUG] 绑定成功：已绑定一个子级元素，并注册为${this.constructor.name}`);
    }

    /**
     * 返回当前实例是否已绑定DOM元素
     */
    is_binded() {
        return this._el !== null;
    }

    /**
     * 返回当前实例是否初始化
     */
    is_inited() {
        return this.inited;
    }

    /**
     * 返回当前实例绑定的DOM元素
     * @returns
     */
    get_el() {
        return this._el;
    }

    /**
     * 设置DOM的类属性
     * @param {Array<string> | string} class_list 类属性数组（多个）或字符串（单个）
     */
    set_class(class_list) {
        if (class_list == null) {
            console.error(`[ERROR] 参数错误："class_list"不能为 null 或 undefined`);
            return;
        }
        if (!this.is_binded()) {
            console.error(`[ERROR] 设置class属性失败：该${this.constructor.name}实例未绑定过元素`);
            return;
        }

        let safe_class_str = "";
        //输入数组
        if (Array.isArray(class_list)) {
            safe_class_str = class_list
                .filter(class_name => class_name != null && String(class_name).trim() !== "")
                .map(class_name => CSS.escape(String(class_name)))
                .join(" ");
        }
        //输入字符串
        else if (class_list != null && String(class_list).trim() !== "") {
            safe_class_str = CSS.escape(String(class_list))
        }

        this._el.className = safe_class_str;
        console.debug(`[DEBUG] 设置class属性成功：设置class属性为"${safe_class_str}"`);
    }

    /**
     * 为DOM添加类属性
     * @param {Array<string> | string} class_list 类属性数组（多个）或字符串（单个）
     */
    add_class(class_list) {
        if (class_list == null) {
            console.error(`[ERROR] 参数错误："class_list"不能为 null 或 undefined`);
            return;
        }
        if (!this.is_binded()) {
            console.error(`[ERROR] 添加class属性失败：该${this.constructor.name}实例未绑定过元素`);
            return;
        }

        let safe_class_list = [];
        //输入数组
        if (Array.isArray(class_list)) {
            safe_class_list = class_list
                .filter(class_name => class_name != null && String(class_name).trim() !== "")
                .map(class_name => CSS.escape(String(class_name)));
        }
        //输入字符串
        else if (class_list != null && String(class_list).trim() !== "") {
            safe_class_list = [CSS.escape(String(class_list))];
        }

        this._el.classList.add(...safe_class_list);
        console.debug(`[DEBUG] 添加class属性成功：添加的class属性为"${safe_class_list.join(" ")}"`);
    }

    /**
     * 为DOM移除指定类属性
     * @param {Array<string> | string} class_list
     */
    remove_class(class_list) {
        if (class_list == null) {
            console.error(`[ERROR] 参数错误："class_list"不能为 null 或 undefined`);
            return;
        }
        if (!this.is_binded()) {
            console.error(`[ERROR] 移除class属性失败：该${this.constructor.name}实例未绑定过元素`);
            return;
        }

        let safe_class_list = [];
        //输入数组
        if (Array.isArray(class_list)) {
            safe_class_list = class_list
                .filter(class_name => class_name != null && String(class_name).trim() !== "")
                .map(class_name => CSS.escape(String(class_name)));
        }
        //输入字符串
        else if (class_list != null && String(class_list).trim() !== "") {
            safe_class_list = [CSS.escape(String(class_list))];
        }

        this._el.classList.remove(...safe_class_list);
        console.debug(`[DEBUG] 移除class属性成功：删除的class属性为"${safe_class_list}"`);
    }

    /**
     * 清空DOM的类属性
     */
    clear_class() {
        if (!this.is_binded()) {
            console.error(`[ERROR] 清空class属性失败：该${this.constructor.name}实例未绑定过元素`);
            return;
        }
        this._el.className = "";
        console.debug(`[DEBUG] 清空class属性成功：class属性已设置为""`);
    }

    /**
     * 删除DOM的class属性
     */
    del_class() {
        if (!this.is_binded()) {
            console.error(`[ERROR] 删除class属性失败：该${this.constructor.name}实例未绑定过元素`);
            return;
        }
        this._el.removeAttribute("class");
        console.debug(`[DEBUG] 删除class属性成功`);
    }

    /**
     * 查询DOM的class属性
     * @returns string
     */
    get_class() {
        if (!this.is_binded()) {
            console.error(`[ERROR] 查询class属性失败：该${this.constructor.name}实例未绑定过元素`);
            return;
        }

        return this._el.className;
    }

    /**
     * 设置DOM的id属性
     * @param {string} id_name
     */
    set_id(id_name) {
        if (id_name == null) {
            console.error(`[ERROR] 参数错误："id_name"不能为 null 或 undefined`);
            return;
        }
        if (!this.is_binded()) {
            console.error(`[ERROR] 设置id属性失败：该${this.constructor.name}实例未绑定过元素`);
            return;
        }

        const safe_id_name = CSS.escape(String(id_name));
        try {
            this._el.id = safe_id_name;
        }
        catch (e) {
            console.error(`[ERROR] 设置id属性失败：报错：${e}`)
        }
        this._el.id = safe_id_name;
        console.debug(`[DEBUG] 设置id属性成功：设置id属性为"${safe_id_name}"`);
    }

    /**
     * 清空DOM的id属性
     */
    clear_id() {
        if (!this.is_binded()) {
            console.error(`[ERROR] 清空id属性失败：该${this.constructor.name}实例未绑定过元素`);
            return;
        }
        this._el.id = "";
        console.debug(`[DEBUG] 清空id属性成功：id属性已设置为""`);
    }

    /**
     * 删除DOM的id属性
     */
    del_id() {
        if (!this.is_binded()) {
            console.error(`[ERROR] 删除id属性失败：该${this.constructor.name}实例未绑定过元素`);
            return;
        }
        this._el.removeAttribute("id");
        console.debug(`[DEBUG] 删除id属性成功`);
    }

    /**
     * 查询DOM的id属性
     * @returns string
     */
    get_id() {
        if (!this.is_binded()) {
            console.error(`[ERROR] 查询id属性失败：该${ this.constructor.name }实例未绑定过元素`);
            return;
        }

        return this._el.id;
    }

    /**
     * 设置DOM的自定义属性
     * @param {string} data_name 自定义属性名
     * @param {string} data_value 属性值，默认为空字符串
     */
    set_data(data_name, data_value = "") {
        if (data_name == null) {
            console.error(`[ERROR] 参数错误："data_name"不能为 null 或 undefined`);
            return;
        }
        if (data_value == null) {
            console.error(`[ERROR] 参数错误："data_value"不能为 null 或 undefined`);
            return;
        }
        if (!this.is_binded()) {
            console.error(`[ERROR] 设置自定义属性${safe_data_name}失败：该${this.constructor.name}实例未绑定过元素`);
            return;
        }

        const safe_data_name = `data-${String(data_name)}`;
        const safe_data_value = String(data_value);
        try {
            this._el.setAttribute(safe_data_name, safe_data_value);
        }
        catch (e) {
            console.error(`[ERROR] 设置自定义属性失败：报错：${e}`);
            return;
        }
        console.debug(`[DEBUG] 设置自定义属性${safe_data_name}成功：该自定义属性已设置为"${safe_data_value}"`);
    }

    /**
     * 清空DOM的自定义属性
     */
    clear_data(data_name) {
        if (data_name == null) {
            console.error(`[ERROR] 参数错误："data_name"不能为 null 或 undefined`);
            return;
        }
        if (!this.is_binded()) {
            console.error(`[ERROR] 查询自定义属性${safe_data_name}失败：该${this.constructor.name}实例未绑定过元素`);
            return;
        }

        const safe_data_name = `data-${String(data_name)}`;
        this._el.setAttribute(safe_data_name, "");
        console.debug(`[DEBUG] 清空自定义属性${safe_data_name}成功：该自定义属性已设置为""}`);
    }

    /**
     * 删除DOM的自定义属性
     */
    del_data(data_name) {
        if (data_name == null) {
            console.error(`[ERROR] 参数错误："data_name"不能为 null 或 undefined`);
            return;
        }
        if (!this.is_binded()) {
            console.error(`[ERROR] 删除自定义属性${safe_data_name}失败：该${this.constructor.name}实例未绑定过元素`);
            return;
        }

        const safe_data_name = `data-${String(data_name)}`;
        this._el.removeAttribute(safe_data_name);
        console.debug(`[DEBUG] 删除自定义属性${safe_data_name}成功`);
    }

    /**
     * 查询DOM的自定义属性
     * @returns string
     */
    get_data(data_name) {
        if (data_name == null) {
            console.error(`[ERROR] 参数错误："data_name"不能为 null 或 undefined`);
            return;
        }
        if (!this.is_binded()) {
            console.error(`[ERROR] 查询自定义属性${safe_data_name}失败：该${this.constructor.name}实例未绑定过元素`);
            return;
        }

        const safe_data_name = `data-${String(data_name)}`;
        return this._el.getAttribute(safe_data_name);;
    }

    get el() {
        return this._el;
    }

    set el(_) {
        throw new Error("不允许外部修改只读属性el");
    }
}


//单值属性列表
const SIMPLE_ATTR_LIST = [
    { prop: "title", dom_prop: "title" },
    { prop: "alt", dom_prop: "alt" },
    { prop: "placeholder", dom_prop: "placeholder" },
    { prop: "lang", dom_prop: "lang" },
    { prop: "dir", dom_prop: "dir" },
    { prop: "name", dom_prop: "name" },
    { prop: "href", dom_prop: "href" },
    { prop: "src", dom_prop: "src" },
    { prop: "target", dom_prop: "target" },
    { prop: "download", dom_prop: "download" },
    { prop: "referrer_policy", dom_prop: "referrerPolicy" },
    { prop: "max", dom_prop: "max" },
    { prop: "min", dom_prop: "min" },
    { prop: "value", dom_prop: "value" },
    { prop: "size", dom_prop: "size" },
    { prop: "rows", dom_prop: "rows" },
    { prop: "cols", dom_prop: "cols" },
    { prop: "for", dom_prop: "htmlFor" },
    { prop: "rel", dom_prop: "rel" },
];

//动态生成单值属性方法
for (const item of SIMPLE_ATTR_LIST) {
    const { prop, dom_prop} = item;
    Object.defineProperty(NormalDomManager.prototype, `set_${prop}`, {
        value: function(val_name) {
            if (val_name == null) {
                console.error(`[ERROR] 参数错误："${prop}_name"不能为 null 或 undefined`);
                return;
            }
            if (!this.is_binded()) {
                console.error(`[ERROR] 设置${prop}属性失败：该${this.constructor.name}实例未绑定过元素`);
                return;
            }

            const safe_var_name = String(val_name);
            try {
                this._el[dom_prop] = safe_var_name;
            }
            catch (e) {
                console.error(`[ERROR] 设置${prop}属性失败：报错：${e}`)
            }
            console.debug(`[DEBUG] 设置${prop}属性成功：设置${prop}属性为"${safe_var_name}"`);
        }
    })
    Object.defineProperty(NormalDomManager.prototype, `clear_${prop}`, {
        value: function () {
            if (!this.is_binded()) {
                console.error(`[ERROR] 清空${prop}属性失败：该${this.constructor.name}实例未绑定过元素`);
                return;
            }
            this._el[dom_prop] = "";
        }
    })
    Object.defineProperty(NormalDomManager.prototype, `del_${prop}`, {
        value: function () {
            if (!this.is_binded()) {
                console.error(`[ERROR] 删除${prop}属性失败：该${this.constructor.name}实例未绑定过元素`);
                return;
            }
            this._el.removeAttribute(dom_prop);
            console.debug(`[DEBUG] 清空${prop}属性成功：${prop}属性已设置为""`)
        }
    })
    Object.defineProperty(NormalDomManager.prototype, `get_${prop}`, {
        value: function () {
            if (!this.is_binded()) {
                console.error(`[ERROR] 查询${prop}属性失败：该${this.constructor.name}实例未绑定过元素`);
                return;
            }
            console.debug(`[DEBUG] 删除${prop}属性成功`)

            return this._el[dom_prop];
        }
    })
}

//布尔属性列表
const BOOL_ATTR_LIST = [
    { prop: "disabled", dom_prop: "disabled" },
    { prop: "checked", dom_prop: "checked" },
    { prop: "readonly", dom_prop: "readonly" },
    { prop: "required", dom_prop: "required" },
    { prop: "autofocus", dom_prop: "autofocus" },
    { prop: "multiple", dom_prop: "multiple" },
    { prop: "novalidate", dom_prop: "novalidate" },
    { prop: "default_checked", dom_prop: "defaultChecked" },
    { prop: "content_editable", dom_prop: "contentEditable" },
    { prop: "hidden", dom_prop: "hidden" },
];

//动态生成布尔属性方法
for (const item of BOOL_ATTR_LIST) {
    const { prop, dom_prop} = item;
    Object.defineProperty(NormalDomManager.prototype, `set_${prop}`, {
        value: function (val) {
            if (val == null) {
                console.error(`[ERROR] 参数错误："${prop}"不能为 null 或 undefined`);
                return;
            }
            if (!this.is_binded()) {
                console.error(`[ERROR] 设置${prop}属性失败：该${this.constructor.name}实例未绑定过元素`);
                return;
            }

            const safe_val = !!val;
            this._el[dom_prop] = safe_val;
            console.debug(`[DEBUG] 设置${prop}属性成功：设置${prop}属性为${safe_val}`);
        }
    })
    Object.defineProperty(NormalDomManager.prototype, `get_${prop}`, {
        value: function () {
            if (!this.is_binded()) {
                console.error(`[ERROR] 查询${prop}属性失败：该${this.constructor.name}实例未绑定过元素`);
                return;
            }

            return this._el[dom_prop];
        }
    })
}
