import { Shape } from '../shape/index'

export class EventPool {
  private list: EventProxy[] = []
  private cacheFlag = false
  private cacheList: EventProxy[]

  add(shape: Shape, proxyConfig?: RegisterEventConfig) {
    this.cacheFlag = true
    this.list.push(new EventProxy(shape, proxyConfig))
  }

  remove(shape: Shape) {
    if (!this.has(shape)) return false
    this.cacheFlag = true
    const index = this.findIndex(shape)
    this.list.splice(index, 1)
    return true
  }

  private findIndex(shape: Shape) {
    return this.list.findIndex((item) => item.shape == shape)
  }

  has(shape: Shape) {
    return this.findIndex(shape) != -1
  }

  toList() {
    if (!this.cacheFlag) return this.cacheList
    this.cacheList = [...this.list].sort((a, b) => Shape.compare(a.shape, b.shape)).reverse()
    this.cacheFlag = false
    return this.cacheList
  }

  emit(event: EmitEventType) {
    this.toList().forEach((proxy) => {
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
