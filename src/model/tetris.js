import {Constant} from "./constant.js";
import { Coordinate, Drawable, CanvasDelegate } from './canvas.js';

export class TetrisFactory {
    static instance
    constructor() {
    }

    static getInstance() {
        if (TetrisFactory.instance === undefined) {
            TetrisFactory.instance = new TetrisFactory()
        }
        return TetrisFactory.instance
    }

    makeTetris(type) {
        let tetris
        switch (type) {
            case 0 : tetris = new TTetris();break;
        }
        return tetris
    }
}

class Box {
    lt
    rt
    lb
    rb

    canvasDelegate

    nextVertexes

    constructor(lt, rb, color, canvasDelegate) {
        this.x = lt.x
        this.y = lt.y
        this.w = rb.x - lt.x
        this.h = rb.y - lt.y
        this.color = color

        this.lt = lt
        this.rt = new Coordinate(lt.x + this.w, lt.y)
        this.lb = new Coordinate(lt.x, lt.y + this.h)
        this.rb = rb

        this.canvasDelegate = canvasDelegate
    }

    checkInBounds(x, y) {
        let left = this.canvasDelegate.getLeft()
        let right = this.canvasDelegate.getRight()
        let bottom = this.canvasDelegate.getBottom()

        let xInBound = x >= left && x <= right
        let yInBound = y<= bottom

        return xInBound && yInBound
    }

    preRotate(px, py, deg) {
        if (deg === 0) {
            return
        }

        let vertexes = JSON.parse(JSON.stringify([this.lt, this.rt, this.rb, this.lb]))

        let rotateFailed = false

        vertexes.forEach(coord => {
            let cos = Number(Math.cos(deg).toFixed(1))
            let sin = Number(Math.sin(deg).toFixed(1))
            if (Constant.DEBUG_TETRIS) {
                console.log(`cos(${deg}) = ${cos}, sin(${deg}) = ${sin}, px = ${px}, py = ${py}`)
            }
            const x = coord.x;
            const y = coord.y;

            const dx = Number((x - px).toFixed(1))
            const dy = Number((y - py).toFixed(1))

            const xNew = dx * cos - dy * sin + px;
            const yNew = dx * sin + dy * cos + py;

            if (!this.checkInBounds(xNew, yNew)) {
                rotateFailed = true
                return
            }

            coord.x = xNew
            coord.y = yNew
        })

        this.nextVertexes = vertexes

        return !rotateFailed
    }

    applyRotate(deg) {
        /**
         * lt----rt rotateR lb----lt rotateL rt----rb
         * ｜    ｜          ｜    ｜         ｜     ｜
         * ｜    ｜          ｜    ｜         ｜     ｜
         * lb---rb          rb----rt         lt----lb
         */
        if (deg > 0) {
            this.lb = this.nextVertexes[2] // rb
            this.rb = this.nextVertexes[1] // rt
            this.rt = this.nextVertexes[0] // lt
            this.lt = this.nextVertexes[3] // lb
        } else if (deg < 0) {
            this.lt = this.nextVertexes[1] // rt
            this.rt = this.nextVertexes[2] // rb
            this.rb = this.nextVertexes[3] // lb
            this.lb = this.nextVertexes[0] // lt
        }

        this.x = this.lt.x
        this.y = this.lt.y
    }

    preTranslate(tx, ty) {
        let vertexes = JSON.parse(JSON.stringify([this.lt, this.rt, this.rb, this.lb]))

        let translateFailed = false

        vertexes.forEach((coord) => {
            let newX = coord.x + tx
            let newY = coord.y + ty

            if (!this.checkInBounds(newX, newY)) {
                translateFailed = true
                return
            }

            coord.x = newX
            coord.y = newY
        })

        this.nextVertexes = vertexes

        return !translateFailed
    }

    applyTranslate(tx, ty) {
        [this.lt, this.rt, this.rb, this.lb] = this.nextVertexes

        this.x = this.lt.x;
        this.y = this.lt.y;
    }

    draw(canvasCtx) {
        canvasCtx.fillStyle = this.color
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);
    }

    toString() {
        return `Box(lt: ${this.lt}, rt: ${this.rt}, rb: ${this.rb}, lb: ${this.lb})`;
    }
}

class BaseTetris extends Drawable {
    boxes
    midX
    baseY

    constructor() {
        super()

        let width = CanvasDelegate.getInstance().getWidth();

        this.midX = width / 2.0
        this.baseY = 0

        this.boxes = new Array(4)
    }

    init(coords, color) {
        for (let i = 0; i < coords.length; i++) {
            let coord = coords[i]
            this.boxes[i] = new Box(
                new Coordinate(this.midX + coord[0] * Constant.TETRIS_SIZE, this.baseY + coord[1] * Constant.TETRIS_SIZE),
                new Coordinate(this.midX + coord[2] * Constant.TETRIS_SIZE, this.baseY + coord[3] * Constant.TETRIS_SIZE),
                color, CanvasDelegate.getInstance())
        }
    }

    rotate(deg) {
        if (Constant.DEBUG_TETRIS) {
            console.log('tetris rotate');
        }

        let pivotBox = this.boxes[1]
        let pivotLt = pivotBox.lt
        let pivotRb = pivotBox.rb
        let pivotX = Number(((pivotLt.x + pivotRb.x) / 2.0).toFixed(1))
        let pivotY = Number(((pivotLt.y + pivotRb.y) / 2.0).toFixed(1))

        let rotateSuccess = true

        this.boxes.forEach(it => {
            rotateSuccess = rotateSuccess && it.preRotate(pivotX, pivotY, deg)
        })

        if (rotateSuccess) {
            this.boxes.forEach(it => {
                it.applyRotate(deg)
            })
        }

        return rotateSuccess
    }

    translate(tx, ty) {
        if (Constant.DEBUG_TETRIS) {
            console.log('tetris translate');
        }

        let translateSuccess = true

        this.boxes.forEach(it => {
            translateSuccess = translateSuccess && it.preTranslate(tx, ty)
        });

        if (translateSuccess) {
            this.boxes.forEach(it => {
                it.applyTranslate(tx, ty)
            });
        }

        return translateSuccess
    }

    onDraw(canvasCtx) {
        this.boxes.forEach(it => it.draw(canvasCtx))
    }

    toString() {
        let str = `Boxes(`
        for (let i = 0; i < this.boxes.length; i++) {
            str += `\n${this.boxes[i]}, `
        }

        str += `)`
        return str
    }
}

class TTetris extends BaseTetris {
    constructor() {
        super();
        let coords = [
            [-1.5, 1.0, -0.5, 2.0],
            [-0.5, 1.0, 0.5, 2.0],
            [-0.5, 0.0, 0.5, 1.0],
            [0.5, 1.0, 1.5, 2.0]
        ]
        super.init(coords, Constant.TETRIS_COLOR_T)
    }

}