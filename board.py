"""
Class to track the board state and related statistics
"""

from dataclasses import dataclass
from typing import Tuple, List, Dict
from enum import Enum

import math

MAP_RADIUS = 2
HEX_RADIUS = 50

Coordinate = Tuple[int, int]

class HexType(Enum):
    FOREST = 0
    PASTURE = 1
    QUARRY = 2
    CLAYPIT = 3
    FARM = 4
    DESERT = 5

@dataclass
class Vertex:
    adjacent_hexes: List[Coordinate]

@dataclass
class Hexagon:
    type: HexType
    points: List[Coordinate]

class Board:
    def __init__(self):
        self.hexes: Dict[Coordinate, Hexagon] = {}
        self.vertices: Dict[Coordinate, Vertex] = {}

        for q in range(-MAP_RADIUS, MAP_RADIUS+1, 1):
            r1 = max(-MAP_RADIUS, -q - MAP_RADIUS)
            r2 = min(MAP_RADIUS, -q + MAP_RADIUS)

            for r in range(r1, r2+1, 1):
                center_x, center_y = axial_to_pixel(q, r, HEX_RADIUS)
                points = generate_points_from_hex(center_x, center_y, HEX_RADIUS)
                hex =  Hexagon(HexType.FOREST, points)
                self.hexes[(q, r)] = hex

                for point in points:
                    if self.vertices.get(point, None) is not None:
                        self.vertices[point].adjacent_hexes.append((q, r))
                    else:
                        self.vertices[point] = Vertex([(q, r)])
    
    def get_board_dict(self) -> str:
        hexes = {}
        vertices = {}

        for coord, hex in self.hexes.items():
            hexes[str(coord)] = hex
        
        for coord, vertex in self.vertices.items():
            vertices[str(coord)] = vertex

        return {
            "hexes": hexes,
            "vertices": vertices
        }


def generate_points_from_hex(center_x: int, center_y: int, size: int) -> List[Coordinate]:
    """Generates the vertices of a given hexagon"""
    points = []

    for i in range(6):
        angle_deg = 60 * i - 30;
        angle_rad = (math.pi / 180) * angle_deg

        points.append((round(center_x + size * math.cos(angle_rad)), round(center_y + size * math.sin(angle_rad))))

    return points

def axial_to_pixel(q: int, r: int, size: int) -> Tuple[float, float]:
    """Converts axial (q, r) grid coordinates to screen pixel (x, y) coordinates."""
    x = size * math.sqrt(3) * (q + r/2)
    y = size * (3/2) * r
    return x, y