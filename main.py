from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from auth_router import router as auth_router   # our in-memory auth
from routers import sessions, canvas
from utils.webrtc_signaling import websocket_endpoint

app = FastAPI(title="Real-Time Collaborative Whiteboard")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# routers
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(sessions.router, prefix="/sessions", tags=["Sessions"])
app.include_router(canvas.router, prefix="/canvas", tags=["Canvas"])


# ===== HTML PAGES =====

@app.get("/")
def home():
    # login + session page
    return FileResponse("templates/index.html")


@app.get("/whiteboard")
def whiteboard():
    # drawing page
    return FileResponse("templates/whiteboard.html")


# ===== WEBSOCKET =====

@app.websocket("/ws/whiteboard")
async def websocket_route(websocket: WebSocket):
    await websocket_endpoint(websocket)
