import { ShapeContainer } from './shape/index'
import { EventPool } from './event/index'

interface StageConfig {
  width?: number
  height?: number
}

class Stage {
  canvas: HTMLCanvasElement
  width: number
  height: number
  shapeContainer = new ShapeContainer()
  eventPool = new EventPool()

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.width = canvas.width
    this.height = canvas.height
  }

  paint() {
    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      throw new Error('can not getContext 2d')
    }
    this.shapeContainer.toList().forEach((shape) => shape.paint(ctx))
  }
}

export const createStage = (el: string, config?: StageConfig): Stage => {
  const canvas = document.querySelector(el)
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error(`${el} is not a canvas`)
  }
  if (config) {
    const { width = 300, height = 150 } = config
    canvas.width = width
    canvas.height = height
  }
  return new Stage(canvas)
}


export * from './shape/index'