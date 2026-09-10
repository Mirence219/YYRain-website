from flask import render_template

def error_404(e):
    return render_template("error/404.html")

def error_500(e):
    return render_template("error/500.html")

error_handler = {"404": error_404,
                 "500": error_500}