import { createStage, Rectangle, Group } from '../src/index'

const stage = createStage('#canvas', {
  width: 800,
  height: 600,
  draggable: true,
})

stage.canvas.style.backgroundColor = 'antiquewhite'

const a = new Rectangle({
  x: 20,
  y: 0,
  w: 200,
  h: 100,
  fillStyle: 'red',
  layer: 2,
})

const proxyA = stage.add(a)

const b = new Rectangle({
  x: 50,
  y: 50,
  w: 300,
  h: 100,
  fillStyle: 'blue',
  strokeStyle: 'black',
  lineWidth: 10,
  paintShapeSelectionFunction(ctx) {},
  editable: true,
  draggable: true,
})

const proxyB = stage.add(b)

const group = new Group({
  children: [proxyA, proxyB],
  editable: true,
  draggable: true,
})

stage.add(group)

const c = new Rectangle({
  x: 100,
  y: 80,
  w: 80,
  h: 300,
  fillStyle: 'green',
  layer: 3,
  editable: true,
  draggable: true,
})
stage.add(c, {
  click() {
    this.fillStyle = 'black'
  },
})

const d = new Rectangle({
  x: 120,
  y: 60,
  w: 50,
  h: 50,
  fillStyle: 'yellow',
  layer: 2,
  draggable: true,
})

stage.add(d)

const { messenger } = stage

messenger.on('enterShape', (shape) => {})

messenger.on('dragShape', (shape) => {
  // console.log('leaveShape', shape.fillStyle)
})

messenger.on('clickShape', (shape) => {
  // console.log(stage.operationLayer.getSelectedShape().layer)
})

console.log(stage.shapeContainer)
