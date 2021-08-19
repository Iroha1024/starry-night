import { EventEmitter } from 'events'
import type { ShapeProxy } from './shape'

export { EventEmitter }

declare module 'events' {
  interface EventEmitter {
    emit(type: 'clickShape', shape: ShapeProxy): boolean
    on(type: 'clickShape', listener: (shape: ShapeProxy) => void): boolean

    emit(type: 'clickCanvas'): boolean
    on(type: 'clickCanvas', listener: () => void): boolean

    emit(type: 'moveShape', shape: ShapeProxy): boolean
    on(type: 'moveShape', listener: (shape: ShapeProxy) => void): boolean

    emit(type: 'moveCanvas'): boolean
    on(type: 'moveCanvas', listener: () => void): boolean

    emit(type: 'enterCanvas'): boolean
    on(type: 'enterCanvas', listener: () => void): boolean

    emit(type: 'leaveCanvas'): boolean
    on(type: 'leaveCanvas', listener: () => void): boolean

    emit(type: 'enterShape', shape: ShapeProxy): boolean
    on(type: 'enterShape', listener: (shape: ShapeProxy) => void): boolean

    emit(type: 'leaveShape', shape: ShapeProxy): boolean
    on(type: 'leaveShape', listener: (shape: ShapeProxy) => void): boolean

    emit(type: 'repaint'): boolean
    on(type: 'repaint', listener: () => void): boolean
  }
}
