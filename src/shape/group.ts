import type { ShapeProxy } from './index'
import { Shape } from './shape'
import type { RectangleConfig } from './rectangle'
import { Rectangle } from './rectangle'

interface GroupConfig extends Omit<RectangleConfig, 'x' | 'y' | 'w' | 'h'> {
  x?: number
  y?: number
  w?: number
  h?: number
  children: Array<ShapeProxy>
}

export class Group extends Rectangle {
  private _children: Array<ShapeProxy> = []

  constructor(config: GroupConfig) {
    const defaultConfig = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    }
    super({
      ...defaultConfig,
      ...config,
    })
    const { children } = config
    children.forEach((child) => this.addChild(child))
    this.setLayer()
    this.calculateBoundingBox()
  }

  public get children(): Array<ShapeProxy> {
    return this._children
  }

  public set children(value: Array<ShapeProxy>) {
    this._children = value
  }

  override getRepaintKeys() {
    const keys: Array<keyof Group> = ['children']
    return [...super.getRepaintKeys(), ...keys]
  }

  setLayer() {
    if (this.children.length == 0) return
    let min = this.children[0]
    for (let i = 1; i < this.children.length; i++) {
      if (Shape.compare(min.origin, this.children[i].origin) > 0) {
        min = this.children[i]
      }
    }
    this.layer = min.layer
    this.order = min.order - 1
  }

  addChild(shape: ShapeProxy) {
    if (this.hasChild(shape)) return
    this.children.push(shape)
    this.setLayer()
  }

  removeChild(shape: ShapeProxy) {
    if (!this.hasChild(shape)) return
    const index = this.children.indexOf(shape)
    this.children.splice(index, 1)
    this.setLayer()
  }

  clearChild() {
    this.children = []
    this.setLayer()
  }

  hasChild(shape: ShapeProxy) {
    return this.children.findIndex((item) => item == shape) != -1
  }

  calculateBoundingBox() {
    if (this.children.length == 0) {
      this.width = 0
      this.height = 0
      return
    }
    const first = this.children[0]
    let minX = first.x,
      maxX = 0,
      minY = first.y,
      maxY = 0,
      width = first.width,
      height = first.height

    for (const shape of this.children) {
      const { x, y, width: w, height: h } = shape
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      if (x > maxX) {
        maxX = x
        width = w
      }
      if (y > maxY) {
        maxY = y
        height = h
      }
    }

    this.x = minX
    this.y = minY
    this.width = maxX - minX + width
    this.height = maxY - minY + height
  }

  override paint(ctx: CanvasRenderingContext2D) {
    this.calculateBoundingBox()
    this.rawPaint(ctx, () => {
      ctx.rect(this.x, this.y, this.width, this.height)
    })
  }

  override move(movementX: number, movementY: number) {
    this.children.forEach((shape) => shape.move(movementX, movementY))
  }
}
