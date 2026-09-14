from flask import Blueprint, render_template, request, jsonify

from src.__version__ import __version__

home_bp = Blueprint("home", __name__)

@home_bp.route("/")
def home():
    return render_template("home.html")


