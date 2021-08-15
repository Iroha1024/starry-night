import type { Point } from './shape'
import { Shape } from './shape'

export class ShapeContainer {
  private layerMap = new Map<number, Array<Shape>>()
  private cacheFlag = false
  private cacheList: Shape[] = []

  add(shape: Shape) {
    if (this.has(shape)) return
    this.cacheFlag = true
    const { layer } = shape
    if (!this.layerMap.has(layer)) {
      this.layerMap.set(layer, [])
    }
    this.layerMap.get(layer)!.push(shape)
  }

  remove(shape: Shape) {
    if (!this.has(shape)) return false
    this.cacheFlag = true
    const { layer } = shape
    const shapeList = this.layerMap.get(layer)!
    const index = shapeList.indexOf(shape)
    shapeList.splice(index, 1)
    return true
  }

  has(shape: Shape) {
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
      ;[...shapeList].sort((a, b) => Shape.compare(a, b))
      this.cacheList.push(...shapeList)
    })
    this.cacheFlag = false
    return this.cacheList
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

export { Shape } from './shape'
export type { ShapeConfig, Point } from './shape'
export { Rectangle } from './rectangle'
