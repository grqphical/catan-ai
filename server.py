"""
Catan AI - Backend Server    
"""

from fastapi import FastAPI
from board import Board

app = FastAPI()

app.state.board = Board()

@app.get("/board")
async def index():
    return app.state.board.get_board_dict()
