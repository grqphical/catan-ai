"""
Catan AI - Backend Server
"""

from fastapi import FastAPI, HTTPException
from backend.board import CatanBoard, HexType

app = FastAPI()

app.state.board = CatanBoard()


@app.get("/board")
async def index():
    return app.state.board.to_dict()


@app.put("/set-type")
async def set_type(q: int, r: int, type: HexType):
    coords = (q, r)
    try:
        app.state.board.set_hexagon_type(type, coords)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
