import { EventEmitter } from 'events'
import type { ShapeProxy } from './shape'

export class Messenger {
  private instance = new EventEmitter()

  emit(type: 'clickShape', shape: ShapeProxy): boolean
  emit(type: 'dragShape', shape: ShapeProxy): boolean
  emit(type: 'enterShape', shape: ShapeProxy): boolean
  emit(type: 'leaveShape', shape: ShapeProxy): boolean
  emit(type: 'mousedownShape', shape: ShapeProxy): boolean
  emit(type: 'mousemoveShape', shape: ShapeProxy): boolean
  emit(type: 'mouseupShape', shape: ShapeProxy): boolean
  emit(type: 'clickCanvas'): boolean
  emit(type: 'dragCanvas'): boolean
  emit(type: 'enterCanvas'): boolean
  emit(type: 'leaveCanvas'): boolean
  emit(type: 'mousedownCanvas'): boolean
  emit(type: 'mousemoveCanvas'): boolean
  emit(type: 'mouseupCanvas'): boolean
  emit(type: 'repaint'): boolean
  emit(...data: any) {
    const [type, ...value] = data
    return this.instance.emit(type, ...value)
  }

  on(type: 'clickShape', listener: (shape: ShapeProxy) => void): void
  on(type: 'dragShape', listener: (shape: ShapeProxy) => void): void
  on(type: 'enterShape', listener: (shape: ShapeProxy) => void): void
  on(type: 'leaveShape', listener: (shape: ShapeProxy) => void): void
  on(type: 'mousedownShape', listener: (shape: ShapeProxy) => void): void
  on(type: 'mousemoveShape', listener: (shape: ShapeProxy) => void): void
  on(type: 'mouseupShape', listener: (shape: ShapeProxy) => void): void
  on(type: 'clickCanvas', listener: () => void): void
  on(type: 'dragCanvas', listener: () => void): void
  on(type: 'enterCanvas', listener: () => void): void
  on(type: 'leaveCanvas', listener: () => void): void
  on(type: 'mousedownCanvas', listener: () => void): void
  on(type: 'mousemoveCanvas', listener: () => void): void
  on(type: 'mouseupCanvas', listener: () => void): void
  on(type: 'repaint', listener: () => void): void
  on(type: string, handle: (...data: any) => void) {
    this.instance.on(type, handle)
  }
}
