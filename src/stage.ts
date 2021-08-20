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
  draggable: boolean

  eventEmitter = new EventEmitter()
  shapeContainer = new ShapeContainer(this.eventEmitter)
  eventPool = new EventPool()
  operationLayer: OperationLayer
  painter: Painter

  constructor(canvas: HTMLCanvasElement, config: StageProperty) {
    this.canvas = canvas
    const { width, height, draggable } = config
    this.width = width
    this.height = height
    this.draggable = draggable

    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      throw new Error('can not getContext 2d')
    }
    this.operationLayer = new OperationLayer(
      this.eventEmitter,
      this.shapeContainer,
      this.eventPool,
      this.getProperty.bind(this),
      ctx
    )
    this.painter = new Painter(this.eventEmitter, ctx, this.shapeContainer)
  }

  add(shape: Shape, registerEventConfig?: RegisterEventConfig) {
    const proxy = this.shapeContainer.add(shape)
    proxy && this.eventPool.add(proxy, registerEventConfig)
    this.eventEmitter.emit('repaint')
    return proxy
  }

  remove(shape: ShapeProxy) {
    this.shapeContainer.remove(shape)
    this.shapeContainer.selectedShapeList.remove(shape)
    this.eventPool.remove(shape)
    this.eventEmitter.emit('repaint')
  }

  getProperty() {
    return {
      width: this.width,
      height: this.height,
      draggable: this.draggable,
    }
  }
}

export type GetStageProperty = () => Readonly<StageProperty>

interface StageProperty {
  width: number
  height: number
  draggable: boolean
}

export const createStage = (el: string, config?: Partial<StageProperty>): Stage => {
  const canvas = document.querySelector(el)
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error(`${el} is not a canvas`)
  }
  if (config == undefined) {
    config = {}
  }
  const { width = 300, height = 150, draggable = false } = config
  canvas.width = width
  canvas.height = height
  return new Stage(canvas, {
    width,
    height,
    draggable,
  })
}
