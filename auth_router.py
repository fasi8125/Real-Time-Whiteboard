from fastapi import APIRouter
from utils.jwt_handler import create_token

router = APIRouter()
users = {}  # simple in-memory storage: {username: password}

@router.post("/register")
def register_user(username: str, password: str):
    if username in users:
        return {"error": "User already exists"}
    users[username] = password
    return {"message": "Registered"}

@router.post("/login")
def login_user(username: str, password: str):
    if username not in users or users[username] != password:
        return {"error": "Invalid username or password"}
    token = create_token({"username": username})
    return {"access_token": token}
