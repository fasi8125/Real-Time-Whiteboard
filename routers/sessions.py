from fastapi import APIRouter
from uuid import uuid4
from utils.jwt_handler import verify_token

router = APIRouter()

# in-memory sessions: {session_id: {"users": [usernames]}}
sessions_store = {}

@router.post("/create")
def create_session(token: str):
    user = verify_token(token)
    if not user:
        return {"error": "Unauthorized"}

    session_id = str(uuid4())
    sessions_store[session_id] = {"users": [user["username"]]}
    return {"session_id": session_id}

@router.post("/join/{session_id}")
def join_session(session_id: str, token: str):
    user = verify_token(token)
    if not user:
        return {"error": "Unauthorized"}

    if session_id not in sessions_store:
        sessions_store[session_id] = {"users": []}

    if user["username"] not in sessions_store[session_id]["users"]:
        sessions_store[session_id]["users"].append(user["username"])

    return {"message": f"{user['username']} joined session {session_id}"}
