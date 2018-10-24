import React, { Component } from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

import {
  generateCircles,
  packCircles
} from './packCircles'

const CIRCLE_COUNT = 100

class App extends Component {
  constructor(props) {
    super(props)
    const rawCircles = generateCircles(CIRCLE_COUNT)
    const laneWidth = 200
    this.state = {
      ...this.repositionCircles({
        laneWidth,
        rawCircles,
        doSetState: false
      })
    }
  }

  repositionCircles({laneWidth, rawCircles = this.state.rawCircles, doSetState = true}) {
    const nextState = {
      laneWidth,
      rawCircles: rawCircles,
      ...packCircles({
        circles: rawCircles,
        laneWidth,
      })
    }
    if (doSetState) {
      this.setState(nextState)
    }
    return nextState
  }

  render() {
    const { laneWidth, laneHeight, circles } = this.state
    return (
      <>
        <div className='range-container'>
          <InputRange
            minValue={100}
            maxValue={600}
            value={laneWidth}
            onChange={value => this.repositionCircles({ laneWidth: value })}
          />
        </div>
        <div className='circle-container' style={{width: laneWidth}}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={laneWidth}
            height={laneHeight}
            viewBox={`0 0 ${laneWidth} ${laneHeight}`}
          >
            {(circles || []).map(({id, r, x, y}) => (
              <circle
                className='svg-circle'
                key={id}
                r={r}
                cx={0}
                cy={0}
                style={{
                  transform: `translate(${x}px, ${y}px)`
                }}
              />
            ))}
          </svg>
        </div>
      </>
    );
  }
}

export default App;
