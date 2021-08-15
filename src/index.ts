import type { Shape } from './shape'
import { ShapeContainer } from './shape'
import type { RegisterEventConfig } from './event'
import { EventPool } from './event'
import type { EmitNameType } from './operation'
import { OperationLayer } from './operation'
import { Painter } from './painter'
import { EventEmitter } from './eventEmitter'

class Stage {
  canvas: HTMLCanvasElement
  width: number
  height: number
  eventEmitter = new EventEmitter()
  shapeContainer = new ShapeContainer()
  eventPool = new EventPool()
  operationLayer = new OperationLayer(this.eventEmitter, this.shapeContainer, this.eventPool)
  painter: Painter

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.width = canvas.width
    this.height = canvas.height
    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      throw new Error('can not getContext 2d')
    }
    this.painter = new Painter(this.eventEmitter, ctx, this.shapeContainer)
    this.initEvent()
  }

  initEvent() {
    const eventNameList: Array<EmitNameType> = ['click', 'mousedown', 'mousemove', 'mouseup']
    eventNameList.forEach((type) => {
      this.canvas.addEventListener(type, (event) => this.operationLayer.receive(event))
    })
  }

  add(shape: Shape, registerEventConfig?: RegisterEventConfig) {
    this.shapeContainer.add(shape)
    this.eventPool.add(shape, registerEventConfig)
  }

  remove(shape: Shape) {
    this.shapeContainer.remove(shape)
    this.eventPool.remove(shape)
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
