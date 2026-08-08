import SwitchDomManager, { TriggerMode } from "/module/dom_manager/switch_dom_manager.js"

function fun1() {
    console.log("[TEST]函数1已执行");
}

function fun2() {
    console.log("[TEST]函数2已执行");
}

function fun3() {
    console.log("[TEST]函数3已执行");
}

function fun4() {
    console.log("[TEST]函数4已执行");
}

function fun5() {
    console.log("[TEST]函数5已执行");
    button.set_enable(false);
}

function fun6() {
    console.log("[TEST]函数6已执行");
    button.set_enable(true);
}

console.log("[TEST]测试开始");
const button = new SwitchDomManager(3, [fun1, fun2, fun3, fun4], TriggerMode.TOUCH_START);
const button2 = new SwitchDomManager(2, [fun5, fun6])
button.dom_bind_id("test");
button2.dom_bind_id("test2");
button.init();
button2.init();
console.log(button.get_state());
button.set_state(-1);
console.log(button.get_state());
