 # local host

 Tab 1: http://localhost:5000  
Tab 2: http://localhost:5000/ceo-dashboard 


# CEO-Employee Direct Connect  
### A Secure, Real-Time Communication System

A private chatbot platform that enables employees to communicate directly with the CEO, without any third party involvement.

## Overview

**CEO-Employee Direct Connect** is a secure internal communication system that allows employees to:
- Send confidential messages directly to the CEO
- Request emergency video calls
- Schedule meetings
- Receive replies, all in real time

This system breaks down communication barriers, encourages honest feedback, and ensures urgent issues reach leadership immediately, without filters, delays, or fear of retaliation.

It is built on simplicity, privacy, and trust. 

## Key Features

**Direct Messaging**  
Employees can send private messages that only the CEO sees. 

**Emergency Contact Button**  
One-click emergency call triggers an instant video meeting if the CEO is available.

**On-Demand Video Calls**  
Urgent conversations start instantly via Jitsi Meet, which is free and encrypted.

**Schedule Meetings**  
Employees can request future meetings with a specific date and time. 

**Two-Way Replies**  
CEO replies appear directly in the employee’s chat interface.

**Real-Time Dashboard**  
The CEO dashboard refreshes automatically to show new messages, scheduled meetings, and active calls.

**No Third-Party Access**  
Messages go directly from employee to CEO, with no HR, IT, or manager in between.

## Technology Stack

**Backend** ----> Python + Flask 
**Frontend** ---->HTML5, CSS3, JavaScript (ES6)
**Video Conferencing** ----> [Jitsi Meet](https://meet.jit.si) (open-source, free, encrypted) |
**Data Storage** ---->In-memory (Python lists)
**Architecture**  ---->RESTful API with JSON communication |
**Auto-Launch**  ----> Opens browser automatically on startup |

## Project Structure

ceo-bot/
│
├── app.py                    ← Backend server (Flask)
│
├── templates/                ← HTML files
│   ├── index.html            ← Employee interface
│   └── ceo_dashboard.html    ← CEO dashboard
│
└── static/                   ← Static assets
    ├── employee.css          ← Employee styling
    ├── ceo.css               ← CEO dashboard styling
    ├── employee.js           ← Employee logic
    └── ceo.js                ← CEO dashboard logic

## How to Run

### 1. Prerequisites
- Python 3.7 or higher
- Internet connection (for Jitsi video calls)

### 2. Install Dependencies
pip install flask


### 3. Run the App
python app.py


The browser will automatically open to:

**Employee Portal**: `http://localhost:5000`

## Sample Flow

1. **Employee** sends:  
   `"My salary hasn’t been credited for two months."` (because salary is marked as urgency)

2. **Bot** detects urgency and offers:  
   `"✅ CEO is available! Join the video call now: https://meet.jit.si/CEO-1234"`

3. **CEO** opens the dashboard and sees the message plus the live call option.

4. **CEO replies** directly, and the reply appears when the employee clicks *"Check Replies."*

5. **All communication stays private**, with no logs and no third parties involved.

## Security & Privacy

- Messages are stored in memory and cleared upon restart, making it ideal for sensitive use.
- No authentication is required, reducing tracking concerns.
- The system can be deployed on an internal network for maximum security.


## Future Enhancements

- Add an **SQLite database** for persistent message storage
- Integrate **email/SMS alerts** for CEO notifications
- Support **anonymous messaging***
- Mobile-responsive design
- Admin panel for usage analytics

