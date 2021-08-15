import type { ShapeContainer } from '../shape'
import type { EventPool } from '../event'
import type { EventEmitter } from '../eventEmitter'

export class OperationLayer {
  private shapeContainer: ShapeContainer
  private eventPool: EventPool
  private eventEmitter: EventEmitter

  constructor(eventEmitter: EventEmitter, shapeContainer: ShapeContainer, eventPool: EventPool) {
    this.eventEmitter = eventEmitter
    this.shapeContainer = shapeContainer
    this.eventPool = eventPool
  }

  receive(event: EmitEventType) {
    this.handle(event)
    this.transfer(event)
  }

  handle(event: EmitEventType) {
    if (event instanceof MouseEvent) {
      this.selectShape(event)
    }
  }

  selectShape(event: MouseEvent) {
    if (event.type == 'click') {
      const { offsetX: x, offsetY: y } = event
      const shape = this.shapeContainer.getTopLayerShape({
        x,
        y,
      })
      this.eventEmitter.emit('selectShape', shape)
    }
  }

  transfer(event: EmitEventType) {
    this.eventPool.receive(event)
  }
}

type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T]

export type EmitEventType = MouseEvent | KeyboardEvent

export type EmitNameType = KeysMatching<HTMLElementEventMap, EmitEventType>
