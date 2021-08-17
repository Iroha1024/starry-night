import { nanoid } from 'nanoid'

type FillStyle = CanvasFillStrokeStyles['fillStyle']
type StrokeStyle = CanvasFillStrokeStyles['strokeStyle']

export interface ShapeConfig {
  x: number
  y: number
  layer?: number
  order?: number
  fillStyle?: FillStyle
  strokeStyle?: StrokeStyle
  lineWidth?: number
}

export class Shape {
  private readonly _id = nanoid()
  private _x: number
  private _y: number
  private _layer: number
  private _order: number
  private _isFilled = false
  private _fillStyle: FillStyle
  private _isStroked = false
  private _strokeStyle: StrokeStyle
  private _lineWidth: number
  private _isSelected = false

  constructor(config: ShapeConfig) {
    const { x, y, layer, order, fillStyle, strokeStyle, lineWidth } = config
    this.x = x
    this.y = y
    this.layer = layer ?? 0
    this.order = order ?? 0
    fillStyle != undefined && (this.isFilled = true)
    this.fillStyle = fillStyle ?? ''
    strokeStyle != undefined && (this.isStroked = true)
    this.strokeStyle = strokeStyle ?? ''
    this.lineWidth = lineWidth ?? 2
  }

  getShape() {
    return this
  }

  public get id() {
    return this._id
  }

  public get x(): number {
    return this._x
  }

  public set x(value: number) {
    this._x = value
  }

  public get y(): number {
    return this._y
  }

  public set y(value: number) {
    this._y = value
  }

  public get layer(): number {
    return this._layer
  }

  public set layer(value: number) {
    this._layer = value
  }
  public get order(): number {
    return this._order
  }

  public set order(value: number) {
    this._order = value
  }

  public get isFilled() {
    return this._isFilled
  }

  public set isFilled(value) {
    this._isFilled = value
  }

  public get fillStyle(): FillStyle {
    return this._fillStyle
  }

  public set fillStyle(value: FillStyle) {
    this._fillStyle = value
  }

  public get isStroked() {
    return this._isStroked
  }

  public set isStroked(value) {
    this._isStroked = value
  }

  public get strokeStyle(): StrokeStyle {
    return this._strokeStyle
  }

  public set strokeStyle(value: StrokeStyle) {
    this._strokeStyle = value
  }

  public get lineWidth(): number {
    return this._lineWidth
  }

  public set lineWidth(value: number) {
    this._lineWidth = value
  }

  public get isSelected() {
    return this._isSelected
  }

  public set isSelected(value) {
    this._isSelected = value
  }

  getRepaintKeys(): Array<string> {
    const keys: Array<keyof Shape> = [
      'x',
      'y',
      'layer',
      'order',
      'isFilled',
      'fillStyle',
      'isStroked',
      'strokeStyle',
      'lineWidth',
      'isSelected',
    ]
    return keys
  }

  paint(ctx: CanvasRenderingContext2D) {}

  protected drawShapeSelection(ctx: CanvasRenderingContext2D) {
    ctx.setLineDash([10, 5])
  }

  rawPaint(ctx: CanvasRenderingContext2D, process: () => void) {
    ctx.save()
    ctx.beginPath()
    process()
    ctx.closePath()
    ctx.clip()
    if (this.isFilled) {
      ctx.fillStyle = this.fillStyle
      ctx.fill()
    }
    if (this.isSelected) {
      this.drawShapeSelection(ctx)
    }
    ctx.lineWidth = this.lineWidth
    if (this.isStroked) {
      ctx.strokeStyle = this.strokeStyle
      ctx.lineWidth *= 2
      ctx.stroke()
    }
    ctx.restore()
  }

  static compare(a: Shape, b: Shape) {
    return a.layer != b.layer ? a.layer - b.layer : a.order - b.order
  }

  isInside(point: Point) {
    return false
  }
}

export interface Point {
  x: number
  y: number
}
