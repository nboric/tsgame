import {BaseProjectile, BaseWeapon, Projectile} from "./weapons.js"
import {Direction, Pos, HitRegion} from "./types.js"
import {drawCircle} from "./util.js"

class Bomb extends BaseProjectile
{
    static readonly EXPLODE_SECONDS = 1
    protected readonly DISAPPEAR_SECONDS = 2

    pos: Pos
    exploded: boolean
    elapsed: number
    disappear: boolean

    constructor(pos: Pos, dir: Direction) {
        super(pos, dir)
        this.exploded = false
    }

    render(context: CanvasRenderingContext2D): HitRegion {
        let fillStyle: string
        if (this.exploded)
        {
            fillStyle = 'rgb(0,0,0)'
        }
        else
        {
            fillStyle = 'rgb(0,255,0)'
        }
        return { points: drawCircle(context, this.pos, 5, fillStyle), element: this }
    }

    update(): void {
        super.update()
        if (this.elapsed > 60 * Bomb.EXPLODE_SECONDS)
        {
            this.exploded = true
        }
    }

}

export class Bomber extends BaseWeapon
{
    protected readonly COOLDOWN_SECONDS = 1
    protected readonly MAX_FIRES = 2

    constructor() {
        super()
    }

    newProjectile(pos: Pos, dir: Direction): Projectile {
        return new Bomb(pos, dir)
    }

}
