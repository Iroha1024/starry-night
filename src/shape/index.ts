import { Shape } from './shape'

export class ShapeContainer {
  private layerMap = new Map<number, Array<Shape>>()
  private cacheFlag = false
  private cacheList: Shape[]

  add(shape: Shape) {
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
    return this.cacheList.findIndex((item) => item == shape) != -1
  }

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
}

export { Shape } from './shape'
export { Rectangle } from './rectangle'
