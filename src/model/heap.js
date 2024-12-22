import { Drawable } from './canvas.js';

export class Heap extends Drawable {
  boxes = []



  static instance

  constructor() {
    super()
  }

  static getInstance() {
    if (Heap.instance === undefined) {
      Heap.instance = new Heap()
    }

    return Heap.instance
  }

  pushBoxes(boxes) {
    this.boxes.push(boxes)
  }

  onDraw(canvasCtx) {
    this.boxes.forEach(box => {box.draw(canvasCtx)})
  }

}