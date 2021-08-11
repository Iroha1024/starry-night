import { createStage, Rectangle } from '../src/index'

const stage = createStage('#canvas', {
  width: 800,
  height: 600,
})
const { shapeContainer } = stage

shapeContainer.addShape(
  new Rectangle({
    x: 0,
    y: 0,
    w: 100,
    h: 100,
    fillStyle: 'red',
  })
)
shapeContainer.addShape(
  new Rectangle({
    x: 50,
    y: 50,
    w: 100,
    h: 100,
    fillStyle: 'blue',
  })
)

stage.paint()
