from flask import Blueprint, render_template

event_bp = Blueprint("event", __name__)

@event_bp.route("/event")
def event():
    return render_template("event.html")
