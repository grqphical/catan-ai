from pydantic import BaseModel
from backend.game_state import PlayerColour

class AddPlayerRequest(BaseModel):
    colour: PlayerColour
    ai: bool