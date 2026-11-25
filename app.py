"""Sameer Bhatti portfolio - Flask backend.

Serves the single-page site and handles the contact form.
Messages are validated, rate-limited per IP, and appended to messages.jsonl.
"""
import json
import os
import re
import time
from datetime import datetime, timezone

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
MESSAGES_FILE = os.path.join(BASE_DIR, "messages.jsonl")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

# very small in-memory rate limiter: max 5 messages per IP per hour
_hits = {}
MAX_PER_HOUR = 5


def rate_limited(ip: str) -> bool:
    now = time.time()
    window = [t for t in _hits.get(ip, []) if now - t < 3600]
    if len(window) >= MAX_PER_HOUR:
        _hits[ip] = window
        return True
    window.append(now)
    _hits[ip] = window
    return False


@app.route("/")
def index():
    return render_template("index.html")


@app.post("/api/contact")
def contact():
    data = request.get_json(silent=True) or request.form
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    service = (data.get("service") or "").strip()
    message = (data.get("message") or "").strip()
    honeypot = (data.get("website") or "").strip()  # bots fill this hidden field

    if honeypot:  # silently accept to fool bots
        return jsonify(ok=True, message="Thank you!")

    errors = {}
    if len(name) < 2 or len(name) > 80:
        errors["name"] = "Please enter your name."
    if not EMAIL_RE.match(email) or len(email) > 120:
        errors["email"] = "Please enter a valid email address."
    if len(message) < 10 or len(message) > 3000:
        errors["message"] = "Message should be 10-3000 characters."
    if errors:
        return jsonify(ok=False, errors=errors), 400

    if rate_limited(request.remote_addr or "unknown"):
        return jsonify(ok=False, message="Too many messages. Please try later."), 429

    record = {
        "time": datetime.now(timezone.utc).isoformat(),
        "name": name,
        "email": email,
        "service": service[:80],
        "message": message,
    }
    with open(MESSAGES_FILE, "a", encoding="utf-8") as fh:
        fh.write(json.dumps(record, ensure_ascii=False) + "\n")

    return jsonify(ok=True, message="Thanks! I'll reply within 24 hours.")


@app.get("/robots.txt")
def robots():
    return "User-agent: *\nAllow: /\n", 200, {"Content-Type": "text/plain"}


if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG") == "1", host="0.0.0.0", port=5000)
