import type { ShapeProxy } from '../shape'
import type { EmitEventName } from '../operation'

export class EventPool {
  private map = new Map<ShapeProxy, EventProxy>()

  add(shapeProxy: ShapeProxy, eventProxyConfig?: RegisterEventConfig) {
    if (!eventProxyConfig || Object.keys(eventProxyConfig).length == 0) return
    if (this.map.has(shapeProxy)) return
    const eventProxy = new EventProxy(shapeProxy, eventProxyConfig)
    this.map.set(shapeProxy, eventProxy)
  }

  remove(shapeProxy: ShapeProxy) {
    return this.map.delete(shapeProxy)
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
