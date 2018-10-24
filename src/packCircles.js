let nextCircleId = 1
const generateCircles = count => {
  const minR = 10
  const maxR = 70
  const result = []
  for (let i = 0; i < count; i++) {
    result.push({
      id: nextCircleId++,
      r: Math.round(Math.random() * Math.random() * (maxR - minR) + minR)
    })
  }
  return result
}

const Direction = {
  left: -1,
  right: 1
}

// const randomOneOrMinusOne = () => (Math.round(Math.random()) - 0.5) * 2

// const calculateLeg = (hypotenuse, leg) => Math.sqrt(hypotenuse ** 2 - leg ** 2)

// const areCirclesOverlapping = (circle1, circle2, minCircleSpacing = 0) =>
//   (circle1.x - circle2.x) ** 2 + (circle1.y - circle2.y) ** 2 < (circle1.r + circle2.r + minCircleSpacing) ** 2

// const compareCirclesByX = (circle1, circle2) => circle1.x - circle2.x

const offsetCirclesX = (circles, offsetX) => {
  circles.forEach(circle => circle.x += offsetX)
  return circles
}

const packCircles = ({
  circles: unsortedCircles,
  laneWidth: laneWidthWithPadding,
  paddingTop = 10,
  paddingBottom = 10,
  paddingLeft = 10,
  paddingRight = 10,
  circleSpacing = 20
}) => {
  const laneWidth = laneWidthWithPadding - paddingLeft - paddingRight
  let circles = [...unsortedCircles]
  // sorting circles by size biggest to smallest
  circles.sort((circle1, circle2) => circle2.r - circle1.r)
  // packing circles
  let firstRow = true
  let nextSlideDirection = Direction.left // -1 -> shift left, +1 -> shift right, 0 -> unassigned
  let tailingCircles = [] // circles in "last row" sorted by x coordinate from left to right
  let currentBottomY = paddingTop

  const centerTailingCirclesHorizontally = (tailingCircles, laneWidth) => {
    if (tailingCircles.length > 0) {
      const rightCircle = tailingCircles[tailingCircles.length - 1]
      offsetCirclesX(tailingCircles, (laneWidth - (rightCircle.x + rightCircle.r)) / 2)
    }
  }

  circles = circles
    .map((circle, currentCircleIndex) => {
      // first circle in lane
      if (tailingCircles.length === 0) {
        circle.x = circle.r
        circle.y = currentBottomY + circle.r
        tailingCircles.push(circle)
      }
      else {
        // checking right area
        const leftCircle = tailingCircles[0]
        const rightCircle = tailingCircles[tailingCircles.length - 1]
        // if first row in lane
        if (rightCircle.x + rightCircle.r + circleSpacing + 2 * circle.r < laneWidth) {
          if (nextSlideDirection === Direction.left) {
            // insert current "circle" on the left side of row
            circle.x = circle.r
            circle.y = leftCircle.y
            // move circles right to make room for current "circle"
            offsetCirclesX(tailingCircles, 2 * circle.r + circleSpacing)
            tailingCircles.unshift(circle)
          }
          else {
            circle.x = rightCircle.x + rightCircle.r + circleSpacing + circle.r
            circle.y = rightCircle.y
            tailingCircles.push(circle)
          }
          nextSlideDirection = -nextSlideDirection
          return circle
        }
        else {
          if (firstRow || currentCircleIndex === circles.length-1) {
            // center horizontally first row
            centerTailingCirclesHorizontally(tailingCircles, laneWidth)
            // firstRow = false
            currentBottomY = Math.max(...tailingCircles.map(tailingCircle => tailingCircle.y + tailingCircle.r)) + circleSpacing
            circle.x = circle.r
            circle.y = currentBottomY + circle.r
            tailingCircles = [circle]
          }
        }
        // checking areas between circles
        
        // checking left area
      }
      return circle
    })
  if (tailingCircles.length > 0) {
    currentBottomY = Math.max(...tailingCircles.map(tailingCircle => tailingCircle.y + tailingCircle.r)) + circleSpacing
    centerTailingCirclesHorizontally(tailingCircles, laneWidth)
  }
  return {
    circles: offsetCirclesX(circles, paddingLeft),
    // ...  - circleSpacing ... because currentBottomY contains circleSpacing bellow circle
    laneHeight: currentBottomY - circleSpacing + paddingBottom
  }
}

export {
  generateCircles,
  packCircles
}