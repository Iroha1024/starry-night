import { EventEmitter } from 'events'
import type { Shape } from './shape'

export { EventEmitter }

declare module 'events' {
  interface EventEmitter {
    emit(type: 'selectShape', shape?: Shape): boolean
    on(type: 'selectShape', listener: (shape?: Shape) => void): boolean
  }
}
