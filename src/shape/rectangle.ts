import type { ShapeConfig } from './shape'
import { Shape } from './shape'

interface RectangleConfig extends ShapeConfig {
  x: number
  y: number
  w: number
  h: number
}

export class Rectangle extends Shape {
  x: number
  y: number
  width: number
  height: number

  constructor(config: RectangleConfig) {
    const { x, y, w, h, layer, order, strokeStyle, fillStyle } = config
    super({
      layer,
      order,
      strokeStyle,
      fillStyle,
    })
    this.x = x
    this.y = y
    this.width = w
    this.height = h
  }

  paint(ctx: CanvasRenderingContext2D) {
    super.rawPaint(ctx, () => {
      ctx.rect(this.x, this.y, this.width, this.height)
    })
  }
}
