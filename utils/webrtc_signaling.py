from fastapi import WebSocket
from typing import List

connected_clients: List[WebSocket] = []

async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # broadcast to all other clients
            for client in connected_clients:
                if client is not websocket:
                    await client.send_text(data)
    except Exception:
        pass
    finally:
        if websocket in connected_clients:
            connected_clients.remove(websocket)
