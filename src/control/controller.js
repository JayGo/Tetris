import { Constant } from '../model/constant.js';

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
        if (this.controllable === undefined) {
            return
        }

        if (Constant.DEBUG_ROTATE) {
            console.log('controller rotateR');
        }
        this.controllable.rotate(Math.PI / 2)
    }

    rotateL() {
        if (this.controllable === undefined) {
            return
        }

        if (Constant.DEBUG_ROTATE) {
            console.log('controller rotateL');
        }
        this.controllable.rotate(-Math.PI / 2)
    }

    resume() {
        this.isPlaying = true
    }

    pause() {
        this.isPlaying = false
    }
}