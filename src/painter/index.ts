import type { EventEmitter } from '../eventEmitter'
import type { ShapeContainer } from '../shape'

export class Painter {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private eventEmitter: EventEmitter
  private shapeContainer: ShapeContainer
  private repaintTimer: number | null = null
  private isNeedRepaint = false
  private CANCEL_REPAINT_TIME = 100
  private cancelRepaintTimer: number

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
      if (this.isNeedRepaint) {
        this.repaintTimer = window.requestAnimationFrame(repaint)
      } else {
        window.cancelAnimationFrame(this.repaintTimer as number)
        this.repaintTimer = null
      }
    }
    this.eventEmitter.on('repaint', () => {
      this.isNeedRepaint = true
      clearTimeout(this.cancelRepaintTimer)
      this.cancelRepaintTimer = setTimeout(() => {
        this.isNeedRepaint = false
      }, this.CANCEL_REPAINT_TIME)
      if (this.repaintTimer == null) {
        this.repaintTimer = window.requestAnimationFrame(repaint)
      }
    })
  }
}
