from enum import StrEnum
from typing import Dict, List
from dataclasses import dataclass

class PlayerColour(StrEnum):
    RED = "red"
    WHITE = "white"
    BLUE = "blue"
    ORANGE = "orange"

class GamePhase(StrEnum):
    PLAYER_SETUP = "player_setup"
    MAP_MAKING = "map_making"
    INITIAL_SETTLEMENT = "initial_settlement"
    REGULAR_GAME = "regular_game"

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
        self.phase: GamePhase = GamePhase.PLAYER_SETUP
        self.used_colours = set([])
    
    def add_player(self, ai: bool, colour: PlayerColour):
        if colour in self.used_colours:
            raise ValueError("colour already used")
        self.players.append(Player(colour, ai, 0, 0, 0, 0, 0))
        self.used_colours.add(colour)
    
    def reset_players(self):
        self.players = []
        self.used_colours = set([])
    
    def to_dict(self) -> Dict[str, List[Player]]:
        return {"players": self.players, "phase": self.phase, "used_colours": self.used_colours}