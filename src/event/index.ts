import type { ShapeProxy } from '../shape'
import { Shape } from '../shape'
import type { DomEvent, DomEventName } from '../operation'

export class EventPool {
  private list: EventProxy[] = []
  private cacheFlag = false
  private cacheList: EventProxy[] = []

  add(shapeProxy: ShapeProxy, eventProxyConfig?: RegisterEventConfig) {
    if (!eventProxyConfig || Object.keys(eventProxyConfig).length == 0) return
    if (this.has(shapeProxy)) return
    this.list.push(new EventProxy(shapeProxy, eventProxyConfig))
    this.cacheFlag = true
  }

  remove(shapeProxy: ShapeProxy) {
    if (!this.has(shapeProxy)) return false
    const index = this.findIndex(shapeProxy)
    this.list.splice(index, 1)
    this.cacheFlag = true
    return true
  }

  private findIndex(shapeProxy: ShapeProxy) {
    return this.toList().findIndex((item) => item.shapeProxy == shapeProxy)
  }

  has(shapeProxy: ShapeProxy) {
    return this.findIndex(shapeProxy) != -1
  }

  /**
   * sort: layer Dsce
   */
  toList() {
    if (!this.cacheFlag) return this.cacheList
    this.cacheList = [...this.list]
      .sort((a, b) => Shape.compare(a.shapeProxy.getShape(), b.shapeProxy.getShape()))
      .reverse()
    this.cacheFlag = false
    return this.cacheList
  }

  receive(event: DomEvent) {
    this.toList().forEach((eventProxy) => {
      if (event instanceof MouseEvent) {
        const { offsetX: x, offsetY: y } = event
        if (
          eventProxy.hasEvent(event.type) &&
          eventProxy.shapeProxy.isInside({
            x,
            y,
          })
        ) {
          eventProxy.handle(event)
        }
      } else if (event instanceof KeyboardEvent) {
        if (eventProxy.hasEvent(event.type)) {
          eventProxy.handle(event)
        }
      }
    })
  }
}

class EventProxy {
  shapeProxy: ShapeProxy
  eventMap = new Map<string, Array<EventHandler>>()

  constructor(shapeProxy: ShapeProxy, config: RegisterEventConfig) {
    this.shapeProxy = shapeProxy
    Object.entries(config).forEach(([key, value]) => {
      this.add(key as DomEventName, value)
    })
  }

  add(name: DomEventName, eventHandler: EventHandler) {
    if (!this.hasEvent(name)) {
      this.eventMap.set(name, [])
    }
    this.eventMap.get(name)!.push(eventHandler)
  }

  hasEvent(name: string) {
    return this.eventMap.has(name)
  }

  handle(event: DomEvent) {
    const { type } = event
    const eventQueue = this.eventMap.get(type)
    eventQueue!.forEach((handler) => handler(this.shapeProxy))
  }
}

export type RegisterEventConfig = {
  [N in DomEventName]?: EventHandler
}

type EventHandler = (shapeProxy: ShapeProxy) => void
