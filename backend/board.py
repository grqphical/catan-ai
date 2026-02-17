"""
Class to track the board state and related statistics
"""

from dataclasses import dataclass, field
from typing import Tuple, List, Dict, Set
from enum import StrEnum

class HexType(StrEnum):
    FOREST = "forest"
    PASTURE = "pasture"
    MOUNTAIN = "mountain"
    HILLS = "hills"
    FARM = "farm"
    DESERT = "desert"

@dataclass
class CubeCoordinate:
    q: int
    r: int
    s: int

    def __post_init__(self):
        if self.q + self.r + self.s != 0:
            raise ValueError("Cube coordinates must sum to 0")

@dataclass
class Tile:
    id: str
    coord: CubeCoordinate
    resource: HexType
    number: int
    vertex_ids: List[str] = field(default_factory=list)
    edge_ids: List[str] = field(default_factory=list)


@dataclass
class Vertex:
    id: str
    tile_ids: Set[str] = field(default_factory=set)
    edge_ids: Set[str] = field(default_factory=set)
    owner: str = None
    building_type: str = None

@dataclass
class Edge:
    id: str
    vertex_ids: Tuple[str, str] = None
    tile_ids: Set[str] = field(default_factory=set)
    owner: str = None


class CatanBoard:
    def __init__(self, radius: int = 2):
        self.tiles: Dict[str, Tile] = {}
        self.vertices: Dict[str, Vertex] = {}
        self.edges: Dict[str, Edge] = {}
        self._generate_board(radius)

    def _generate_board(self, radius: int):
        """Generates a standard hexagonal board of a given radius."""
        tile_count = 0
        for q in range(-radius, radius + 1):
            for r in range(max(-radius, -q - radius), min(radius, -q + radius) + 1):
                s = -q - r
                tile_id = f"tile_{tile_count}"
                coord = CubeCoordinate(q, r, s)
                
                new_tile = Tile(id=tile_id, coord=coord, resource="desert", number=0)
                self.tiles[tile_id] = new_tile
                
                self._map_geometry_for_tile(new_tile)
                tile_count += 1

    def _map_geometry_for_tile(self, tile: Tile):
        """
        Calculates the 6 vertices and 6 edges for a tile.
        Uses a consistent naming convention to ensure shared vertices 
        between tiles are identified as the same object.
        """
        current_v_ids = []
        for i in range(6):
            v_id = self._get_vertex_id(tile.coord, i)
            if v_id not in self.vertices:
                self.vertices[v_id] = Vertex(id=v_id)
            
            self.vertices[v_id].tile_ids.add(tile.id)
            current_v_ids.append(v_id)
        
        tile.vertex_ids = current_v_ids

        for i in range(6):
            v1_id = current_v_ids[i]
            v2_id = current_v_ids[(i + 1) % 6]
            
            edge_id = f"e_{min(v1_id, v2_id)}_{max(v1_id, v2_id)}"
            
            if edge_id not in self.edges:
                self.edges[edge_id] = Edge(id=edge_id, vertex_ids=(v1_id, v2_id))
            
            # Link the edge to this tile and vice-versa
            self.edges[edge_id].tile_ids.add(tile.id)
            tile.edge_ids.append(edge_id)
            
            # Link the edge to its constituent vertices (Bi-directional graph)
            self.vertices[v1_id].edge_ids.add(edge_id)
            self.vertices[v2_id].edge_ids.add(edge_id)

    def _get_vertex_id(self, coord: CubeCoordinate, corner_index: int) -> str:
        """
        Generates a unique ID for a vertex based on the coordinates 
        of the 3 hexes that meet there.
        """

        neighbor_indices = [
            (corner_index - 1) % 6, 
            corner_index
        ]
        
        # Cube neighbor offsets (standard hex math)
        offsets = [(1, -1, 0), (1, 0, -1), (0, 1, -1), (-1, 1, 0), (-1, 0, 1), (0, -1, 1)]
        
        # The 3 hexes are: Current, Neighbor A, Neighbor B
        shared_hexes = [
            (coord.q, coord.r, coord.s),
            (coord.q + offsets[neighbor_indices[0]][0], 
             coord.r + offsets[neighbor_indices[0]][1], 
             coord.s + offsets[neighbor_indices[0]][2]),
            (coord.q + offsets[neighbor_indices[1]][0], 
             coord.r + offsets[neighbor_indices[1]][1], 
             coord.s + offsets[neighbor_indices[1]][2])
        ]
        
        # Sort coordinates and join into a string for a unique key
        shared_hexes.sort()
        return "v_" + "_".join([f"{h[0]},{h[1]}" for h in shared_hexes])

    def to_dict(self):
        """Helper to dump the board for the React frontend."""
        return {
            "tiles": [vars(t) for t in self.tiles.values()],
            "vertices": [vars(v) for v in self.vertices.values()],
            "edges": [vars(e) for e in self.edges.values()]
        }
    
    def set_tile_type(self, q: int, r: int, s: int, resource: HexType):
        """Sets the resource type for a tile at the given cube coordinates."""
        coord = CubeCoordinate(q, r, s)
        for tile in self.tiles.values():
            if tile.coord == coord:
                tile.resource = resource
                return
        raise KeyError(f"No tile found at coordinates ({q}, {r}, {s})")