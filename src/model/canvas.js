
export class CanvasDelegate {
    canvas
    canvasCtx

    currentTetris

    heap

    static instance

    static init(canvas, heap) {
        if (CanvasDelegate.instance === undefined) {
            CanvasDelegate.instance = new CanvasDelegate(canvas, heap);
        }

    }

    static getInstance() {
        return CanvasDelegate.instance;

    }

    constructor(canvas, heap) {
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext("2d");
        this.heap = heap
    }

    setCurrentTetris(tetris) {
        if (this.currentTetris !== undefined) {
            this.heap.recycleTetris(this.currentTetris)
        }

        this.currentTetris = tetris;
    }


    getWidth() {
        return this.canvas.width;
    }

    getLeft() {
        return 0;
    }

    getRight() {
        return this.getWidth();
    }

    getBottom() {
        return this.canvas.height;
    }

    draw() {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentTetris.onDraw(this.canvasCtx)
        this.heap.onDraw(this.canvasCtx)
    }
}

export class Drawable {
    constructor() {
    }

    onDraw(canvasCtx) {
        throw new Error("method is not implemented");
    }
}

export class Coordinate {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    toString() {
        return `Coordinate(x: ${this.x}, y: ${this.y})`;
    }
}