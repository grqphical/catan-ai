export enum HexType {
    Forest = 0,
    Pasture = 1,
    Quarry = 2,
    Claypit = 3,
    Farm = 4,
    Desert = 5
}

export interface Hex {
    q: number
    r: number
    type: HexType
}

export interface HexCoordinate {
    q: number
    r: number
}

export interface Board {
    hexes: Array<Hex>
}