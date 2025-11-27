from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# simple in-memory canvas storage: {session_id: image_data_url}
canvas_store = {}

class CanvasData(BaseModel):
    image: str

@router.post("/save")
def save_canvas(session_id: str, data: CanvasData):
    canvas_store[session_id] = data.image
    return {"message": "saved"}

@router.get("/load/{session_id}")
def load_canvas(session_id: str):
    image = canvas_store.get(session_id)
    if not image:
        return {"data": None}
    return {"data": {"image": image}}
