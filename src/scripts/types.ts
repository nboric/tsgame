export interface Pos{
    x: number
    y: number
}

export interface Direction{
    x: number
    y: number
}

export interface HitRegion{
    points: Array<Pos>
    element: Collisionable
}

export interface Collisionable{

}

export interface GameElement extends Collisionable{
    pos: Pos

    render(context: CanvasRenderingContext2D): HitRegion

    update(): void
}
