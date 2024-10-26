export class Controller {
    static instance

    isStarted = false

    isPlaying = false

    callback

    controllable

    constructor() {
    }

    setCallback(callback) {
        this.callback = callback
    }

    static getInstance() {
        if (Controller.instance === undefined) {
            Controller.instance = new Controller()
        }
        return Controller.instance
    }

    start() {
        if (this.isStarted || this.callback === undefined) {
            return
        }

        this.callback.onUpdate()

        this.isStarted = true

    }

    setControllable(controllable) {
        this.controllable = controllable
    }

    rotateR() {
        if (this.controllable !== undefined) {
            console.log('controller rotateR');
            this.controllable.rotateR()
        }
    }

    resume() {
        this.isPlaying = true
    }

    pause() {
        this.isPlaying = false
    }
}