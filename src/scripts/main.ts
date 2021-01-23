import {Character} from "./character.js";
import {KeyController} from "./keys.js";
import {EnemyManager} from "./enemy.js";
import {Collisionable, HitRegion} from "./types.js";

class TheGame {
    private readonly context: CanvasRenderingContext2D;

    private mainChar: Character

    private keyController : KeyController

    private enemyManager: EnemyManager

    private score: number

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

        this.score = 0

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

        let hitThisFrame = new Set<Collisionable>()

        regions.forEach(region => {
            if (hitThisFrame.has(region.element))
            {
                return
            }
            region.points.forEach(point => {
                if (point.x < 0 || point.x >= canvas.width ||
                    point.y < 0 || point.y > canvas.height)
                {
                    return
                }
                let collisionElement = collisions[point.x][point.y]
                if (collisionElement != null && !hitThisFrame.has(collisionElement))
                {
                    if (region.element.shouldBeHit(collisionElement.type))
                    {
                        region.element.hit(collisionElement.type)
                        hitThisFrame.add(region.element)
                    }
                    if (collisionElement.shouldBeHit(region.element.type))
                    {
                        collisionElement.hit(region.element.type)
                        hitThisFrame.add(collisionElement)
                    }
                }
                collisions[point.x][point.y] = region.element
            })
        })

        // out of bounds

        context.font = "30px Arial"
        context.fillText(`Score: ${this.score}`, 0, 30)
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


