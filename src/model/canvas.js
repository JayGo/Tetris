export class CanvasDelegate {
    canvas
    canvasCtx
    drawableList = []

    static instance

    static init(canvas) {
        if (CanvasDelegate.instance === undefined) {
            CanvasDelegate.instance = new CanvasDelegate(canvas);
        }
    }

    static getInstance() {
        return CanvasDelegate.instance;

    }

    constructor(canvas) {
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext("2d");
    }

    registerDrawable(drawable) {
        this.drawableList.push(drawable);
    }

    getWidth() {
        return this.canvas.width;
    }

    draw() {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawableList.forEach(drawable => { drawable.onDraw(this.canvasCtx) })
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