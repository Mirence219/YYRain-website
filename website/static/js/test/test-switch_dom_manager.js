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
    button.set_hidden(true);
}

function fun6() {
    console.log("[TEST]函数6已执行");
    button.set_hidden(false);
}

console.log("[TEST]测试开始");
const button = new SwitchDomManager(3, [fun1, fun2, fun3, fun4]);
const button2 = new SwitchDomManager(2, [fun5, fun6])
button.dom_bind_data("data-name","test");
button2.dom_bind_id("test2");
button.init();
button2.init();
console.log("class:", button.get_class());
console.log("id:", button.get_id());
console.log("hidden:", button.get_hidden());
button.set_class("test100");
console.log("class:", button.get_class());
button.add_class(["test101", "test102", "test103"]);
console.log("class:", button.get_class());
button.remove_class("test100");
console.log("class:", button.get_class());
button.clear_class();
console.log("class:", button.get_class());
button.del_class();
console.log("class:", button.get_class());
button.set_data("a", "giaogiaogiao");
console.log("a:", button.get_data("a"));
button.clear_data("a");
console.log("a:", button.get_data("a"));
button.set_title("test");
console.log("title:", button.get_title());
button.clear_title();
button.del_title();
button.set_href("https://bilibili.com");
console.log(button.get_href());
