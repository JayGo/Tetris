import { Constant } from '../model/constant.js';


export class Controller {
    static instance

    isStarted = false

    isPlaying = false

    intervalCallback

    intervalId

    controllable

    static init(window, controller, canvasDelegate) {
        window.addEventListener('keydown', function (event) {
            switch (event.key) {
                case 'ArrowUp':
                    controller.rotateR();break;
                case 'ArrowLeft':
                    controller.translateL();break;
                case 'ArrowRight':
                    controller.translateR();break;
                case 'ArrowDown':
                    controller.translateD();break;
                case ' ':
                    controller.toggleState();break;
                default:break;
            }

            canvasDelegate.draw()
        });
    }


    constructor() {
    }

    setIntervalCallback(intervalCallback) {
        this.intervalCallback = intervalCallback
    }

    static getInstance() {
        if (Controller.instance === undefined) {
            Controller.instance = new Controller()
        }
        return Controller.instance
    }

    start() {
        if (this.isStarted || this.intervalCallback === undefined) {
            return
        }

        this.intervalId = setInterval(this.intervalCallback, 1000)

        this.isStarted = true
        this.isPlaying = true
    }

    setControllable(controllable) {
        this.controllable = controllable
    }

    afterAction() {

    }

    rotateR() {
        if (this.controllable === undefined || !this.isPlaying) {
            return
        }

        if (Constant.DEBUG_ROTATE) {
            console.log('controller rotateR');
            console.log(`before rotateR: ${this.controllable}`)

        }
        this.controllable.rotate(Math.PI / 2)

        if (Constant.DEBUG_ROTATE) {
            console.log(`after rotateR: ${this.controllable}`)
        }
    }

    translateL() {
        if (this.controllable === undefined || !this.isPlaying) {
            return;
        }

        this.controllable.translate(-Constant.TETRIS_SIZE, 0);
    }

    translateR() {
        if (this.controllable === undefined || !this.isPlaying) {
            return;
        }

        this.controllable.translate(Constant.TETRIS_SIZE, 0);
    }

    translateD() {
        if (this.controllable === undefined || !this.isPlaying) {
            return;
        }

        return this.controllable.translate(0, Constant.TETRIS_SIZE);
    }

    toggleState() {
        if (!this.isStarted) {
            this.start();
            return;
        }

        if (this.isPlaying) {
            this.pause();
        } else {
            this.resume();
        }
    }

    resume() {
        this.intervalId = setInterval(this.intervalCallback, 1000)

        this.isPlaying = true
    }

    pause() {
        clearInterval(this.intervalId)
        this.intervalId = undefined

        this.isPlaying = false
    }
}