from flask import Blueprint, render_template

competition_bp = Blueprint("competition", __name__)

@competition_bp.route("/competition")
def competition():
    return render_template("competition.html")
