import {IKeyMap} from "./keys.js";
import {Weapon} from "./weapons.js";
import {Bomber} from "./bomb.js";
import {Pistol} from "./pistol.js";
import {Collisionable, Direction, ElementType, HitRegion, Pos} from "./types.js";
import {drawCircle} from "./util.js";

enum Status {
    NORMAL,
    HIT,
    DYING,
    DEAD,
    OUT_OF_BOUNDS
}

export class Character implements Collisionable{
    static readonly MOVE_STEP = 2
    static readonly RADIUS = 20

    pos: Pos;
    dir: Direction
    weapons: Weapon[]
    bomber: Bomber
    pistol: Pistol
    elapsed: number
    type: ElementType
    hitPoints: number
    status: Status

    constructor(pos: Pos) {
        this.pos = pos;
        this.bomber = new Bomber()
        this.pistol = new Pistol()
        this.weapons = [this.bomber, this.pistol]
        this.dir = {x: 0, y: 0}
        this.elapsed = 0
        this.type = ElementType.CHARACTER
        this.hitPoints = 5
        this.status = Status.NORMAL
    }

    pointerPos(pos: Pos, dir: Direction, radius: number): Pos{
        let l = radius
        if (dir.x != 0 && dir.y != 0)
        {
            l = radius * Math.sin(Math.PI/4)
        }
        return {x: pos.x + dir.x * l, y: pos.y + dir.y * l}
    }

    render(context: CanvasRenderingContext2D): Array<HitRegion> {

        let fill = 'rgb(255,0,0)'
        switch(this.status)
        {
            case Status.HIT:
                if (Math.round(this.elapsed / (60/2)) % 2 == 0)
                {
                    fill = 'rgb(179,149,149)'
                }
                break
            case Status.DYING:
                fill = 'rgb(33,6,6)'
                break
            case Status.DEAD:
                fill = 'rgb(159,146,146)'
                break
        }

        let charRegion = {
            points: drawCircle(context, this.pos, Character.RADIUS, fill),
            element: this
        }

        context.fillStyle = 'rgb(0,0,0)'
        context.beginPath()
        if (this.dir.x != 0 || this.dir.y != 0)
        {
            let pointer = this.pointerPos(this.pos, this.dir, Character.RADIUS)
            context.arc(pointer.x, pointer.y, 2, 0, 2 * Math.PI)
            context.closePath()
            context.fill()
        }

        let regions: Array<HitRegion> = []
        regions.push(charRegion)

        this.weapons.forEach(weapon => {
            regions = regions.concat(weapon.renderAll(context))
        })

        context.font = "15px Arial"
        context.fillStyle = 'rgb(0,0,0)'
        context.fillText(`${this.hitPoints}`, this.pos.x-5, this.pos.y+5)

        return regions
    }

    update(keyMap: IKeyMap): void {

        if (this.status == Status.DEAD)
        {
            return
        }

        this.dir = {x: 0, y: 0}
        if (keyMap['KeyS'])
        {
            this.pos.y += Character.MOVE_STEP
            this.dir.y = 1
        }
        else if (keyMap['KeyW'])
        {
            this.pos.y -= Character.MOVE_STEP
            this.dir.y = -1
        }
        if (keyMap['KeyD'])
        {
            this.pos.x += Character.MOVE_STEP
            this.dir.x = 1
        }
        else if (keyMap['KeyA'])
        {
            this.pos.x -= Character.MOVE_STEP
            this.dir.x = -1
        }

        if (keyMap['KeyB'])
        {
            if (this.bomber.canFire())
            {
                this.bomber.fire(this.pos, this.dir)
            }
        }

        if (keyMap['KeyF'])
        {
            if (this.dir.x != 0 || this.dir.y != 0)
            {
                if (this.pistol.canFire())
                {
                    let pointer = this.pointerPos(this.pos, this.dir, Character.RADIUS)
                    this.pistol.fire(pointer, this.dir)
                }
            }
        }

        this.elapsed++;
        switch (this.status)
        {
            case Status.DYING:
                if (this.elapsed > 60 * 3)
                {
                    this.status = Status.DEAD
                }
                break
            case Status.HIT:
                if (this.elapsed == 60 * 5)
                {
                    this.status = Status.NORMAL
                }
                break
            default:
        }

        this.weapons.forEach(weapon => weapon.updateAll())
    }

    hit(hitBy: ElementType) {
        this.status = Status.HIT
        this.elapsed = 0
        this.hitPoints--
        if (this.hitPoints == 0){
            this.status = Status.DYING
        }

    }

    shouldBeHit(hitBy: ElementType): boolean {
        return hitBy == ElementType.ENEMY && this.status == Status.NORMAL
    }
}
