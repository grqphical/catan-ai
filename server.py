"""
Catan AI - Backend Server    
"""

from fastapi import FastAPI
from board import Board

app = FastAPI()

app.state.board = Board()

@app.get("/")
async def index():
    return app.state.__dict__
