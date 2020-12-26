import {Character} from "./character..js";
import {KeyController} from "./keys.js";
import {Enemy, EnemyManager} from "./enemy.js";
import {Collisionable, HitRegion} from "./types";
import {Projectile} from "./weapons";

class TheGame {
    private readonly context: CanvasRenderingContext2D;

    private mainChar: Character

    private keyController : KeyController

    private enemyManager: EnemyManager

    constructor() {
        const canvas: HTMLCanvasElement = document.createElement('canvas')
        const context: CanvasRenderingContext2D | null = canvas.getContext('2d')
        const root: HTMLElement | null = document.getElementById('root')

        if (context === null || root === null) {
            throw new Error('Unable to add canvas')
        }

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        root.appendChild(canvas);

        this.context = context;

        this.mainChar = new Character({
            x: this.context.canvas.width / 2,
            y: this.context.canvas.height / 2,
        })

        this.keyController = new KeyController()

        this.enemyManager = new EnemyManager(context)

    }

    renderAll(context: CanvasRenderingContext2D): void {
        const canvas: HTMLCanvasElement = context.canvas
        context.clearRect(0, 0, canvas.width, canvas.height)

        let collisions: Array<Array<Collisionable>> = [[]]
        for (let x = 0; x < Math.ceil(canvas.width); x++)
        {
            collisions.push(new Array(Math.ceil(canvas.height)))
        }

        let regions: Array<HitRegion> = []


        regions = regions.concat(this.mainChar.render(context))

        regions = regions.concat(this.enemyManager.renderAll(context))

        regions.forEach(region => {
            region.points.forEach(point => {
                if (collisions[point.x][point.y] != null)
                {
                    if (region.element as Character)
                    {
                        if (collisions[point.x][point.y] as Enemy)
                        {
                            console.log("hit by enemy: " + point.x + ", " + point.y)
                        }
                    }
                    if (region.element as Enemy) {
                        if (collisions[point.x][point.y] as Projectile) {
                            console.log("enemy hit: " + point.x + ", " + point.y)
                        }
                    }
                }
                collisions[point.x][point.y] = region.element
            })
        })
    }

    updateAll()
    {
        this.mainChar.update(this.keyController.keyMap)
        this.enemyManager.updateAll()
    }

    start(): void
    {
        this.loop()
    }

    loop(): void {
        requestAnimationFrame(() => {
            this.updateAll()
            this.renderAll(this.context)
            this.loop()
        })
    }
}

new TheGame().start();


