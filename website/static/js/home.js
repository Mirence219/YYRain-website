export default class VideoSelector {
  constructor(player_selector) {
    this.player_selector = "#video";
    this.player_el = null;
    console.log("[INFO] 实例创建完成");
  }

  // 初始化：DOM操作，查找iframe元素
  init() {
    // DOM核心API：查找元素
    this.player_el = document.querySelector(this.player_selector);
    if (this.player_el) {
      console.log("[INFO] 播放器DOM查找成功");
    } else {
      console.warn("[WARN] 找不到iframe！选择器写错或者script位置不对");
    }
  }

  // 修改iframe地址，切换视频
  play(url) {
    console.log("[INFO] 请求加载视频：", url);
    if (!this.player_el) {
      console.error("[ERROR] 请先调用init()初始化DOM");
      return;
    }
    // DOM：修改元素属性src
    this.player_el.src = url;
  }

  // 绑定所有按钮点击
  bind_buttons(button_selector) {
    console.log("[INFO] 开始绑定按钮");
    // DOM：获取全部按钮
    const btn_list = document.querySelectorAll(button_selector);
    btn_list.forEach((btn_el) => {
      // DOM：添加点击事件监听
      btn_el.addEventListener("click", () => {
        const link_src = btn_el.dataset.src;
        this.play(link_src);
      });
    });
    console.log(`[INFO] 绑定按钮总数：${btn_list.length}`);
  }
}

