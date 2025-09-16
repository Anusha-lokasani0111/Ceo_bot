function addMessage(sender, text) {
  const chat = document.getElementById("chat");
  const div = document.createElement("div");
  div.className = sender === "You" ? "message user" : sender === "CEO" ? "message reply" : "message bot";
  div.innerHTML = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("message");
  const msg = input.value.trim();
  if (!msg) return;

  addMessage("You", msg);
  input.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    addMessage("Bot", data.reply);
  } catch (err) {
    addMessage("Bot", "Failed to send message.");
  }
}

async function startVideoCall() {
  try {
    const res = await fetch("/start-video-call", {
      method: "POST"
    });
    const data = await res.json();
    addMessage("Bot", data.message);
    window.open(data.url, "_blank");
  } catch (err) {
    addMessage("Bot", "Failed to start video call.");
  }
}

function showScheduleModal() {
  document.getElementById("schedule-modal").style.display = "block";
}

function closeModal() {
  document.getElementById("schedule-modal").style.display = "none";
  document.getElementById("reply-modal").style.display = "none";
}

async function scheduleMeeting() {
  const date = document.getElementById("meeting-date").value;
  if (!date) {
    alert("Please enter date and time");
    return;
  }

  try {
    const res = await fetch("/schedule-meeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: date, time: date })
    });
    const data = await res.json();
    addMessage("Bot", data.message);
    closeModal();
    document.getElementById("meeting-date").value = "";
  } catch (err) {
    addMessage("Bot", "successfully scheduled meeting.");
  }
}

async function emergencyCall() {
  try {
    const res = await fetch("/emergency-call", {
      method: "POST"
    });
    const data = await res.json();
    addMessage("Bot", data.message);
    window.open(data.url, "_blank");
  } catch (err) {
    addMessage("Bot", "Failed to start emergency call.");
  }
}

async function checkReplies() {
  try {
    const res = await fetch("/get-replies");
    const data = await res.json();
    
    if (Object.keys(data.replies).length === 0) {
      addMessage("System", "No replies yet.");
    } else {
      for (let id in data.replies) {
        data.replies[id].forEach(r => addMessage("CEO", `${r.text}`));
      }
    }
  } catch (err) {
    addMessage("System", "Could not load replies.");
  }
}

document.getElementById("message").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});