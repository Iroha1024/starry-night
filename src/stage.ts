import type { Shape, ShapeProxy } from './shape'
import { ShapeContainer } from './shape'
import type { RegisterEventConfig } from './event'
import { EventPool } from './event'
import { OperationLayer } from './operation'
import { Painter } from './painter'
import { Messenger } from './messenger'

class Stage {
  canvas: HTMLCanvasElement
  width: number
  height: number
  draggable: boolean

  messenger = new Messenger()
  shapeContainer = new ShapeContainer(this.messenger)
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
      this.messenger,
      this.shapeContainer,
      this.eventPool,
      this.getProperty.bind(this),
      ctx
    )
    this.painter = new Painter(this.messenger, this.shapeContainer, this.operationLayer, ctx)
  }

  add<S extends Shape>(shape: S, registerEventConfig?: RegisterEventConfig) {
    const proxy = this.shapeContainer.add(shape)
    proxy && this.eventPool.add(proxy, registerEventConfig)
    this.messenger.emit('repaint')
    return proxy
  }

  remove(shape: ShapeProxy) {
    this.shapeContainer.remove(shape)
    this.operationLayer.removeSelectShapeChild(shape)
    this.eventPool.remove(shape)
    this.messenger.emit('repaint')
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
