import { nanoid } from 'nanoid'

type PaintStyle = string | CanvasGradient | CanvasPattern

export interface ShapeConfig {
  layer?: number
  order?: number
  fillStyle?: PaintStyle
  strokeStyle?: PaintStyle
  lineWidth?: number
}

export class Shape {
  readonly id = nanoid()
  layer: number
  order: number
  fillStyle: PaintStyle
  strokeStyle: PaintStyle
  lineWidth: number
  isSelected = false

  constructor(config: ShapeConfig) {
    const { layer, order, fillStyle, strokeStyle, lineWidth } = config
    this.layer = layer ?? 0
    this.order = order ?? 0
    this.fillStyle = fillStyle ?? ''
    this.strokeStyle = strokeStyle ?? ''
    this.lineWidth = lineWidth ?? 2
  }

  paint(ctx: CanvasRenderingContext2D) {}

  paintSelection(ctx: CanvasRenderingContext2D) {
    if (this.isSelected) {
      ctx.setLineDash([10, 5])
    } else {
      ctx.setLineDash([])
    }
  }

  private setDefaultPaintStyle(ctx: CanvasRenderingContext2D) {
    if (this.fillStyle) {
      ctx.fillStyle = this.fillStyle
      ctx.fill()
    }
    ctx.strokeStyle = this.strokeStyle
    ctx.lineWidth = this.lineWidth
  }

  rawPaint(ctx: CanvasRenderingContext2D, process: () => void) {
    ctx.save()
    ctx.beginPath()
    process()
    ctx.closePath()
    ctx.clip()
    this.setDefaultPaintStyle(ctx)
    this.paintSelection(ctx)
    ctx.lineWidth *= 2
    ctx.stroke()
    ctx.restore()
  }

  static compare(a: Shape, b: Shape) {
    return a.layer != b.layer ? a.layer - b.layer : a.order - b.order
  }

  isInside(point: Point) {
    return false
  }
}

export interface Point {
  x: number
  y: number
}
