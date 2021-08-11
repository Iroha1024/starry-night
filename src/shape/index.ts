import type { Shape } from './shape'

export class ShapeContainer {
  layerMap = new Map<number, Array<Shape>>()

  addShape(shape: Shape) {
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
    list.sort((a, b) => (a.layer != b.layer ? a.layer - b.layer : a.order - b.order))
    return list
  }
}

export { Rectangle } from './rectangle'

