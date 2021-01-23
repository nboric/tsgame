import {Direction, ElementType, GameElement, HitRegion, Pos} from "./types.js";
import {drawCircle} from "./util.js";

enum Status {
    NORMAL,
    HIT,
    DYING,
    DEAD,
    OUT_OF_BOUNDS
}

export interface Enemy extends GameElement{
    hitPoints: number
    status: Status
    elapsed: number

    shouldDisappear(): boolean
}

class SimpleEnemy implements Enemy
{
    protected readonly HIT_COOLDOWN_SECONDS: number = 1
    protected readonly DEAD_COOLDOWN_SECONDS: number = 2

    pos: Pos;
    dir: Direction
    speed: number
    hitPoints: number
    status: Status
    elapsed: number
    type: ElementType

    constructor(pos: Pos) {
        this.pos = {x: pos.x, y: pos.y}

        this.dir = {x: -1 + Math.random() * 2, y: -1 + Math.random() * 2}

        this.speed = 1 + Math.random() * 1.5

        this.hitPoints = 3
        this.status = Status.NORMAL
        this.elapsed = 0
        this.type = ElementType.ENEMY
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

        // TODO: don't like changing status in render
        if (this.pos.x < 0 || this.pos.x > context.canvas.width
            || this.pos.y < 0 || this.pos.y > context.canvas.height)
        {
            this.status = Status.OUT_OF_BOUNDS
        }

        return {points: drawCircle(context, this.pos, 10, fill), element: this}
    }

    update(): void {

        this.elapsed++;
        switch (this.status)
        {
            case Status.DYING:
                if (this.elapsed > 60 * this.DEAD_COOLDOWN_SECONDS)
                {
                    this.status = Status.DEAD
                }
                break
            case Status.HIT:
                if (this.elapsed > 60 * this.HIT_COOLDOWN_SECONDS)
                {
                    this.status = Status.NORMAL
                }
                break
            default:
        }

        this.pos.x += this.dir.x * this.speed
        this.pos.y += this.dir.y * this.speed
    }

    hit(hitBy: ElementType) {
        this.elapsed = 0
        this.status = Status.HIT
        this.hitPoints--
        if (this.hitPoints == 0){
            this.status = Status.DYING
        }
    }

    shouldDisappear(): boolean {
        return this.status == Status.DEAD || this.status == Status.OUT_OF_BOUNDS
    }

    shouldBeHit(hitBy: ElementType): boolean {
        return (hitBy == ElementType.PROJECTILE && this.status == Status.NORMAL)
    }

}

export class EnemyManager
{
    protected readonly MIN_ENEMIES: number = 2

    enemies: SimpleEnemy[]
    context: CanvasRenderingContext2D

    constructor(context: CanvasRenderingContext2D) {
        this.enemies = []

        // TODO: don't like to keep reference to context only to create new enemies in same position
        this.context = context
        this.enemies.push(this.newSimpleEnemy(context))
    }

    newSimpleEnemy(context: CanvasRenderingContext2D): SimpleEnemy {
        let pos = {
            x: context.canvas.width / 3,
            y: context.canvas.height / 3
        }

        return new SimpleEnemy(pos)
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

        if (this.enemies.length < this.MIN_ENEMIES)
        {
            this.enemies.push(this.newSimpleEnemy(this.context))
        }

    }
}
