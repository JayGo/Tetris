export class Canvas {
    constructor(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
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