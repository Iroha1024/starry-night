import type { ShapeProxy } from '../shape'
import { Shape } from '../shape'
import type { EmitEventName } from '../operation'

export class EventPool {
  private list: EventProxy[] = []
  private cacheFlag = false
  private cacheList: EventProxy[] = []
  private map = new Map<ShapeProxy, EventProxy>()

  add(shapeProxy: ShapeProxy, eventProxyConfig?: RegisterEventConfig) {
    if (!eventProxyConfig || Object.keys(eventProxyConfig).length == 0) return
    if (this.has(shapeProxy)) return
    const eventProxy = new EventProxy(shapeProxy, eventProxyConfig)
    this.map.set(shapeProxy, eventProxy)
    this.list.push(eventProxy)
    this.cacheFlag = true
  }

  remove(shapeProxy: ShapeProxy) {
    if (!this.has(shapeProxy)) return false
    const index = this.findIndex(shapeProxy)
    this.list.splice(index, 1)
    this.map.delete(shapeProxy)
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
      .sort((a, b) => Shape.compare(a.shapeProxy.origin, b.shapeProxy.origin))
      .reverse()
    this.cacheFlag = false
    return this.cacheList
  }

  receive(event: EmitEventName, shape: ShapeProxy) {
    const eventProxy = this.map.get(shape)
    eventProxy?.handle(event)
  }
}

class EventProxy {
  shapeProxy: ShapeProxy
  eventMap = new Map<EmitEventName, Array<EventHandler>>()

  constructor(shapeProxy: ShapeProxy, config: RegisterEventConfig) {
    this.shapeProxy = shapeProxy
    Object.entries(config).forEach(([key, value]) => {
      this.add(key as EmitEventName, value)
    })
  }

  add(name: EmitEventName, eventHandler: EventHandler) {
    if (!this.hasEvent(name)) {
      this.eventMap.set(name, [])
    }
    this.eventMap.get(name)!.push(eventHandler)
  }

  hasEvent(name: EmitEventName) {
    return this.eventMap.has(name)
  }

  handle(name: EmitEventName) {
    const eventQueue = this.eventMap.get(name)
    eventQueue?.forEach((handler) => handler.call(this.shapeProxy))
  }
}

export type RegisterEventConfig = {
  [N in EmitEventName]?: EventHandler
}

type EventHandler = (this: ShapeProxy) => void
