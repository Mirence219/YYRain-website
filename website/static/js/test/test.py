# server.py
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

# ========= 在这里修改你的网页根目录 =========
WEB_ROOT = r"D:\夜雨市官网\website\static\js"
PORT = 9000
# ==========================================

# 切换工作目录到指定文件夹
os.chdir(WEB_ROOT)

server = HTTPServer(("127.0.0.1", PORT), SimpleHTTPRequestHandler)
print(f"网页目录：{os.getcwd()}")
print(f"访问地址：http://127.0.0.1:{PORT}")
print("Ctrl + C 关闭服务")

try:
    server.serve_forever()
except KeyboardInterrupt:
    server.server_close()
    print("服务已停止")
