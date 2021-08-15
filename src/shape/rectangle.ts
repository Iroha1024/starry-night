import type { ShapeConfig, Point } from './shape'
import { Shape } from './shape'

interface RectangleConfig extends ShapeConfig {
  w: number
  h: number
}

export class Rectangle extends Shape {
  width: number
  height: number

  constructor(config: RectangleConfig) {
    const { x, y, w, h, layer, order, strokeStyle, fillStyle, lineWidth } = config
    super({
      x,
      y,
      layer,
      order,
      strokeStyle,
      fillStyle,
      lineWidth,
    })
    this.width = w
    this.height = h
  }

  override paint(ctx: CanvasRenderingContext2D) {
    this.rawPaint(ctx, () => {
      ctx.rect(this.x, this.y, this.width, this.height)
    })
  }

  override isInside(point: Point) {
    const { x, y } = point
    const x1 = this.x,
      x2 = this.x + this.width,
      y1 = this.y,
      y2 = this.y + this.height
    return x > x1 && x < x2 && y > y1 && y < y2
  }
}
