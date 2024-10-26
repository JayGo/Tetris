import {Constant} from "./constant.js";
import {Coordinate} from "./canvas.js";

export class TetrisFactory {
    static instance
    canvas
    constructor(canvas) {
        this.canvas = canvas
    }

    static getInstance(canvas) {
        if (TetrisFactory.instance === undefined) {
            TetrisFactory.instance = new TetrisFactory(canvas)
        }
        return TetrisFactory.instance
    }

    makeTetris(type) {
        let tetris
        switch (type) {
            case 0 : tetris = new TTetris(this.canvas);break;
        }
        return tetris
    }
}

class Box {
    lt
    rt
    lb
    rb
    constructor(lt, rb, color) {
        this.x = lt.x
        this.y = lt.y
        this.w = rb.x - lt.x
        this.h = rb.y - lt.y
        this.color = color

        this.lt = lt
        this.rt = new Coordinate(lt.x + this.w, lt.y)
        this.lb = new Coordinate(lt.x, lt.y + this.h)
        this.rb = rb
    }

    rotate(px, py, deg) {
        if (deg === 0) {
            return
        }

        let vertexes = [this.lt, this.rt, this.rb, this.lb]
        vertexes.forEach(coord => {
            let cos = Number(Math.cos(deg).toFixed(1))
            let sin = Number(Math.sin(deg).toFixed(1))
            console.log(`cos(${deg}) = ${cos}, sin(${deg}) = ${sin}, px = ${px}, py = ${py}`)
            // x = cos(q)(coord.x + px) - sin(q)(coord.y + py) - px
            // y = sin(q)(coord.x + px) + sin(q)(coord.y + py) - py
            const x = coord.x;
            const y = coord.y;

            const dx = Number((x - px).toFixed(1))
            const dy = Number((y - py).toFixed(1))

            const xNew = dx * cos - dy * sin + px;
            const yNew = dx * sin + dy * cos + py;
            coord.x = xNew
            coord.y = yNew
        })

        /**
         * lt----rt rotateR lb----lt rotateL rt----rb
         * ｜    ｜          ｜    ｜         ｜     ｜
         * ｜    ｜          ｜    ｜         ｜     ｜
         * lb---rb          rb----rt         lt----lb
         */
        if (deg > 0) {
            let tmp = this.lb
            this.lb = this.rb
            this.rb = this.rt
            this.rt = this.lt
            this.lt = tmp
        } else if (deg < 0) {
            let tmp = this.lt
            this.lt = this.rt
            this.rt = this.rb
            this.rb = this.lb
            this.lb = tmp
        }

        this.x = this.lt.x
        this.y = this.lt.y
    }

    draw(canvas, newColor) {
        canvas.fillStyle = this.color
        if (newColor !== undefined) {
            canvas.fillStyle = newColor
        }
        canvas.fillRect(this.x, this.y, this.w, this.h);
    }

    toString() {
        return `Box(lt: ${this.lt}, rt: ${this.rt}, rb: ${this.rb}, lb: ${this.lb})`;
    }
}

class BaseTetris {
    boxes
    midX
    baseY
    canvasCtx

    constructor(canvas) {
        this.canvasCtx = canvas.getContext("2d");
        let l = 0
        let t = 0
        let r = canvas.width

        this.midX = (l + r) / 2.0
        this.baseY = t

        this.boxes = new Array(4)
    }

    init(coords, color) {
        for (let i = 0; i < coords.length; i++) {
            let coord = coords[i]
            this.boxes[i] = new Box(
                new Coordinate(this.midX + coord[0] * Constant.TETRIS_SIZE, this.baseY + coord[1] * Constant.TETRIS_SIZE),
                new Coordinate(this.midX + coord[2] * Constant.TETRIS_SIZE, this.baseY + coord[3] * Constant.TETRIS_SIZE),
                color)
        }
    }

    rotateR() {
        console.log('tetris rotateR');

        let pivotBox = this.boxes[1]
        let pivotLt = pivotBox.lt
        let pivotRb = pivotBox.rb
        let pivotX = Number(((pivotLt.x + pivotRb.x) / 2.0).toFixed(1))
        let pivotY = Number(((pivotLt.y + pivotRb.y) / 2.0).toFixed(1))

        this.boxes.forEach(it => it.rotate(pivotX, pivotY, Math.PI / 2))
    }

    draw(newColor) {
        this.boxes.forEach(it => it.draw(this.canvasCtx, newColor))
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
    constructor(canvas) {
        super(canvas);
        let coords = [
            [-1.5, 1.0, -0.5, 2.0],
            [-0.5, 1.0, 0.5, 2.0],
            [-0.5, 0.0, 0.5, 1.0],
            [0.5, 1.0, 1.5, 2.0]
        ]
        super.init(coords, Constant.TETRIS_COLOR_T)
    }

}