class VideoSelector {
  constructor(playerSelector) {
    this.playerSelector = "#video";
    this.playerEl = null;
    console.log("[INFO] 实例创建完成");
  }

  // 初始化：DOM操作，查找iframe元素
  init() {
    // DOM核心API：查找元素
    this.playerEl = document.querySelector(this.playerSelector);
    if(this.playerEl){
        console.log("[INFO] 播放器DOM查找成功");
    }else{
        console.warn("[WARN] 找不到iframe！选择器写错或者script位置不对");
    }
  }

  // 修改iframe地址，切换视频
  play(url) {
    console.log("[INFO] 请求加载视频：", url);
    if(!this.playerEl){
        console.error("[ERROR] 请先调用init()初始化DOM");
        return;
    }
    // DOM：修改元素属性src
    this.playerEl.src = url;
  }

  // 绑定所有按钮点击
  bindButtons(buttonSelector){
    console.log("[INFO] 开始绑定按钮");
    // DOM：获取全部按钮
    const btnList = document.querySelectorAll(buttonSelector);
    btnList.forEach(btn=>{
        // DOM：添加点击事件监听
        btn.addEventListener("click", ()=>{
            const link = btn.dataset.src;
            this.play(link);
        })
    })
    console.log(`[INFO] 绑定按钮总数：${btnList.length}`);
  }
}

// =========使用流程========
const videoBox = new VideoSelector("#videoPlayer");
videoBox.init();                // DOM查找元素
videoBox.bindButtons(".video_button"); // 绑定点击