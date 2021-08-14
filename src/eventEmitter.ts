import { EventEmitter } from 'events'

export const eventEmitter = new EventEmitter()

declare module 'events' {
  interface EventEmitter {
    emit(type: 'selectShape'): boolean
    on(type: 'selectShape', listenr: () => void): boolean
  }
}
