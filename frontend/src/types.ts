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