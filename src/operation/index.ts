import type { ShapeContainer, ShapeProxy } from '../shape'
import type { EventPool } from '../event'
import type { EventEmitter } from '../eventEmitter'

export class OperationLayer {
  private shapeContainer: ShapeContainer
  private eventPool: EventPool
  private eventEmitter: EventEmitter
  private canvas: HTMLCanvasElement
  private isMouseDown = false
  private caughtShape: ShapeProxy | null

  constructor(
    eventEmitter: EventEmitter,
    shapeContainer: ShapeContainer,
    eventPool: EventPool,
    canvas: HTMLCanvasElement
  ) {
    this.eventEmitter = eventEmitter
    this.shapeContainer = shapeContainer
    this.eventPool = eventPool
    this.canvas = canvas
    this.initEvent()
  }

  initEvent() {
    const eventNameList: Array<DomEventName> = ['click', 'mousedown', 'mousemove', 'mouseup']
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
    const shape = this.shapeContainer.getTopLayerShape({
      x,
      y,
    })
    if (shape) {
      this.caughtShape = this.caughtShape ?? shape
      if (this.caughtShape.isSelected) {
        this.moveShape(this.caughtShape, event)
        return
      }
    }
    this.moveCanvas(event)
  }

  moveShape(shape: ShapeProxy, event: MouseEvent) {
    this.eventEmitter.emit('moveShape', shape, event)
  }

  moveCanvas(event: MouseEvent) {
    this.eventEmitter.emit('moveCanvas', event)
  }

  transfer(event: DomEvent) {
    this.eventPool.receive(event)
  }
}

type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T]

export type DomEvent = MouseEvent | KeyboardEvent

type MouseEventName = KeysMatching<HTMLElementEventMap, MouseEvent>

export type DomEventName = KeysMatching<HTMLElementEventMap, DomEvent>
