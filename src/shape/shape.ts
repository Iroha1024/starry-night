import { nanoid } from 'nanoid'

type FillStyle = CanvasFillStrokeStyles['fillStyle']
type StrokeStyle = CanvasFillStrokeStyles['strokeStyle']

export interface ShapeConfig {
  x: number
  y: number
  layer?: number
  order?: number
  fillStyle?: FillStyle
  strokeStyle?: StrokeStyle
  lineWidth?: number
}

export class Shape {
  readonly id = nanoid()
  x: number
  y: number
  layer: number
  order: number
  isFill = false
  fillStyle: FillStyle
  isStroke = false
  strokeStyle: StrokeStyle
  lineWidth: number
  isSelected = false

  constructor(config: ShapeConfig) {
    const { x, y, layer, order, fillStyle, strokeStyle, lineWidth } = config
    this.x = x
    this.y = y
    this.layer = layer ?? 0
    this.order = order ?? 0
    fillStyle != undefined && (this.isFill = true)
    this.fillStyle = fillStyle ?? ''
    strokeStyle != undefined && (this.isStroke = true)
    this.strokeStyle = strokeStyle ?? ''
    this.lineWidth = lineWidth ?? 2
  }

  setX(x: number) {
    this.x = x
  }

  getX() {
    return this.x
  }

  paint(ctx: CanvasRenderingContext2D) {}

  protected selectShape(ctx: CanvasRenderingContext2D) {
    ctx.setLineDash([10, 5])
  }

  rawPaint(ctx: CanvasRenderingContext2D, process: () => void) {
    ctx.save()
    ctx.beginPath()
    process()
    ctx.closePath()
    ctx.clip()
    if (this.isFill) {
      ctx.fillStyle = this.fillStyle
      ctx.fill()
    }
    if (this.isSelected) {
      this.selectShape(ctx)
    }
    ctx.lineWidth = this.lineWidth
    if (this.isStroke) {
      ctx.strokeStyle = this.strokeStyle
      ctx.lineWidth *= 2
      ctx.stroke()
    }
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
