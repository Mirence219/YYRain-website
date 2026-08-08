// 视频选择器类
export default class VideoSelector {
  constructor(player_selector) {
    this.player_selector = "#video"; //视频iframe选择器
    this.player_el = null;
    console.info("[INFO] 实例创建完成");
  }

  // 初始化
  init() {
    this.player_el = document.querySelector(this.player_selector);
    if (this.player_el) {
      console.info("[INFO] 播放器DOM查找成功");
    } else {
      console.warn("[WARN] 找不到iframe！");
    }
  }

  // 修改iframe地址
  play(url) {
    console.info("[INFO] 请求加载视频：", url);
    if (!this.player_el) {
      console.error("[ERROR] DOM未初始化");
      return;
    }
    this.player_el.src = url;
  }

  // 绑定选择器按钮
  bind_buttons(button_selector) {
    console.info("[INFO] 开始绑定按钮");
    const btn_list = document.querySelectorAll(button_selector);
    btn_list.forEach((btn_el) => {
      btn_el.addEventListener("click", () => {
        const link_src = btn_el.dataset.src;
        this.play(link_src);
      });
    });
    console.info(`[INFO] 绑定按钮总数：${btn_list.length}`);
  }
}

