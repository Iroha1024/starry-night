import { Shape } from '../shape/index'

export class EventPool {
  list: EventProxy[] = []

  add(shape: Shape, proxyConfig?: RegisterEventConfig) {
    for (let i = -1, j; i < this.list.length; i++) {
      j = i + 1
      let next = this.list[j]
      if (!next) {
        this.list[j] = new EventProxy(shape, proxyConfig)
        break
      } else if (Shape.compare(shape, next.shape) >= 0) {
        this.list.splice(j, 0, new EventProxy(shape, proxyConfig))
        break
      }
    }
  }

  emit(event: EmitEventType) {
    this.list.forEach((proxy) => {
      if (event instanceof MouseEvent) {
        const { offsetX: x, offsetY: y } = event
        if (
          proxy.shape.isInside({
            x,
            y,
          }) &&
          proxy.hasEvent(event.type)
        ) {
          proxy.handle(event)
        }
      } else if (event instanceof KeyboardEvent) {
        if (proxy.hasEvent(event.type)) {
          proxy.handle(event)
        }
      }
    })
  }
}

class EventProxy {
  shape: Shape
  eventMap = new Map<string, Array<EventHandler>>()

  constructor(shape: Shape, config?: RegisterEventConfig) {
    this.shape = shape
    if (config) {
      Object.entries(config).forEach(([key, value]) => {
        this.add(key as EmitNameType, value)
      })
    }
  }

  add(name: EmitNameType, eventHandler: EventHandler) {
    if (!this.hasEvent(name)) {
      this.eventMap.set(name, [])
    }
    this.eventMap.get(name)!.push(eventHandler)
  }

  hasEvent(name: string) {
    return this.eventMap.has(name)
  }

  handle(event: EmitEventType) {
    const { type } = event
    const eventQueue = this.eventMap.get(type)
    eventQueue!.forEach((handler) => handler(this.shape))
  }
}

type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T]

type EmitEventType = MouseEvent | KeyboardEvent

export type EmitNameType = KeysMatching<HTMLElementEventMap, EmitEventType>

type RegisterEventConfig = {
  [N in EmitNameType]?: EventHandler
}

type EventHandler = (shape: Shape) => void
