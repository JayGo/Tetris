import { Drawable } from './canvas.js';

export class Heap extends Drawable {
  boxes = [];

  static instance;

  constructor() {
    super()
  }

  static getInstance() {
    if (Heap.instance === undefined) {
      Heap.instance = new Heap();
    }

    return Heap.instance;
  }

  recycleTetris(tetris) {
    tetris.boxes.forEach((box) => {
      this.boxes.push(box);
    });
  }

  onDraw(canvasCtx) {
    this.boxes.forEach(box => {
      box.draw(canvasCtx);
    });
  }

}