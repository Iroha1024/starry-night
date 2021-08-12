import { Shape } from '../shape/index'

export class EventPool {
  list: EventProxy[] = []

  add(shape: Shape) {
    for (let i = -1, j; i < this.list.length; i++) {
      j = i + 1
      let next = this.list[j]
      if (!next) {
        this.list[j] = new EventProxy(shape)
        break
      } else if (Shape.compare(shape, next.shape) < 0) {
        this.list.splice(j, 0, new EventProxy(shape))
        break
      }
    }
  }

}

class EventProxy {
  shape: Shape

  constructor(shape: Shape) {
    this.shape = shape
  }
}
