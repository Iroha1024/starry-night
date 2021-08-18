import type { ShapeContainer, ShapeProxy } from '../shape'
import type { EventPool } from '../event'
import type { EventEmitter } from '../eventEmitter'
import type { Stage } from '../stage'

export class OperationLayer {
  private stage: Stage
  private shapeContainer: ShapeContainer
  private eventPool: EventPool
  private eventEmitter: EventEmitter
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private isMouseDown = false
  private caughtShape: ShapeProxy | null = null

  constructor(stage: Stage, ctx: CanvasRenderingContext2D) {
    this.stage = stage
    this.eventEmitter = stage.eventEmitter
    this.shapeContainer = stage.shapeContainer
    this.eventPool = stage.eventPool
    this.ctx = ctx
    this.canvas = ctx.canvas
    this.initEvent()
  }

  initEvent() {
    const eventNameList: Array<DomEventName> = [
      'click',
      'mousedown',
      'mousemove',
      'mouseup',
      'mouseenter',
      'mouseleave',
    ]
    eventNameList.forEach((type) => {
      this.canvas.addEventListener(type, (event) => this.receive(event))
    })
  }

  receive(event: DomEvent) {
    this.handle(event)
    this.transfer(event)
  }

  handle(event: DomEvent) {
    if (event instanceof MouseEvent) {
      const key = event.type as MouseEventName

      switch (key) {
        case 'click':
          this.click(event)
          break
        case 'mousedown':
          this.isMouseDown = true
          break
        case 'mousemove':
          this.isMouseDown && this.mousemove(event)
          break
        case 'mouseup':
          this.isMouseDown = false
          this.caughtShape = null
          break
        case 'mouseenter':
          this.enterCanvas()
          break
        case 'mouseleave':
          this.leaveCanvas()
          break
      }
    }
  }

  click(event: MouseEvent) {
    const { offsetX: x, offsetY: y } = event
    const shape = this.shapeContainer.getTopLayerShape({
      x,
      y,
    })
    if (shape) {
      this.clickShape(shape)
    } else {
      this.clickCanvas()
    }
  }

  clickShape(shape: ShapeProxy) {
    this.eventEmitter.emit('clickShape', shape)
  }

  clickCanvas() {
    this.eventEmitter.emit('clickCanvas')
  }

  mousemove(event: MouseEvent) {
    const { offsetX: x, offsetY: y } = event
    if (this.caughtShape == null) {
      this.caughtShape = this.shapeContainer.getTopLayerShape({
        x,
        y,
      })
    }
    if (this.caughtShape) {
      this.moveShape(this.caughtShape, event)
    } else {
      this.moveCanvas(event)
    }
  }

  moveShape(shape: ShapeProxy, event: MouseEvent) {
    if (shape.draggable) {
      const { movementX, movementY } = event
      shape.x += movementX
      shape.y += movementY
      this.eventEmitter.emit('moveShape', shape)
    }
  }

  moveCanvas(event: MouseEvent) {
    if (this.stage.draggable) {
      const { movementX, movementY } = event
      this.shapeContainer.toList().forEach((shape) => {
        shape.x += movementX
        shape.y += movementY
      })
      this.eventEmitter.emit('repaint')
      this.eventEmitter.emit('moveCanvas')
    }
  }

  enterCanvas() {
    this.eventEmitter.emit('enterCanvas')
  }

  leaveCanvas() {
    this.isMouseDown = false
    this.eventEmitter.emit('leaveCanvas')
  }

  transfer(event: DomEvent) {
    this.eventPool.receive(event)
  }
}

type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T]

export type DomEvent = MouseEvent | KeyboardEvent

type MouseEventName = KeysMatching<HTMLElementEventMap, MouseEvent>

export type DomEventName = KeysMatching<HTMLElementEventMap, DomEvent>
