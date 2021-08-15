import { Shape, ShapeContainer } from './shape/index'
import { EventPool } from './event/index'
import type { EmitNameType, RegisterEventConfig } from './event/index'
import { eventEmitter } from './eventEmitter'

interface StageConfig {
  width?: number
  height?: number
}

class Stage {
  canvas: HTMLCanvasElement
  width: number
  height: number
  ctx: CanvasRenderingContext2D
  shapeContainer = new ShapeContainer()
  eventPool = new EventPool(this.shapeContainer)

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.width = canvas.width
    this.height = canvas.height
    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      throw new Error('can not getContext 2d')
    }
    this.ctx = ctx
    this.initEvent()
  }

  paint() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.shapeContainer.toList().forEach((shape) => shape.paint(this.ctx))
  }

  initEvent() {
    const eventNameList: Array<EmitNameType> = ['click', 'mousedown', 'mousemove', 'mouseup']
    eventNameList.forEach((type) => {
      this.canvas.addEventListener(type, (event) => this.eventPool.emit(event))
    })
    eventEmitter.on('selectShape', () => {
      this.paint()
    })
  }

  add(shape: Shape, registerEventConfig?: RegisterEventConfig) {
    this.shapeContainer.add(shape)
    this.eventPool.add(shape, registerEventConfig)
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
