let currentMsgId = null;
async function loadDashboardData() {
  try {
    const res = await fetch("/get-dashboard-data");
    const data = await res.json();

    // Active Calls
    const calls = document.getElementById("calls-container");
    if (data.active_calls.length > 0) {
      calls.innerHTML = data.active_calls.map(c => `
        <div style="padding: 15px; background: #e74c3c; color: white; border-radius: 8px; margin: 10px 0;">
          <strong>EMERGENCY CALL</strong><br>
          <small>${c.timestamp}</small><br>
          <a href="${c.url}" target="_blank" style="color: white; text-decoration: underline;"> Join Call</a>
        </div>
      `).join('');
    } else {
      calls.innerHTML = "<p class='no-data'>No active calls</p>";
    }

    // Scheduled Meetings
    const sched = document.getElementById("scheduled-container");
    if (data.scheduled_calls.length > 0) {
      sched.innerHTML = data.scheduled_calls.map(s => `
        <div style="padding: 15px; background: #27ae60; color: white; border-radius: 8px; margin: 10px 0;">
          <strong>Scheduled: ${s.date} at ${s.time}</strong><br>
          <small>${s.timestamp}</small>
        </div>
      `).join('');
    } else {
      sched.innerHTML = "<p class='no-data'>No scheduled meetings</p>";
    }

    // Messages
    const msgs = document.getElementById("messages-container");
    if (data.messages.length > 0) {
      msgs.innerHTML = data.messages.map(m => `
        <div class="message-item">
          <p><strong>Message:</strong> ${m.text}</p>
          <p><small>Time: ${m.timestamp}</small></p>
          ${m.replies.map(r => `<div style="margin: 5px 0; padding: 8px; background: #d5f4e6; border-radius: 5px;"><strong>You:</strong> ${r.text}</div>`).join('')}
          <button onclick="openReplyModal(${m.id})" style="background: #27ae60; color: white; border: none; padding: 8px 12px; border-radius: 5px; margin-top: 5px;">📤 Reply</button>
        </div>
      `).join('');
    } else {
      msgs.innerHTML = "<p class='no-data'>No messages yet</p>";
    }
  } catch (err) {
    console.error("Load error:", err);
  }
}

function openReplyModal(id) {
  currentMsgId = id;
  document.getElementById("reply-modal").style.display = "block";
}

async function sendReply() {
  const reply = document.getElementById("reply-text").value.trim();
  if (!reply) {
    alert("Please enter a reply");
    return;
  }

  try {
    const res = await fetch("/send-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message_id: currentMsgId, reply: reply })
    });

    const data = await res.json();
    if (data.status === "success") {
      loadDashboardData();
      closeModal();
      document.getElementById("reply-text").value = "";
    }
  } catch (err) {
    alert("Failed to send reply");
  }
}

document.addEventListener("DOMContentLoaded", loadDashboardData);
setInterval(loadDashboardData, 3000);