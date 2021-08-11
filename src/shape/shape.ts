export interface Shape extends CommonConfig {
  paint: (ctx: CanvasRenderingContext2D) => void
}

interface CommonConfig {
  layer: number
  order: number
}

export const initShapeConfig = <T extends Partial<CommonConfig>>(config: T) => {
  const { layer = 0, order = 0 } = config
  return {
    ...config,
    layer,
    order,
  }
}

export interface CanvasStyleConfig {
  fillStyle?: string | CanvasGradient | CanvasPattern
  strokeStyle?: string | CanvasGradient | CanvasPattern
}

export const paint = (ctx: CanvasRenderingContext2D, style: CanvasStyleConfig) => {
  const { fillStyle, strokeStyle } = style
  fillStyle && (ctx.fillStyle = fillStyle) && ctx.fill()
  strokeStyle && (ctx.strokeStyle = strokeStyle)
  ctx.stroke()
}

export type ShapeConfig = Partial<CommonConfig> & CanvasStyleConfig