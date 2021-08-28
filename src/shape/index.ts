import type { Point } from './shape'
import { Shape } from './shape'
import type { Messenger } from '../messenger'

export class ShapeContainer {
  private layerMap = new Map<number, Array<ShapeProxy>>()
  private cacheFlag = false
  private cacheList: ShapeProxy[] = []
  private messenger: Messenger

  constructor(messenger: Messenger) {
    this.messenger = messenger
  }

  add<S extends Shape>(shape: S) {
    if (this.has(shape)) {
      return this.toList().find((item) => item.origin == shape) as ShapeProxy<S>
    }
    const { layer } = shape
    if (!this.layerMap.has(layer)) {
      this.layerMap.set(layer, [])
    }
    const proxy = this.createShapeProxy(shape)
    this.layerMap.get(layer)!.push(proxy)
    this.cacheFlag = true
    return proxy
  }

  remove(shape: ShapeProxy) {
    if (!this.has(shape.origin)) return false
    const { layer } = shape
    const shapeList = this.layerMap.get(layer)!
    const index = shapeList.indexOf(shape)
    shapeList.splice(index, 1)
    this.cacheFlag = true
    return true
  }

  has(shape: Shape) {
    return this.toList().findIndex((item) => item.origin == shape) != -1
  }

  /**
   * sort: layer Asce
   */
  toList() {
    if (!this.cacheFlag) return this.cacheList
    this.cacheList = []
    const layerList: number[] = []
    for (const layer of this.layerMap.keys()) {
      layerList.push(layer)
    }
    layerList.sort((a, b) => a - b)
    layerList.forEach((layer) => {
      const shapeList = this.layerMap.get(layer)!
      const data = [...shapeList].sort((a, b) => Shape.compare(a.origin, b.origin))
      this.cacheList.push(...data)
    })
    this.cacheFlag = false
    return this.cacheList
  }

  /**
   * sort: layer Dsce
   */
  toReverseList() {
    return [...this.toList()].reverse()
  }

  getTopLayerShape(point: Point) {
    const list = this.toList()
    for (let i = list.length - 1; i >= 0; i--) {
      const shape = list[i]
      if (shape.isInside(point)) {
        return shape
      }
    }
    return null
  }

  createShapeProxy<S extends Shape>(shape: S): ShapeProxy<S> {
    const messenger = this.messenger

    const proxy = new Proxy(shape, {
      get(target, key, receiver) {
        if (key == 'origin') return target
        return Reflect.get(target, key, receiver)
      },
      set(target, key, value, receive) {
        const old = target[key]
        const flag = Reflect.set(target, key, value, receive)
        if (target.getRepaintKeys().includes(key as string) && old != value) {
          messenger.emit('repaint')
        }
        return flag
      },
    }) as any
    return proxy
  }
}

export type ShapeProxy<S extends Shape = Shape> = { [k in keyof S]: S[k] } & {
  readonly origin: Shape
}
export { Shape } from './shape'
export type { ShapeConfig, Point } from './shape'
export { Rectangle } from './rectangle'
export { Group } from './group'
