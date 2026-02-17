import type { HexType } from "../types"

const HEX_RADIUS = 50;

interface HexagonProps {
    q: number
    r: number
    type: HexType
}

function getHexPoints(q: number, r: number, radius: number): string {
    // 1. Calculate Center
    const cx = radius * Math.sqrt(3) * (q + r / 2);
    const cy = radius * (3 / 2) * r;

    // 2. Calculate 6 Corners
    let points = [];
    for (let i = 0; i < 6; i++) {
        const angle_deg = 60 * i - 30;
        const angle_rad = (Math.PI / 180) * angle_deg;
        const px = cx + radius * Math.cos(angle_rad);
        const py = cy + radius * Math.sin(angle_rad);
        points.push(`${px},${py}`);
    }

    return points.join(" ");
}

export default function Hexagon({ q, r, type }: HexagonProps) {
    return <polygon points={getHexPoints(q, r, HEX_RADIUS)} fill="blue" stroke="black"></polygon>
}