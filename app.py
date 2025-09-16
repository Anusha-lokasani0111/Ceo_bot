from flask import Flask, request, jsonify, render_template
import random
from datetime import datetime
import webbrowser
import threading
import time

app = Flask(__name__)

# Quick in-memory "storage"
msgs = []               # each message: {id, text, timestamp, replies: []}
ongoing_calls = []      # active video calls
future_meetings = []    # upcoming meetings (not persisted, just tmp)

# maybe use DB later... for now it's fine

def make_video_link():
    # just slapping a random room name together for now
    rnd_num = random.randint(1000, 9999)
    return f"https://meet.jit.si/CEO-{rnd_num}"

@app.route("/")
def home_page():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def handle_chat():
    user_msg = request.json.get("message", "").strip()
    if not user_msg:
        return jsonify({"reply": "Please type something first."})

    # storing msg with a simple ID (kinda fragile but meh)
    msg_obj = {
        "id": len(msgs),
        "text": user_msg,
        "timestamp": datetime.now().strftime("%H:%M"),  # 24hr clock for now
        "replies": []
    }
    msgs.append(msg_obj)

    # crude "urgent" detection
    urgent_flag = ("urgent" in user_msg.lower() or "salary" in user_msg.lower())

    if urgent_flag:
        room_link = make_video_link()
        bot_reply = f"CEO will respond soon. Hop on a call: {room_link}"
    else:
        bot_reply = "Okay, noted. Your msg was saved."

    return jsonify({"reply": bot_reply})


@app.route("/start-video-call", methods=["POST"])
def start_call():
    url = make_video_link()
    # not storing anything here (maybe we should?)
    return jsonify({
        "url": url,
        "message": f"Video call started → {url}"
    })


@app.route("/schedule-meeting", methods=["POST"])
def schedule_meeting():
    data = request.json or {}
    date_val = data.get("date")
    time_val = data.get("time")

    mtg = {
        "date": date_val,
        "time": time_val,
        "timestamp": datetime.now().strftime("%H:%M")
    }
    future_meetings.append(mtg)

    return jsonify({"message": f"Meeting set for {date_val} at {time_val}"})


@app.route("/emergency-call", methods=["POST"])
def emergency_call():
    url = make_video_link()
    call_entry = {
        "url": url,
        "timestamp": datetime.now().strftime("%H:%M")
    }
    ongoing_calls.append(call_entry)

    return jsonify({
        "url": url,
        "message": "!! Emergency call started, join ASAP."
    })


@app.route("/send-reply", methods=["POST"])
def reply_to_msg():
    data = request.json
    msg_idx = data.get("message_id")
    reply_txt = data.get("reply")

    if msg_idx is not None and 0 <= msg_idx < len(msgs):
        msgs[msg_idx]["replies"].append({
            "text": reply_txt,
            "timestamp": datetime.now().strftime("%H:%M")
        })
        return jsonify({"status": "ok"})
    else:
        # bad request
        return jsonify({"status": "fail"}), 400


@app.route("/get-replies")
def fetch_replies():
    collected = {}
    for i, m in enumerate(msgs):
        if m["replies"]:
            collected[i] = m["replies"]  # mapping by index
    return jsonify({"replies": collected})


@app.route("/get-dashboard-data")
def get_dashboard():
    # later we can optimize this
    return jsonify({
        "messages": msgs,
        "active_calls": ongoing_calls,
        "scheduled_calls": future_meetings
    })


@app.route("/ceo-dashboard")
def ceo_page():
    return render_template("ceo_dashboard.html")


# --- Browser helper stuff ---
def auto_open_browser():
    # delay so flask can start first
    time.sleep(2)
    try:
        webbrowser.open("http://localhost:5000")
        print("Browser popped up")
        print("Employee portal → http://localhost:5000")
        print("CEO dashboard → http://localhost:5000/ceo-dashboard")
    except Exception as e:
        print("Couldn't open browser:", e)
        print("Just go manually to http://localhost:5000")


if __name__ == "__main__":
    print("Starting CEO Connect... (might take a sec)")
    # maybe add logging later

    t = threading.Thread(target=auto_open_browser)
    t.daemon = True
    t.start()

    app.run(debug=True, port=5000)
