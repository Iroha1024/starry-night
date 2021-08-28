import type { ShapeContainer, ShapeProxy } from '../shape'
import { Group } from '../shape'
import type { EventPool } from '../event'
import type { Messenger } from '../messenger'
import type { GetStageProperty } from '../stage'

export class OperationLayer {
  private shapeContainer: ShapeContainer
  private eventPool: EventPool
  private messenger: Messenger
  private canvas: HTMLCanvasElement
  private isMouseDown = false
  private caughtShape: ShapeProxy | null = null
  private getStageProperty: GetStageProperty
  private selectedShape: ShapeProxy<Group>

  constructor(
    messenger: Messenger,
    shapeContainer: ShapeContainer,
    eventPool: EventPool,
    getStageProperty: GetStageProperty,
    ctx: CanvasRenderingContext2D
  ) {
    this.messenger = messenger
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
      const { offsetX: x, offsetY: y } = event
      const shape = this.shapeContainer.getTopLayerShape({
        x,
        y,
      })
      switch (key) {
        case 'click':
          this.click(shape)
          break
        case 'mousedown':
          this.isMouseDown = true
          this.mousedown(shape)
          break
        case 'mousemove':
          this.mousemove(shape)
          this.isMouseDown && this.mouseDownAndMove(event, shape)
          this.enterLeaveShape(shape)
          this.touchEditPoint(event)
          break
        case 'mouseup':
          this.initState()
          this.mouseup(shape)
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

  click(shape: ShapeProxy | null) {
    if (shape) {
      this.clickShape(shape)
    } else {
      this.clickCanvas()
    }
  }

  clickShape(shape: ShapeProxy) {
    this.messenger.emit('clickShape', shape)
    this.transfer('click', shape)
  }

  clickCanvas() {
    this.messenger.emit('clickCanvas')
  }

  mousedown(shape: ShapeProxy | null) {
    if (shape) {
      this.mousedownShape(shape)
    } else {
      this.mousedownCanvas()
    }
  }

  mousedownShape(shape: ShapeProxy) {
    this.selectedShape.clearChild()
    this.selectedShape.addChild(shape.origin)
    this.messenger.emit('mousedownShape', shape)
    this.transfer('mousedown', shape)
  }

  mousedownCanvas() {
    this.selectedShape.clearChild()
    this.messenger.emit('mousedownCanvas')
  }

  mouseup(shape: ShapeProxy | null) {
    if (shape) {
      this.mouseupShape(shape)
    } else {
      this.mouseupCanvas()
    }
  }

  mouseupShape(shape: ShapeProxy) {
    this.messenger.emit('mouseupShape', shape)
    this.transfer('mouseup', shape)
  }

  mouseupCanvas() {
    this.messenger.emit('mouseupCanvas')
  }

  mousemove(shape: ShapeProxy | null) {
    if (shape) {
      this.mousemoveShape(shape)
    } else {
      this.mousemoveCanvas()
    }
  }

  mousemoveShape(shape: ShapeProxy) {
    this.messenger.emit('mousemoveShape', shape)
    this.transfer('mousemove', shape)
  }

  mousemoveCanvas() {
    this.messenger.emit('mousemoveCanvas')
  }

  mouseDownAndMove(event: MouseEvent, shape: ShapeProxy | null) {
    if (this.caughtShape == null) {
      this.caughtShape = shape
    }
    if (this.caughtShape) {
      this.dragShape(this.caughtShape, event)
    } else {
      this.dragCanvas(event)
    }
  }

  dragShape(shape: ShapeProxy, event: MouseEvent) {
    if (shape.draggable) {
      const { movementX, movementY } = event
      shape.move(movementX, movementY)
      this.messenger.emit('dragShape', shape)
      this.transfer('drag', shape)
    }
  }

  dragCanvas(event: MouseEvent) {
    if (this.getStageProperty().draggable) {
      const { movementX, movementY } = event
      this.shapeContainer.toList().forEach((shape) => shape.move(movementX, movementY))
      this.messenger.emit('dragCanvas')
    }
  }

  enterCanvas() {
    this.messenger.emit('enterCanvas')
  }

  leaveCanvas() {
    this.messenger.emit('leaveCanvas')
  }

  enterLeaveShape(topLayerShape: ShapeProxy | null) {
    for (const shape of this.shapeContainer.toReverseList()) {
      if (shape == topLayerShape && !shape.isCursorIn) {
        shape.isCursorIn = true
        this.messenger.emit('enterShape', shape)
        this.transfer('mouseenter', shape)
      }
      if (shape != topLayerShape && shape.isCursorIn) {
        shape.isCursorIn = false
        this.messenger.emit('leaveShape', shape)
        this.transfer('mouseleave', shape)
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

export type EmitEventName =
  | 'click'
  | 'drag'
  | 'mouseenter'
  | 'mouseleave'
  | 'mousedown'
  | 'mousemove'
  | 'mouseup'
