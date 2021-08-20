import type { Point } from './shape'
import { Shape } from './shape'
import type { EventEmitter } from '../eventEmitter'

export class ShapeContainer {
  private layerMap = new Map<number, Array<ShapeProxy>>()
  private cacheFlag = false
  private cacheList: ShapeProxy[] = []
  private eventEmitter: EventEmitter
  selectedShapeList = new ShapeSelection()

  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter
  }

  add(shape: Shape) {
    if (this.has(shape)) return
    const { layer } = shape
    if (!this.layerMap.has(layer)) {
      this.layerMap.set(layer, [])
    }
    const proxy = createShapeProxy(shape, this.eventEmitter)
    this.layerMap.get(layer)!.push(proxy)
    this.cacheFlag = true
    return proxy
  }

  remove(shape: ShapeProxy) {
    if (!this.has(shape)) return false
    const { layer } = shape
    const shapeList = this.layerMap.get(layer)!
    const index = shapeList.indexOf(shape)
    shapeList.splice(index, 1)
    this.cacheFlag = true
    return true
  }

  has(shape: ShapeProxy) {
    return this.toList().findIndex((item) => item == shape) != -1
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
      ;[...shapeList].sort((a, b) => Shape.compare(a.getShape(), b.getShape()))
      this.cacheList.push(...shapeList)
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
}

const createShapeProxy = (shape: Shape, eventEmitter: EventEmitter): ShapeProxy => {
  const proxy = new Proxy(shape, {
    get(target, key, receiver) {
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receive) {
      const flag = Reflect.set(target, key, value, receive)
      if (target.getRepaintKeys().includes(key as string)) {
        eventEmitter.emit('repaint')
      }
      return flag
    },
  })
  return proxy
}

class ShapeSelection {
  private set = new Set<ShapeProxy>()
  private map = new Map<ShapeProxy, EditShapeProxy>()

  add(shape: ShapeProxy) {
    if (!shape.editable) return
    shape.isSelected = true
    this.set.add(shape)
    this.map.set(shape, new EditShapeProxy(shape))
  }

  remove(shape: ShapeProxy) {
    shape.isSelected = false
    this.map.delete(shape)
    this.set.delete(shape)
  }

  clear() {
    ;[...this.set].forEach((shape) => (shape.isSelected = false))
    this.set.clear()
    this.map.clear()
  }

  get(shape: ShapeProxy) {
    return this.map.get(shape)
  }

  toList() {
    return [...this.set]
  }
}

class EditShapeProxy {
  shape: ShapeProxy

  constructor(shape: ShapeProxy) {
    this.shape = shape
  }

  paintEditStatus(ctx: CanvasRenderingContext2D) {
    const EDIT_POINT_WIDTH = 12
    const HALF = EDIT_POINT_WIDTH / 2
    const LINE_WIDTH = 2
    const COLOR = '#B2CCFF'
    ctx.save()
    ctx.fillStyle = COLOR
    ctx.fillRect(this.shape.x - HALF, this.shape.y - HALF, EDIT_POINT_WIDTH, EDIT_POINT_WIDTH)
    ctx.fillRect(
      this.shape.x - HALF + this.shape.width / 2,
      this.shape.y - HALF,
      EDIT_POINT_WIDTH,
      EDIT_POINT_WIDTH
    )
    ctx.fillRect(
      this.shape.x - HALF + this.shape.width,
      this.shape.y - HALF,
      EDIT_POINT_WIDTH,
      EDIT_POINT_WIDTH
    )
    ctx.fillRect(
      this.shape.x - HALF + this.shape.width,
      this.shape.y - HALF + this.shape.height / 2,
      EDIT_POINT_WIDTH,
      EDIT_POINT_WIDTH
    )
    ctx.fillRect(
      this.shape.x - HALF + this.shape.width,
      this.shape.y - HALF + this.shape.height,
      EDIT_POINT_WIDTH,
      EDIT_POINT_WIDTH
    )
    ctx.fillRect(
      this.shape.x - HALF,
      this.shape.y - HALF + this.shape.height,
      EDIT_POINT_WIDTH,
      EDIT_POINT_WIDTH
    )
    ctx.fillRect(
      this.shape.x - HALF + this.shape.width / 2,
      this.shape.y - HALF + this.shape.height,
      EDIT_POINT_WIDTH,
      EDIT_POINT_WIDTH
    )
    ctx.fillRect(
      this.shape.x - HALF,
      this.shape.y - HALF + this.shape.height / 2,
      EDIT_POINT_WIDTH,
      EDIT_POINT_WIDTH
    )
    ctx.beginPath()
    ctx.moveTo(this.shape.x, this.shape.y)
    ctx.lineTo(this.shape.x + this.shape.width, this.shape.y)
    ctx.lineTo(this.shape.x + this.shape.width, this.shape.y + this.shape.height)
    ctx.lineTo(this.shape.x, this.shape.y + this.shape.height)
    ctx.closePath()
    ctx.strokeStyle = COLOR
    ctx.lineWidth = LINE_WIDTH
    ctx.stroke()
    ctx.restore()
  }
}

export type ShapeProxy<S extends Shape = Shape> = { [k in keyof S]: S[k] }
export { Shape } from './shape'
export type { ShapeConfig, Point } from './shape'
export { Rectangle } from './rectangle'
