# dom_manager API.md

> 
> 模块：`normal_dom_manager.js` / `switch_dom_manager.js`
> 
> 版本：v0.1
> 
> 说明：ES Module，使用 `import` 导入；全部接口失败仅输出 `console.error`，默认不抛出异常；**一个实例只能绑定一个DOM元素，禁止重复绑定**。

## 目录

- [NormalDomManager 通用 DOM 管理器](#normaldommanager-%E9%80%9A%E7%94%A8dom%E7%AE%A1%E7%90%86%E5%99%A8)
  - [实例创建](#%E5%AE%9E%E4%BE%8B%E5%88%9B%E5%BB%BA)
  - [DOM 绑定方法](#dom%E7%BB%91%E5%AE%9A%E6%96%B9%E6%B3%95)
  - [生命周期与状态查询](#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E4%B8%8E%E7%8A%B6%E6%80%81%E6%9F%A5%E8%AF%A2)
  - [class 类名操作](#class-%E7%B1%BB%E5%90%8D%E6%93%8D%E4%BD%9C)
  - [id 属性操作](#id-%E5%B1%9E%E6%80%A7%E6%93%8D%E4%BD%9C)
  - [data‑* 自定义属性操作](#data-%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B1%9E%E6%80%A7%E6%93%8D%E4%BD%9C)
  - [动态生成：单值属性](#%E5%8A%A8%E6%80%81%E7%94%9F%E6%88%90%E5%8D%95%E5%80%BC%E5%B1%9E%E6%80%A7)
  - [动态生成：布尔属性](#%E5%8A%A8%E6%80%81%E7%94%9F%E6%88%90%E5%B8%83%E5%B0%94%E5%B1%9E%E6%80%A7)
- [SwitchDomManager 开关状态管理器](#switchdommanager-%E5%BC%80%E5%85%B3%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86%E5%99%A8%E7%BB%A7%E6%89%BF-normaldommanager)
  - [构造函数](#%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0)
  - [生命周期](#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)
  - [状态控制 API](#%E7%8A%B6%E6%80%81%E6%8E%A7%E5%88%B6api)
  - [TriggerMode 触发枚举](#triggermode-%E8%A7%A6%E5%8F%91%E6%9E%9A%E4%B8%BE)
- [完整使用示例](#%E5%AE%8C%E6%95%B4%E4%BD%BF%E7%94%A8%E7%A4%BA%E4%BE%8B)
- [重要注意事项](#%E9%87%8D%E8%A6%81%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

---

## NormalDomManager 通用DOM管理器

```
import NormalDomManager from "./normal_dom_manager.js";
```

### 实例创建

```
const dom = new NormalDomManager();
```

新建实例后内部状态：`_el = null`，未绑定DOM，`inited = false`。

### DOM绑定方法

> 
> ⚠️ 规则：实例一旦绑定过DOM，再次调用任意绑定函数直接输出错误日志，不会覆盖旧绑定。
> 绑定失败不会抛出异常，仅打印 error。

#### dom_bind_class(class_name)

通过 class 类名绑定第一个匹配元素

- 参数 `class_name: string`，**不要带`.`**；内部自动 `CSS.escape` 转义

```
dom.dom_bind_class("menu-item");
```

#### dom_bind_id(id_name)

通过 id 绑定元素

- 参数 `id_name: string`，**不要带`#`**

```
dom.dom_bind_id("theme_button");
```

#### dom_bind_tag(tag_name)

通过标签名绑定第一个匹配元素

```
dom.dom_bind_tag("nav");
```

#### dom_bind_data(data_name, data_value = null, relation = "=", modifier = null)

通过HTML属性选择器绑定元素

- `data_name`：完整属性名，需要写 `data‑xxx`
- `data_value`：属性值；传 `null` 代表只匹配属性存在，不校验值
- `relation`：关系运算符，支持 `=` `^=` `$=` `*=` `~=` `|=`
- `modifier`：修饰符，仅支持 `i` / `s`，可为 `null`

```
// 匹配 <div data-role="button">
dom.dom_bind_data("data-role", "button", "=");
```

#### dom_bind_css(css_selector)

直接传入完整CSS选择器字符串绑定

```
dom.dom_bind_css("nav > div#theme_button");
```

#### dom_bind_closed_parent(dom_el)

绑定传入DOM的直接父元素

- `dom_el`：可以是原生 `HTMLElement`，也可以是 `NormalDomManager` 实例

```
dom.dom_bind_closed_parent(otherDom.get_el());
```

#### dom_bind_closed_child(dom_el)

绑定传入DOM的**第一个直接元素子节点**（`firstElementChild`，跳过文本节点）

```
dom.dom_bind_closed_child(otherDom);
```

### 生命周期与状态查询

#### init()

初始化实例；**必须先绑定DOM，再调用init**

- 返回 `0`：成功；返回 `-1`：失败

```
dom.dom_bind_id("xxx");
dom.init();
```

#### is_binded()

返回 `boolean`，判断实例是否已经绑定DOM元素

```
if (dom.is_binded()) {}
```

#### is_inited()

返回 `boolean`，判断实例是否执行过 `init()`

#### get_el()

返回绑定的原生 `HTMLElement | null`

> 
> 只读访问器，禁止写 `dom.el = xxx`，会直接抛出错误。

```
const el = dom.get_el();
```

### class 类名操作

| 方法 | 说明 | 参数 |
| --- | --- | --- |
| `set_class(class_list)` | **覆盖设置全部class** | `string | string[]` |
| `add_class(class_list)` | 追加class（内部使用 `classList.add`） | `string | string[]` |
| `remove_class(class_list)` | 移除指定class | `string | string[]` |
| `clear_class()` | 清空className，class属性节点仍然保留 | 无 |
| `del_class()` | 彻底删除元素的class属性 | 无 |
| `get_class()` | 获取当前className字符串 | 无 |

```
dom.set_class(["btn", "btn-hover"]);
dom.add_class("shake-loop");
dom.remove_class("shake-loop");
console.log(dom.get_class());
dom.clear_class();
dom.del_class();
```

### id 属性操作

```
dom.set_id("box-1");
dom.get_id();
dom.clear_id();
dom.del_id();
```

### data‑* 自定义属性操作

> 
> 传参时**不要写 `data‑`**，函数内部自动拼接前缀。

```
dom.set_data("role", "button");   // 设置 data-role="button"
dom.get_data("role");
dom.clear_data("role");
dom.del_data("role");
```

### 动态生成：单值属性

> 
> 内置属性列表：
> `title`、`alt`、`placeholder`、`lang`、`dir`、`name`、`href`、`src`、`target`、`download`、`referrer_policy`、`max`、`min`、`value`、`size`、`rows`、`cols`、`for`、`rel`

每个属性自动生成4个方法：

- `set_xxx(value)`：赋值，自动转字符串
- `get_xxx()`：读取属性
- `clear_xxx()`：置为空字符串
- `del_xxx()`：`removeAttribute` 删除属性

```
dom.set_title("切换主题");
console.log(dom.get_title());
dom.clear_title();
dom.del_title();

dom.set_src("/static/image/icon.svg");
```

### 动态生成：布尔属性

> 
> 内置属性列表：
> `disabled`、`checked`、`readonly`、`required`、`autofocus`、`multiple`、`novalidate`、`default_checked`、`content_editable`、`hidden`

每个属性自动生成2个方法：

- `set_xxx(val)`：传入任意值，内部强制转为布尔 `!!val`
- `get_xxx()`：返回布尔值

```
dom.set_hidden(true);
dom.set_disabled(false);
console.log(dom.get_hidden());
```

---

## SwitchDomManager 开关状态管理器

> 
> 多档位循环开关组件，适合主题切换、多状态按钮。

```
import SwitchDomManager, { TriggerMode } from "./switch_dom_manager.js";
```

### 构造函数

```
new SwitchDomManager(state_count, handlers, trigger_mode)
```

- `state_count: number`：状态总档位，**最小为2**，例如3代表索引 `0,1,2`
- `handlers: Array<Function>`：回调函数数组，数组长度建议与 `state_count` 一致；触发事件时执行当前索引对应的回调
- `trigger_mode: TriggerMode`：触发事件类型，默认 `TriggerMode.CLICK`

示例：

```
const handler_list = [
    () => set_theme("dark"),
    () => set_theme("pink"),
    () => set_theme("white")
];
const btn = new SwitchDomManager(3, handler_list, TriggerMode.CLICK);
```

### 生命周期

> 
> 执行顺序：**绑定DOM → init()**

```
btn.dom_bind_id("theme_button");
btn.init();
```

> 
> `init()` 内部调用私有方法绑定DOM事件；未绑定DOM调用init会报错返回。

### 状态控制API

#### set_state(state_num)

设置当前状态索引，支持负索引

```
btn.set_state(0);
btn.set_state(-1); // 倒数第一档
```

#### get_state()

获取当前状态数字索引

```
const idx = btn.get_state();
```

#### set_enable(value: boolean)

启用/禁用开关逻辑；禁用后触发事件不会执行回调，但DOM事件监听仍然存在。

```
btn.set_enable(false);
btn.set_enable(true);
```

#### is_enable()

返回布尔，查询开关是否可用。

### TriggerMode 触发枚举

```
TriggerMode.CLICK         // 左键单击
TriggerMode.MOUSE_DOWN    // 鼠标按下
TriggerMode.MOUSE_UP      // 鼠标抬起
TriggerMode.DBL_CLICK     // 双击
TriggerMode.CONTEXT_MENU  // 右键菜单
TriggerMode.MOUSE_ENTER   // 鼠标移入（不冒泡）
TriggerMode.MOUSE_LEAVE   // 鼠标移出（不冒泡）
TriggerMode.MOUSE_OVER    // 鼠标移入（冒泡）
TriggerMode.MOUSE_OUT     // 鼠标移出（冒泡）
TriggerMode.MOUSE_MOVE    // 鼠标移动

TriggerMode.KEY_DOWN      // 按键按下
TriggerMode.KEY_UP        // 按键松开

TriggerMode.TOUCH_START   // 手指按下
TriggerMode.TOUCH_END     // 手指抬起
TriggerMode.TOUCH_MOVE    // 手指滑动

TriggerMode.FOCUS         // 获取焦点
TriggerMode.BLUR          // 失去焦点
TriggerMode.SCROLL        // 区域滚动
```

---

## 完整使用示例

```
import NormalDomManager from "./normal_dom_manager.js";
import SwitchDomManager, { TriggerMode } from "./switch_dom_manager.js";

// 普通DOM管理器示例
const titleDom = new NormalDomManager();
titleDom.dom_bind_id("top_title");
titleDom.init();
titleDom.set_title("夜雨市官网");
titleDom.add_class("title-big");

// 三状态主题切换按钮
function set_theme(name) {
    document.documentElement.dataset.theme = name;
    localStorage.setItem("theme", name);
}
const theme_handlers = [
    () => set_theme("dark"),
    () => set_theme("pink"),
    () => set_theme("white")
];
const themeBtn = new SwitchDomManager(3, theme_handlers, TriggerMode.CLICK);
themeBtn.dom_bind_id("theme_button");
themeBtn.init();

// 手动设置初始档位
themeBtn.set_state(0);
console.log("当前档位：", themeBtn.get_state());
```

---

## 重要注意事项

1. **执行顺序强制：绑定DOM → init()**，未绑定DOM调用 init 直接返回错误。
2. `NormalDomManager` 一个实例只能绑定一个DOM，重复绑定输出错误日志，不会覆盖。
3. `SwitchDomManager` 的 `handlers` 数组长度建议与 `state_count` 一致；内部使用可选链 `?.()`，不存在索引不会报错。
4. `set_enable(false)` 仅阻止业务回调执行，**不会移除DOM事件监听**。
5. 单值属性入参内部自动转 `String`；布尔属性入参强制 `!!val` 转为布尔。
6. 所有公开API失败仅输出 `console.error`，默认不抛出异常，便于UI容错。
7. `dom_bind_closed_child` 使用 `firstElementChild`，只取元素节点，忽略文本、空白节点。
8. 当前版本 `SwitchDomManager` 事件回调为内部匿名箭头函数，**没有提供销毁解绑接口**；页面卸载场景需要自行补充事件移除逻辑。