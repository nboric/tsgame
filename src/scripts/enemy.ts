import {Direction, GameElement, Pos, HitRegion} from "./types.js";
import {drawCircle} from "./util.js";

export interface Enemy extends GameElement{

}

class SimpleEnemy implements Enemy
{
    pos: Pos;
    dir: Direction
    speed: number

    constructor(pos: Pos) {
        this.pos = {x: pos.x, y: pos.y}

        this.dir = {x: -1 + Math.random() * 2, y: -1 + Math.random() * 2}

        this.speed = 1 + Math.random() * 2
    }

    render(context: CanvasRenderingContext2D): HitRegion {
        return {points: drawCircle(context, this.pos, 10, 'rgb(0,255,255)'), element: this}
    }

    update(): void {

        this.pos.x += this.dir.x * this.speed
        this.pos.y += this.dir.y * this.speed
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
    }
}
