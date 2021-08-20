import type { ShapeConfig, Point } from './shape'
import { Shape } from './shape'

export interface RectangleConfig extends ShapeConfig {}

export class Rectangle extends Shape {
  constructor(config: RectangleConfig) {
    super(config)
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
