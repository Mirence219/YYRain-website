import socket
from datetime import datetime
import os

host = "0.0.0.0"
port = 80
PUBLIC_IP = "81.70.42.92"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(BASE_DIR, "template/home.html")

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind((host, port))
s.listen(5)

print("服务启动成功 端口80")
print("本机访问：127.0.0.1")
print("公网访问：81.70.43.92")
print("待备案域名：YYRain.cn")
print("-"*50)

# 读取你写的 HTML 文件
with open(html_path, "r", encoding="utf-8") as f:
    html_content = f.read()

# 组装 HTTP 响应（必须保留！浏览器才能识别）
html = f"""HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\n\r\n{html_content}"""

def check_visit_type(host_header, client_ip):
    if not host_header:
        return "未知访问方式"
    
    if "127.0.0.1" in host_header or "localhost" in host_header:
        return "👉 本地本机访问"
    elif PUBLIC_IP in host_header:
        return "👉 公网IP直接访问"
    elif "192.168." in host_header or "10." in host_header or "172." in host_header:
        return "👉 内网局域网访问"
    else:
        return f"👉 域名访问：{host_header}"

while True:
    try:
        conn, addr = s.accept()
        client_ip, client_port = addr
        data = conn.recv(2048).decode("utf-8", errors="ignore")

        # 提取 Host 请求头
        host_val = ""
        for line in data.splitlines():
            if line.lower().startswith("host:"):
                host_val = line.split(":", 1)[1].strip()
                break

        # 判断访问类型
        visit_type = check_visit_type(host_val, client_ip)

        # 打印详细日志
        print(datetime.now())
        print(f"访客IP：{client_ip}")
        print(f"访问地址：{host_val}")
        print(f"访问方式：{visit_type}")

        # 返回网页
        conn.sendall(html.encode("utf-8"))
        
    except Exception as e:
        print(f"报错：{e}")
        
    finally:
        print("-"*50)
        conn.close()

