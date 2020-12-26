import {Pos} from "./types.js";

export function drawCircle(context: CanvasRenderingContext2D, center: Pos, radius: number, fillStyle: string): Array<Pos>
{
    context.fillStyle = fillStyle

    context.beginPath()
    context.arc(center.x, center.y, radius, 0, 2 * Math.PI)
    context.closePath()
    context.fill()

    return circleRegion(center, radius)
}

export function circleRegion(center: Pos, radius: number): Array<Pos>{
    let points: Array<Pos> = []
    for (let x = Math.floor(center.x - radius); x < Math.ceil(center.x + radius); x++)
    {
        for (let y = Math.floor(center.y - radius); y < Math.ceil(center.y + radius); y++)
        {
            if (Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2) < Math.pow(radius, 2))
            {
                points.push({x: x, y: y})
            }
        }
    }
    return points
}
