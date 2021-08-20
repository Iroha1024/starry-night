type FillStyle = CanvasFillStrokeStyles['fillStyle']
type StrokeStyle = CanvasFillStrokeStyles['strokeStyle']

export interface ShapeConfig {
  x: number
  y: number
  w: number
  h: number
  layer?: number
  order?: number
  fillStyle?: FillStyle
  strokeStyle?: StrokeStyle
  lineWidth?: number
  draggable?: boolean
  editable?: boolean
  paintShapeSelectionFunction?: (ctx: CanvasRenderingContext2D) => void
}

export class Shape {
  private _x: number
  private _y: number
  private _width: number
  private _height: number
  private _layer: number
  private _order: number
  private _isFilled = false
  private _fillStyle: FillStyle
  private _isStroked = false
  private _strokeStyle: StrokeStyle
  private _lineWidth: number
  private _isSelected = false
  private _draggable: boolean
  private _isCursorIn = false
  private _editable = false
  private _paintShapeSelectionFunction: (ctx: CanvasRenderingContext2D) => void

  constructor(config: ShapeConfig) {
    const {
      x,
      y,
      w,
      h,
      layer,
      order,
      fillStyle,
      strokeStyle,
      lineWidth,
      draggable,
      editable,
      paintShapeSelectionFunction,
    } = config
    this.x = x
    this.y = y
    this.width = w
    this.height = h
    this.layer = layer ?? 0
    this.order = order ?? 0
    fillStyle != undefined && (this.isFilled = true)
    this.fillStyle = fillStyle ?? ''
    strokeStyle != undefined && (this.isStroked = true)
    this.strokeStyle = strokeStyle ?? ''
    this.lineWidth = lineWidth ?? 2
    this.draggable = draggable ?? false
    this.editable = editable ?? false
    this.paintShapeSelectionFunction = paintShapeSelectionFunction ?? (() => {})
  }

  getShape() {
    return this
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

  public get width(): number {
    return this._width
  }

  public set width(value: number) {
    this._width = value
  }

  public get height(): number {
    return this._height
  }

  public set height(value: number) {
    this._height = value
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

  public get draggable() {
    return this._draggable
  }

  public set draggable(value) {
    this._draggable = value
  }

  public get isCursorIn() {
    return this._isCursorIn
  }

  public set isCursorIn(value) {
    this._isCursorIn = value
  }

  public get editable() {
    return this._editable
  }

  public set editable(value) {
    this._editable = value
  }

  public get paintShapeSelectionFunction(): (ctx: CanvasRenderingContext2D) => void {
    return this._paintShapeSelectionFunction
  }

  public set paintShapeSelectionFunction(value: (ctx: CanvasRenderingContext2D) => void) {
    this._paintShapeSelectionFunction = value
  }

  getRepaintKeys(): Array<string> {
    const keys: Array<keyof Shape> = [
      'x',
      'y',
      'width',
      'height',
      'layer',
      'order',
      'isFilled',
      'fillStyle',
      'isStroked',
      'strokeStyle',
      'lineWidth',
      'isSelected',
      'draggable',
      'editable',
      'paintShapeSelectionFunction',
    ]
    return keys
  }

  paint(ctx: CanvasRenderingContext2D) {}

  paintShapeSelection(ctx: CanvasRenderingContext2D) {
    this.paintShapeSelectionFunction(ctx)
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
    if (this.isStroked) {
      ctx.lineWidth = this.lineWidth * 2
      ctx.strokeStyle = this.strokeStyle
      ctx.stroke()
    }
    ctx.restore()
    if (this.isSelected) {
      ctx.save()
      this.paintShapeSelection(ctx)
      ctx.restore()
    }
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
