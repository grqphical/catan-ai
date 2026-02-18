"""
Catan AI - Backend Server
"""

from fastapi import FastAPI, HTTPException
from backend.board import CatanBoard, HexType
from backend.game_state import GameState, GamePhase
from backend.models import AddPlayerRequest, BoardResponse, BoardValidationResponse

app = FastAPI()

app.state.board = CatanBoard()
app.state.game_state = GameState()

@app.get("/board")
async def get_board() -> BoardResponse:
    return app.state.board.to_dict()

@app.get("/validate-board")
async def validate_board() -> BoardValidationResponse:
    return {
        "valid": app.state.board.is_valid_board()
    }

@app.get("/game-state")
async def game_state():
    return app.state.game_state.to_dict()

@app.post("/add-player")
async def add_player(r: AddPlayerRequest):
    app.state.game_state.add_player(r.ai, r.colour)

@app.patch("/reset-players")
async def reset_players():
    app.state.game_state.reset_players()

@app.put("/set-game-phase")
async def set_game_phase(phase: GamePhase):
    app.state.game_state.set_phase(phase)

@app.put("/set-tile-type")
async def set_tile_type(q: int, r: int, s:int, type: HexType):
    try:
        app.state.board.set_tile_type(q, r, s, type)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
