import { Shape } from '../shape'
import type { EmitEventType, EmitNameType } from '../operation'

export class EventPool {
  private list: EventProxy[] = []
  private cacheFlag = false
  private cacheList: EventProxy[] = []

  add(shape: Shape, proxyConfig?: RegisterEventConfig) {
    if (!proxyConfig || Object.keys(proxyConfig).length == 0) return
    if (this.has(shape)) return
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
    return this.toList().findIndex((item) => item.shape == shape)
  }

  has(shape: Shape) {
    return this.findIndex(shape) != -1
  }

  /**
   * sort: layer Dsce
   */
  toList() {
    if (!this.cacheFlag) return this.cacheList
    this.cacheList = [...this.list].sort((a, b) => Shape.compare(a.shape, b.shape)).reverse()
    this.cacheFlag = false
    return this.cacheList
  }

  receive(event: EmitEventType) {
    this.toList().forEach((proxy) => {
      if (event instanceof MouseEvent) {
        const { offsetX: x, offsetY: y } = event
        if (
          proxy.hasEvent(event.type) &&
          proxy.shape.isInside({
            x,
            y,
          })
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

  constructor(shape: Shape, config: RegisterEventConfig) {
    this.shape = shape
    Object.entries(config).forEach(([key, value]) => {
      this.add(key as EmitNameType, value)
    })
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

export type RegisterEventConfig = {
  [N in EmitNameType]?: EventHandler
}

type EventHandler = (shape: Shape) => void
