import { nanoid } from 'nanoid'

type PaintStyle = string | CanvasGradient | CanvasPattern

export interface ShapeConfig {
  layer?: number
  order?: number
  fillStyle?: PaintStyle
  strokeStyle?: PaintStyle
}

export class Shape {
  readonly id = nanoid()
  layer: number
  order: number
  fillStyle: PaintStyle
  strokeStyle: PaintStyle

  constructor(config: ShapeConfig) {
    const { layer, order, fillStyle, strokeStyle } = config
    this.layer = layer ?? 0
    this.order = order ?? 0
    this.fillStyle = fillStyle ?? ''
    this.strokeStyle = strokeStyle ?? ''
  }

  paint(ctx: CanvasRenderingContext2D) {}

  rawPaint(ctx: CanvasRenderingContext2D, process: () => void) {
    ctx.beginPath()
    process()
    ctx.closePath()
    if (this.fillStyle) {
      ctx.fillStyle = this.fillStyle
      ctx.fill()
    }
    this.strokeStyle && (ctx.strokeStyle = this.strokeStyle)
    ctx.stroke()
  }

  static compare(a: Shape, b: Shape) {
    return a.layer != b.layer ? a.layer - b.layer : a.order - b.order
  }
}
