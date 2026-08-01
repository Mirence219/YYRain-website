from web_app import WebApp
import os

DEBUG_MODE = os.getenv("debug", "false") == "true"

if __name__ == "__main__":
# python
    if DEBUG_MODE:
        print("【当前处于调试状态】")
        host = "0.0.0.0"
    else:
        print("【当前处于实际运行】")
        host = "127.0.0.1"
    web_app = WebApp()
    web_app.run(host=host, port=8080)