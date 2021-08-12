import { Shape } from './shape'

export class ShapeContainer {
  layerMap = new Map<number, Array<Shape>>()

  add(shape: Shape) {
    const { layer } = shape
    if (!this.layerMap.has(layer)) {
      this.layerMap.set(layer, [])
    }
    this.layerMap.get(layer)!.push(shape)
  }

  toList() {
    const list: Shape[] = []
    for (const shapeList of this.layerMap.values()) {
      list.push(...shapeList)
    }
    list.sort((a, b) => Shape.compare(a, b))
    return list
  }
}

export { Shape } from './shape'
export { Rectangle } from './rectangle'

