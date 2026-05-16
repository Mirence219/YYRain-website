from doctest import debug
from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("home.html")

@app.route('/event')
def event():
    return render_template("event.html")

@app.route('/competition')
def competition():
    return render_template("competition.html")

@app.route('/wiki')
def wiki():
    return render_template("wiki.html")

DEBUG_MODE = os.getenv("Debug", "false") == "true"





if __name__ == "__main__":
    if DEBUG_MODE:
        print("【当前处于调试状态】")
        host = "0.0.0.0"
    else:
        print("【当前处于实际运行】")
        host = "127.0.0.1"
    app.run(host=host, port=8080)