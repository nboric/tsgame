import {Direction, GameElement, Pos, HitRegion, Collisionable} from "./types.js";
import {drawCircle} from "./util.js";

enum Status {
    NORMAL,
    HIT,
    DYING,
    DEAD
}

export interface Enemy extends GameElement{
    isEnemy: boolean
    hitPoints: number
    status: Status
    elapsed: number

    shouldDisappear(): boolean
}

export function isEnemy(el: Collisionable): el is Enemy{
    return (el as Enemy).isEnemy !== undefined
}

class SimpleEnemy implements Enemy
{
    pos: Pos;
    dir: Direction
    speed: number
    isEnemy: boolean
    isHit: boolean
    hitPoints: number
    status: Status
    elapsed: number

    constructor(pos: Pos) {
        this.pos = {x: pos.x, y: pos.y}

        this.dir = {x: -1 + Math.random() * 2, y: -1 + Math.random() * 2}

        this.speed = 1 + Math.random() * 1.5

        this.isEnemy = true

        this.hitPoints = 3
        this.status = Status.NORMAL
        this.elapsed = 0
    }

    render(context: CanvasRenderingContext2D): HitRegion {
        let fill = 'rgb(0,255,255)'
        switch (this.status){
            case Status.HIT:
                fill = 'rgb(90,174,174)'
                break
            case Status.DYING:
                fill = 'rgb(0,34,34)'
                break
            default:

        }
        return {points: drawCircle(context, this.pos, 10, fill), element: this}
    }

    update(): void {

        this.elapsed++;
        switch (this.status)
        {
            case Status.DYING:
                if (this.elapsed > 60 * 2)
                {
                    this.status = Status.DEAD
                }
                break
            case Status.HIT:
                if (this.elapsed > 60 * 1)
                {
                    this.status = Status.NORMAL
                }
                break
            default:
        }

        this.pos.x += this.dir.x * this.speed
        this.pos.y += this.dir.y * this.speed
    }

    hit(): boolean {
        if (~this.isHit) {
            if (this.status == Status.NORMAL)
            {
                this.elapsed = 0
                this.status = Status.HIT
                this.hitPoints--
                if (this.hitPoints == 0){
                    this.status = Status.DYING
                }
            }
        }
        return true
    }

    shouldDisappear(): boolean {
        return this.status == Status.DEAD
    }

}

export class EnemyManager
{
    enemies: SimpleEnemy[]

    constructor(context: CanvasRenderingContext2D) {
        this.enemies = []
        let pos = {
            x: context.canvas.width / 3,
            y: context.canvas.height / 3
        }

        this.enemies.push(new SimpleEnemy(pos))
    }

    renderAll(context: CanvasRenderingContext2D): Array<HitRegion> {
        let regions: Array<HitRegion> = []
        this.enemies.forEach(enemy => {
            regions.push(enemy.render(context))
        })
        return regions
    }

    updateAll(): void {
        this.enemies.forEach(enemy => enemy.update())
        this.enemies = this.enemies.filter(e => !e.shouldDisappear())
    }
}
