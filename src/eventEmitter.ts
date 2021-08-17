import { EventEmitter } from 'events'
import type { ShapeProxy } from './shape'

export { EventEmitter }

declare module 'events' {
  interface EventEmitter {
    emit(type: 'clickShape', shape: ShapeProxy): boolean
    on(type: 'clickShape', listener: (shape: ShapeProxy) => void): boolean

    emit(type: 'clickCanvas'): boolean
    on(type: 'clickCanvas', listener: () => void): boolean

    emit(type: 'moveShape', shape: ShapeProxy, event: MouseEvent): boolean
    on(type: 'moveShape', listener: (shape: ShapeProxy, event: MouseEvent) => void): boolean

    emit(type: 'moveCanvas', event: MouseEvent): boolean
    on(type: 'moveCanvas', listener: (event: MouseEvent) => void): boolean

    emit(type: 'repaint'): boolean
    on(type: 'repaint', listener: () => void): boolean
  }
}
