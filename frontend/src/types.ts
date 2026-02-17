export enum PlayerColour {
    RED = "red",
    WHITE = "white",
    BLUE = "blue",
    ORANGE = "orange",
}

export enum GamePhase {
    PLAYER_SETUP = "player_setup",
    MAP_MAKING = "map_making",
    INITIAL_SETTLEMENT = "initial_settlement",
    REGULAR_GAME = "regular_game",
}

export interface Player {
    colour: PlayerColour;
    ai: boolean;
    wheat: number;
    bricks: number;
    wood: number;
    sheep: number;
    stone: number;
}

export interface GameState {
    players: Player[]
    phase: GamePhase
    used_colours: PlayerColour[]
}

export enum HexType {
    FOREST = "forest",
    PASTURE = "pasture",
    MOUNTAIN = "mountain",
    HILLS = "hills",
    FARM = "farm",
    DESERT = "desert",
}

export interface QRSCoord {
    q: number;
    r: number;
    s: number;
}

export interface Tile {
    id: string;
    coord: QRSCoord;
    resource: HexType;
    number: number;
    vertex_ids: string[];
    edge_ids: string[];
}

export interface Vertex {
    id: string;
    tile_ids: string[];
    edge_ids: string[];
    owner: string | null;
    building_type: string | null;
}

export interface Edge {
    id: string;
    tile_ids: string[];
    vertex_ids: string[];
    owner: string | null;
}

export interface Board {
    tiles: Tile[];
    vertices: Vertex[];
    edges: Edge[];
}