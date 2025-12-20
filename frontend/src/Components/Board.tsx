import { HexType, type Board, type HexCoordinate } from "../types";

interface BoardProps {
    board: Board
    selected_hex: HexCoordinate | null
    set_selcted_hex: Function
}

function getHexPoints(centerX: number, centerY: number, size: number) {
    const points = [];
    for (let i = 0; i < 6; i++) {
        // 60 degrees * i, but offset by 30 degrees to make it pointy-top
        const angle_deg = 60 * i - 30;
        const angle_rad = (Math.PI / 180) * angle_deg;

        points.push({
            x: centerX + size * Math.cos(angle_rad),
            y: centerY + size * Math.sin(angle_rad)
        });
    }
    return points.map(p => `${p.x},${p.y}`).join(" ");


}

function determine_tile_colour(type: HexType, is_selected: boolean) {
    if (is_selected) {
        return "white"
    }

    switch (type) {
        case HexType.Forest:
            return "green"
        case HexType.Farm:
            return "yellow"
        case HexType.Claypit:
            return "firebrick"
        case HexType.Desert:
            return "beige"
        case HexType.Pasture:
            return "greenyellow"
        case HexType.Quarry:
            return "grey"
        default:
            return "red"
    }
}

export default function BoardComponent(props: BoardProps) {
    const size = 50; // Radius of one hex


    const updateSelectedHex = (e: React.MouseEvent<SVGPolygonElement>) => {
        const elem = e.target as HTMLElement;
        const q = Number(elem.attributes.getNamedItem("data-q")?.value)
        const r = Number(elem.attributes.getNamedItem("data-r")?.value)

        props.set_selcted_hex({
            q, r
        })
    }

    return (
        <svg viewBox="-300 -300 600 600" width="100%" height="100%">
            {props.board.hexes.map(({ q, r, type }) => {
                const x = size * Math.sqrt(3) * (q + r / 2);
                const y = size * (3 / 2) * r;
                console.log(type);
                return (
                    <polygon
                        key={`${q}-${r}`}
                        data-q={q}
                        data-r={r}
                        className="hex"
                        points={getHexPoints(x, y, size)}
                        fill={determine_tile_colour(type, props.selected_hex?.q == q && props.selected_hex.r == r)}
                        stroke="white"
                        onClick={updateSelectedHex}
                    />
                );
            })}
        </svg>
    );
}