import { createStage, Rectangle } from '../src/index'

const stage = createStage('#canvas', {
  width: 800,
  height: 600,
})
const { shapeContainer, eventPool } = stage

const a = new Rectangle({
  x: 0,
  y: 0,
  w: 100,
  h: 100,
  fillStyle: 'red',
  layer: 2,
})

shapeContainer.add(a)
eventPool.add(a)

const b = new Rectangle({
  x: 50,
  y: 50,
  w: 100,
  h: 100,
  fillStyle: 'blue',
})
shapeContainer.add(b)
eventPool.add(b)

stage.paint()
