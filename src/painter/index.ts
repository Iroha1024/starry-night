import type { EventEmitter } from '../eventEmitter'
import type { ShapeContainer } from '../shape'

export class Painter {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private eventEmitter: EventEmitter
  private shapeContainer: ShapeContainer

  constructor(
    eventEmitter: EventEmitter,
    ctx: CanvasRenderingContext2D,
    shapeContainer: ShapeContainer
  ) {
    this.eventEmitter = eventEmitter
    this.ctx = ctx
    this.canvas = ctx.canvas
    this.shapeContainer = shapeContainer

    this.handle()
  }

  paint() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.shapeContainer.toList().forEach((shape) => shape.paint(this.ctx))
  }

  handle() {
    const repaint = () => {
      this.paint()
    }
    this.eventEmitter.on('repaint', repaint)
  }
}
