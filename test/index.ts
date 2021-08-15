import { createStage, Rectangle } from '../src/index'

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
stage.add(a, {
  click(shape) {
    console.log('object')
  },
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

console.log(stage)
stage.paint()
