import { createStage, Rectangle, ShapeProxy } from '../src/index'

const stage = createStage('#canvas', {
  width: 800,
  height: 600,
})

const a = new Rectangle({
  x: 0,
  y: 0,
  w: 200,
  h: 100,
  fillStyle: 'red',
  layer: 2,
})

// stage.add(a)
const proxyA = stage.add(a, {
  click(shape) {},
})

const b = new Rectangle({
  x: 50,
  y: 50,
  w: 300,
  h: 100,
  fillStyle: 'blue',
  strokeStyle: 'black',
})
stage.add(b)

const c = new Rectangle({
  x: 100,
  y: 80,
  w: 80,
  h: 300,
  fillStyle: 'green',
  layer: 3,
})
stage.add(c)

const d = new Rectangle({
  x: 120,
  y: 60,
  w: 50,
  h: 50,
  fillStyle: 'yellow',
  layer: 2,
})

stage.add(d)

const { eventEmitter } = stage

eventEmitter.on('clickShape', (shape) => {
  shape.isSelected = true
  // console.log('clickShape', shape)
})

// eventEmitter.on('clickCanvas', () => {
//   console.log('clickCanvas')
// })

eventEmitter.on('moveShape', (shape, event) => {
  const { movementX, movementY } = event
  shape.x += movementX
  shape.y += movementY
  // console.log('moveShape', shape, event)
})
// eventEmitter.on('moveCanvas', (event) => {
//   console.log('moveCanvas', event)
// })

stage.paint()

console.log(stage)
