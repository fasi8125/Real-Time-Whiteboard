Real-Time Collaborative Whiteboard (FastAPI + WebSockets)

This project is a real-time collaborative whiteboard web application, where multiple users can draw together on a shared canvas over the internet.
It supports real-time drawing synchronization, sessions, authentication, save/load canvas, undo/redo, brush tools, eraser & download features.

This application was developed as part of my 1-month Python Web Development Internship at Gwing Software Technologies (Oct 27 – Nov 26, 2025), where the objective was to build a production-ready real-time collaborative system using FastAPI and WebSockets.

* Features
Category	                     Features
 Drawing Tools	          Brush, color picker, adjustable size, eraser
 Controls	              Undo, Redo, Clear board, Download canvas
 Real-Time Sync	          Live drawing sync across all connected users
 Authentication	User       registration & login using JWT
 Session	               Create / Join room using unique session IDs
 Storage	              Save / Load canvas from MongoDB
 Technology	              WebSockets used for real-time events

Tech Stack
Component	     Technology
Backend	FastAPI (Python), WebSockets
Database	MongoDB
Frontend	HTML5, CSS, JavaScript
Real-Time Communication	FastAPI WebSocket
Authentication	JWT Token
Server	Uvicorn

📁 Project Structure
 whiteboard-app/
 ├── main.py
 ├── auth_router.py
 ├── routers/
 │   ├── sessions.py
 │   └── canvas.py
 ├── utils/
 │   └── webrtc_signaling.py
 ├── static/
 │   ├── script.js
 │   └── whiteboard.js
 ├── templates/
 │   ├── index.html
 │   └── whiteboard.html
 ├── database.py
 ├── requirements.txt
 └── README.md

🧪 How to Run the Project
git clone <your-repository-link>
cd whiteboard-app
python -m venv .venv
.venv\Scripts\activate     (Windows)
pip install -r requirements.txt
uvicorn main:app --reload


Then open browser:

👉 http://127.0.0.1:8000/

📌 Internship Details
Field	                  Information
Internship Title	      Python Web Developer
Organization	          Gwing Software Technologies
Duration	              1 Month (Oct 27 – Nov 26, 2025)
Role	                  Backend + Frontend Development
Project                   Real-Time Collaborative Whiteboard
Responsibilities	      Developing backend API, implementing WebSockets, designing UI, integrating MongoDB, testing & documentation

Demo Video: https://youtu.be/XXXXXXXX
Live Link: https://yourdeployment.com 

the running process:
.venv/Scripts/Activate.ps1
pip install requirements.txt
uvicorn main:app --reload


Learning Outcomes

FastAPI real-time backend development

WebSocket based multi-user communication

MongoDB NoSQL data storage

JWT authentication

Frontend Canvas rendering and drawing logic

Full-stack deployment and version control with Git & GitHub
