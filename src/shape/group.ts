import type { Shape } from './shape'
import type { RectangleConfig } from './rectangle'
import { Rectangle } from './rectangle'

interface GroupConfig extends Omit<RectangleConfig, 'x' | 'y' | 'w' | 'h'> {
  x?: number
  y?: number
  w?: number
  h?: number
  children: Array<Shape>
}

export class Group extends Rectangle {
  private _children: Array<Shape>

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
    this.children = children
    this.calculateBoundingBox(children)
  }

  public get children(): Array<Shape> {
    return this._children
  }

  public set children(value: Array<Shape>) {
    this._children = value
  }

  override getRepaintKeys() {
    const keys: Array<keyof Group> = ['children']
    return [...super.getRepaintKeys(), ...keys]
  }

  calculateBoundingBox(shapeList: Array<Shape>) {
    //........
    this.x = 0
    this.y = 0
    this.width = 200
    this.height = 200
  }

  override paint(ctx: CanvasRenderingContext2D) {
    this.rawPaint(ctx, () => {
      ctx.rect(this.x, this.y, this.width, this.height)
      this.children.forEach((shape) => shape.paint(ctx))
    })
  }

  override move(movementX: number, movementY: number) {
    this.x += movementX
    this.y += movementY
    this.children.forEach((shape) => shape.move(movementX, movementY))
  }
}
