from pydantic import BaseModel
from backend.game_state import PlayerColour
from typing import List, Union

class AddPlayerRequest(BaseModel):
    colour: PlayerColour
    ai: bool

class QRSCoord(BaseModel):
    q: int
    r: int
    s: int
   

class Tile(BaseModel):
    id: str
    coord: QRSCoord
    resource: str
    number: int
    vertex_ids: List[str]
    edge_ids: List[str]

class Vertex(BaseModel):
    id: str
    tile_ids: List[str]
    edge_ids: List[str]
    owner: Union[str, None]
    building_type: Union[str, None]

class Edge(BaseModel):
    id: str
    tile_ids: List[str]
    vertex_ids: List[str]
    owner: Union[str, None]

class BoardResponse(BaseModel):
    tiles: List[Tile]
    vertices: List[Vertex]
    edges: List[Edge]