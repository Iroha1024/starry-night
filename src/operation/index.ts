import type { ShapeContainer, ShapeProxy } from '../shape'
import { Group } from '../shape'
import type { EventPool } from '../event'
import type { EventEmitter } from '../eventEmitter'
import type { GetStageProperty } from '../stage'

export class OperationLayer {
  private shapeContainer: ShapeContainer
  private eventPool: EventPool
  private eventEmitter: EventEmitter
  private canvas: HTMLCanvasElement
  private isMouseDown = false
  private caughtShape: ShapeProxy | null = null
  private getStageProperty: GetStageProperty
  private selectedShape: ShapeProxy<Group>

  constructor(
    eventEmitter: EventEmitter,
    shapeContainer: ShapeContainer,
    eventPool: EventPool,
    getStageProperty: GetStageProperty,
    ctx: CanvasRenderingContext2D
  ) {
    this.eventEmitter = eventEmitter
    this.shapeContainer = shapeContainer
    this.eventPool = eventPool
    this.getStageProperty = getStageProperty
    this.canvas = ctx.canvas
    this.initSelectedShape()
    this.initEvent()
  }

  private initState() {
    this.isMouseDown = false
    this.caughtShape = null
  }

  private initSelectedShape() {
    this.selectedShape = this.shapeContainer.add(
      new Group({
        children: [],
        editable: true,
      })
    ) as ShapeProxy<Group>
  }

  private initEvent() {
    const eventNameList: Array<DomEventName> = [
      'click',
      'mousedown',
      'mousemove',
      'mouseup',
      'mouseenter',
      'mouseleave',
    ]
    eventNameList.forEach((type) => {
      this.canvas.addEventListener(type, (event) => this.receive(event))
    })
  }

  receive(event: DomEvent) {
    this.handle(event)
  }

  handle(event: DomEvent) {
    if (event instanceof MouseEvent) {
      const key = event.type as MouseEventName
      switch (key) {
        case 'click':
          this.click(event)
          break
        case 'mousedown':
          this.isMouseDown = true
          break
        case 'mousemove':
          this.isMouseDown && this.mousemove(event)
          this.enterLeaveShape(event)
          this.touchEditPoint(event)
          break
        case 'mouseup':
          this.initState()
          break
        case 'mouseenter':
          this.enterCanvas()
          break
        case 'mouseleave':
          this.initState()
          this.leaveCanvas()
          break
      }
    }
  }

  click(event: MouseEvent) {
    const { offsetX: x, offsetY: y } = event
    const shape = this.shapeContainer.getTopLayerShape({
      x,
      y,
    })
    if (shape) {
      this.clickShape(shape)
    } else {
      this.clickCanvas()
    }
  }

  clickShape(shape: ShapeProxy) {
    this.selectedShape.clearChild()
    this.selectedShape.addChild(shape.origin)
    this.eventEmitter.emit('clickShape', shape)
    this.transfer('clickShape', shape)
  }

  clickCanvas() {
    this.selectedShape.clearChild()
    this.eventEmitter.emit('clickCanvas')
  }

  mousemove(event: MouseEvent) {
    const { offsetX: x, offsetY: y } = event
    if (this.caughtShape == null) {
      this.caughtShape = this.shapeContainer.getTopLayerShape({
        x,
        y,
      })
    }
    if (this.caughtShape) {
      this.moveShape(this.caughtShape, event)
    } else {
      this.moveCanvas(event)
    }
  }

  moveShape(shape: ShapeProxy, event: MouseEvent) {
    if (shape.draggable) {
      const { movementX, movementY } = event
      shape.move(movementX, movementY)
      this.eventEmitter.emit('moveShape', shape)
      this.transfer('moveShape', shape)
    }
  }

  moveCanvas(event: MouseEvent) {
    if (this.getStageProperty().draggable) {
      const { movementX, movementY } = event
      this.shapeContainer.toList().forEach((shape) => shape.move(movementX, movementY))
      this.eventEmitter.emit('moveCanvas')
    }
  }

  enterCanvas() {
    this.eventEmitter.emit('enterCanvas')
  }

  leaveCanvas() {
    this.eventEmitter.emit('leaveCanvas')
  }

  enterLeaveShape(event: MouseEvent) {
    const { offsetX: x, offsetY: y } = event
    const topLayerShape = this.shapeContainer.getTopLayerShape({
      x,
      y,
    })
    for (const shape of this.shapeContainer.toReverseList()) {
      if (shape == topLayerShape && !shape.isCursorIn) {
        shape.isCursorIn = true
        this.eventEmitter.emit('enterShape', shape)
        this.transfer('enterShape', shape)
      }
      if (shape != topLayerShape && shape.isCursorIn) {
        shape.isCursorIn = false
        this.eventEmitter.emit('leaveShape', shape)
        this.transfer('leaveShape', shape)
      }
    }
  }

  touchEditPoint(event: MouseEvent) {}

  transfer(event: EmitEventName, shape: ShapeProxy) {
    this.eventPool.receive(event, shape)
  }

  removeSelectShapeChild(shape: ShapeProxy) {
    this.selectedShape.removeChild(shape.origin)
  }

  getSelectedShape() {
    return this.selectedShape
  }
}

type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T]

type DomEvent = MouseEvent | KeyboardEvent

type MouseEventName = KeysMatching<HTMLElementEventMap, MouseEvent>

type DomEventName = KeysMatching<HTMLElementEventMap, DomEvent>

export type EmitEventName = 'clickShape' | 'moveShape' | 'enterShape' | 'leaveShape'
