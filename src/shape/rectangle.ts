import type { Shape, ShapeConfig, CanvasStyleConfig } from './shape'
import { initShapeConfig, paint } from './shape'

interface RectangleConfig extends ShapeConfig {
  x: number
  y: number
  w: number
  h: number
}

export class Rectangle implements Shape {
  layer: number
  order: number

  x: number
  y: number
  width: number
  height: number
  paintStyle: CanvasStyleConfig

  constructor(config: RectangleConfig) {
    const { x, y, w, h, layer, order, strokeStyle, fillStyle } = initShapeConfig(config)
    this.x = x
    this.y = y
    this.width = w
    this.height = h
    this.layer = layer
    this.order = order
    this.paintStyle = {
      strokeStyle,
      fillStyle,
    }
  }

  paint(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.rect(this.x, this.y, this.width, this.height)
    paint(ctx, this.paintStyle)
  }
}
