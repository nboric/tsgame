import {BaseProjectile, BaseWeapon, Projectile} from "./weapons.js"
import {Direction, Pos, HitRegion} from "./types.js"
import {drawCircle} from "./util.js"

export class Pistol extends BaseWeapon {
    protected readonly COOLDOWN_SECONDS = .2
    protected readonly MAX_FIRES = 10

    constructor() {
        super()
    }

    newProjectile(pos: Pos, dir: Direction): Projectile {
        return new Bullet(pos, dir)
    }


}

class Bullet extends BaseProjectile {
    static readonly MOVE_STEP = 3
    protected readonly DISAPPEAR_SECONDS = 2

    pos: Pos
    direction: Direction

    constructor(pos: Pos, dir: Direction) {
        super(pos, dir)
        this.direction = { x: dir.x, y: dir.y }
    }

    render(context: CanvasRenderingContext2D): HitRegion {
        return { points: drawCircle(context, this.pos, 5, 'rgb(0,255,0)'), element: this }
    }

    update(): void {
        this.pos.x += this.direction.x * Bullet.MOVE_STEP
        this.pos.y += this.direction.y * Bullet.MOVE_STEP

        super.update()

    }
}
