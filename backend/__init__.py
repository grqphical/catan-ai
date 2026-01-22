"""
Catan AI - Backend Server
"""

from fastapi import FastAPI, HTTPException
from backend.board import Board, HexType

app = FastAPI()

app.state.board = Board()


@app.get("/board")
async def index():
    return app.state.board.get_board_dict()


@app.put("/set-type")
async def set_type(q: int, r: int, type: HexType):
    coords = (q, r)
    try:
        app.state.board.set_hexagon_type(type, coords)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
