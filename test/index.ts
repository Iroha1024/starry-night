import { createStage, Rectangle } from '../src/index'

const stage = createStage('#canvas', {
  width: 800,
  height: 600,
})
const { shapeContainer, eventPool } = stage

const a = new Rectangle({
  x: 0,
  y: 0,
  w: 200,
  h: 100,
  fillStyle: 'red',
  layer: 2,
})

shapeContainer.add(a)
eventPool.add(a, {
  click(shape) {
    // console.log(shape.fillStyle)
  },
})

const b = new Rectangle({
  x: 50,
  y: 50,
  w: 300,
  h: 100,
  fillStyle: 'blue',
})
shapeContainer.add(b)
eventPool.add(b, {
  click(shape) {
    // console.log(shape.fillStyle)
  },
})

const c = new Rectangle({
  x: 100,
  y: 80,
  w: 80,
  h: 300,
  fillStyle: 'green',
  layer: 3,
})
shapeContainer.add(c)
eventPool.add(c, {
  click(shape) {
    // console.log(shape.fillStyle)
  },
})

const d = new Rectangle({
  x: 120,
  y: 60,
  w: 50,
  h: 50,
  fillStyle: 'yellow',
  layer: 2,
})

shapeContainer.add(d)
eventPool.add(d, {
  click(shape) {
    // console.log(shape.fillStyle)
  },
})

console.log(stage)
stage.paint()
