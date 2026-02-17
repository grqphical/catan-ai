from enum import StrEnum
from typing import Dict, List
from dataclasses import dataclass

class PlayerColour(StrEnum):
    RED = "red"
    WHITE = "white"
    BLUE = "blue"
    ORANGE = "orange"

@dataclass
class Player:
    colour: PlayerColour
    ai: bool
    wheat: int
    bricks: int
    wood: int
    sheep: int
    stone: int

class GameState:
    def __init__(self):
        self.players: List[Player] = []
    
    def add_player(self, ai: bool, colour: PlayerColour):
        self.players.append(Player(colour, ai, 0, 0, 0, 0, 0))
    
    def to_dict(self) -> Dict[str, List[Player]]:
        return {"players": self.players}