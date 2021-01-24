export class KeyController {

    keyMap: IKeyMap = {}

    constructor() {
        document.addEventListener('keydown', (evt) => {
            if (evt.code) {
                this.keyMap[evt.code] = true
            }
        })
        document.addEventListener('keyup', (evt) => {
            if (evt.code) {
                this.keyMap[evt.code] = false
            }
        })
    }
}

export interface IKeyMap {
    [key: string]: boolean
}
