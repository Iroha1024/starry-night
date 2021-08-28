import type { Messenger } from '../messenger'
import type { ShapeContainer, ShapeProxy, Group } from '../shape'
import type { OperationLayer } from '../operation'

export class Painter {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private messenger: Messenger
  private shapeContainer: ShapeContainer
  private operationLayer: OperationLayer
  private repaintTimer: number | null = null
  private isNeedRepaint = false
  private CANCEL_REPAINT_TIME = 100
  private cancelRepaintTimer: number
  private eidtShapeProxy: EditShapeProxy

  constructor(
    messenger: Messenger,
    shapeContainer: ShapeContainer,
    operationLayer: OperationLayer,
    ctx: CanvasRenderingContext2D
  ) {
    this.messenger = messenger
    this.shapeContainer = shapeContainer
    this.operationLayer = operationLayer
    this.ctx = ctx
    this.canvas = ctx.canvas
    this.eidtShapeProxy = new EditShapeProxy(this.operationLayer.getSelectedShape())
    this.handle()
  }

  paint() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.shapeContainer.toList().forEach((shape) => shape.paint(this.ctx))
    this.eidtShapeProxy.paintEditStatus(this.ctx)
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
    this.messenger.on('repaint', () => {
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

class EditShapeProxy {
  shape: ShapeProxy<Group>

  constructor(shape: ShapeProxy<Group>) {
    this.shape = shape
  }

  paintEditStatus(ctx: CanvasRenderingContext2D) {
    this.shape.calculateBoundingBox()
    if (this.shape.width == 0 || this.shape.height == 0) return
    const EDIT_POINT_WIDTH = 12
    const HALF = EDIT_POINT_WIDTH / 2
    const LINE_WIDTH = 2
    const COLOR = '#B2CCFF'
    ctx.save()
    ctx.fillStyle = COLOR
    ctx.fillRect(this.shape.x - HALF, this.shape.y - HALF, EDIT_POINT_WIDTH, EDIT_POINT_WIDTH)
    ctx.fillRect(
      this.shape.x - HALF + this.shape.width / 2,
      this.shape.y - HALF,
      EDIT_POINT_WIDTH,
      EDIT_POINT_WIDTH
    )
    ctx.fillRect(
      this.shape.x - HALF + this.shape.width,
      this.shape.y - HALF,
      EDIT_POINT_WIDTH,
      EDIT_POINT_WIDTH
    )
    ctx.fillRect(
      this.shape.x - HALF + this.shape.width,
      this.shape.y - HALF + this.shape.height / 2,
      EDIT_POINT_WIDTH,
      EDIT_POINT_WIDTH
    )
    ctx.fillRect(
      this.shape.x - HALF + this.shape.width,
      this.shape.y - HALF + this.shape.height,
      EDIT_POINT_WIDTH,
      EDIT_POINT_WIDTH
    )
    ctx.fillRect(
      this.shape.x - HALF,
      this.shape.y - HALF + this.shape.height,
      EDIT_POINT_WIDTH,
      EDIT_POINT_WIDTH
    )
    ctx.fillRect(
      this.shape.x - HALF + this.shape.width / 2,
      this.shape.y - HALF + this.shape.height,
      EDIT_POINT_WIDTH,
      EDIT_POINT_WIDTH
    )
    ctx.fillRect(
      this.shape.x - HALF,
      this.shape.y - HALF + this.shape.height / 2,
      EDIT_POINT_WIDTH,
      EDIT_POINT_WIDTH
    )
    ctx.beginPath()
    ctx.moveTo(this.shape.x, this.shape.y)
    ctx.lineTo(this.shape.x + this.shape.width, this.shape.y)
    ctx.lineTo(this.shape.x + this.shape.width, this.shape.y + this.shape.height)
    ctx.lineTo(this.shape.x, this.shape.y + this.shape.height)
    ctx.closePath()
    ctx.strokeStyle = COLOR
    ctx.lineWidth = LINE_WIDTH
    ctx.stroke()
    ctx.restore()
  }
}
