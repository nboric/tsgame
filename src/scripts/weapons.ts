import {Direction, ElementType, GameElement, HitRegion, Pos} from "./types.js"

export interface Weapon
{
    canFire(): boolean
    fire(pos: Pos, direction: Direction): void
    updateAll(): void
    renderAll(context: CanvasRenderingContext2D): Array<HitRegion>
}

export interface Projectile extends GameElement
{
    shouldDisappear(): boolean
}

export abstract class BaseWeapon implements Weapon
{
    protected readonly COOLDOWN_SECONDS: number = 1
    protected readonly MAX_FIRES: number = 2

    private projectiles: Projectile[]
    private coolDown: number

    protected constructor() {
        this.projectiles = []
        this.coolDown = 0
    }

    canFire(): boolean {
        if (this.projectiles.length < this.MAX_FIRES) {
            if (this.projectiles.length == 0 || this.coolDown > 60 * this.COOLDOWN_SECONDS) {
                return true
            }
        }
        return false
    }

    fire(pos: Pos, dir: Direction): void {
        let proj = this.newProjectile(pos, dir)
        this.projectiles.push(proj)
        this.coolDown = 0
    }

    updateAll(): void {
        if (this.projectiles.length > 0)
        {
            this.coolDown++
        }
        this.projectiles.forEach(proj => { proj.update() })
        this.projectiles = this.projectiles.filter(proj => !proj.shouldDisappear())
    }

    renderAll(context: CanvasRenderingContext2D): Array<HitRegion> {
        let regions: Array<HitRegion> = []
        this.projectiles.forEach(proj => {
            regions.push(proj.render(context))
        })
        return regions
    }

    protected abstract newProjectile(pos: Pos, direction: Direction): Projectile

}

export abstract class BaseProjectile implements Projectile {
    pos: Pos
    disappear: boolean
    elapsed: number
    type: ElementType

    protected readonly DISAPPEAR_SECONDS = 2

    protected constructor(pos: Pos, dir: Direction) {
        this.pos = { x: pos.x, y: pos.y }
        this.disappear = false
        this.elapsed = 0
        this.type = ElementType.PROJECTILE
    }

    hit(hitBy: ElementType): boolean {
        this.disappear = true
        return true
    }

    abstract render(context: CanvasRenderingContext2D): HitRegion

    shouldDisappear(): boolean {
        return this.disappear
    }

    update(): void {
        this.elapsed++
        if (this.elapsed > 60 * this.DISAPPEAR_SECONDS)
        {
            this.disappear = true
        }
    }

    shouldBeHit(hitBy: ElementType): boolean {
        return (hitBy == ElementType.ENEMY && !this.shouldDisappear())
    }

}
