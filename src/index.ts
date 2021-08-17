import type { Shape, ShapeProxy } from './shape'
import { ShapeContainer } from './shape'
import type { RegisterEventConfig } from './event'
import { EventPool } from './event'
import { OperationLayer } from './operation'
import { Painter } from './painter'
import { EventEmitter } from './eventEmitter'

class Stage {
  canvas: HTMLCanvasElement
  width: number
  height: number
  eventEmitter = new EventEmitter()
  shapeContainer = new ShapeContainer(this.eventEmitter)
  eventPool = new EventPool()
  operationLayer: OperationLayer
  painter: Painter

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.width = canvas.width
    this.height = canvas.height
    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      throw new Error('can not getContext 2d')
    }
    this.operationLayer = new OperationLayer(
      this.eventEmitter,
      this.shapeContainer,
      this.eventPool,
      this.canvas
    )
    this.painter = new Painter(this.eventEmitter, ctx, this.shapeContainer)
  }

  add(shape: Shape, registerEventConfig?: RegisterEventConfig) {
    const proxy = this.shapeContainer.add(shape)
    proxy && this.eventPool.add(proxy, registerEventConfig)
    return proxy
  }

  remove(shape: ShapeProxy) {
    this.shapeContainer.remove(shape)
    this.eventPool.remove(shape)
    this.eventEmitter.emit('repaint')
  }

  paint() {
    this.painter.paint()
  }
}

interface StageConfig {
  width?: number
  height?: number
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
