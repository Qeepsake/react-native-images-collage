# pinch-zoom-responder

Easily add pinch and zoom gestures to your React Native components.

# Setup

```sh
npm install --save react-native-pinch-zoom-responder
```

# Usage

```javascript
import React, {
  Component
} from 'react'
import {
  View,
  Text
} from 'react-native'
import PinchZoomResponder from 'react-native-pinch-zoom-responder'

class MyComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      width: 1,
      height: 1
    }
    this.pinchZoomResponder = new PinchZoomResponder({
      onPinchZoomStart: (e) => {
        console.log('pinch started')
      },

      onPinchZoomEnd: (e) => {
        console.log('pinch ended')
      },

      onResponderMove: (e, gestureState) => {
        if (gestureState) {
          console.log('GestureState is ', gestureState)
          var transform = this._applyOriginTransform(gestureState.transform)
          this._setTransform(transform)
        }
      }
    })
  }

  _onLayout (event) {
    this.setState({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height
    })
  }

  _setTransform (matrix) {
    this.transformView.setNativeProps({ style: { transform: [{perspective: 1000}, { matrix: matrix }] } })
  }

  /*
  React Native view transforms have the component center as their origin,
  so we need to wrap our transform with translations that compensate for this and
  place the origin at 0,0
  */
  _applyOriginTransform (matrix) {
    var translate = MatrixMath.createIdentityMatrix()
    var copy = matrix.slice()
    MatrixMath.reuseTranslate2dCommand(translate, (this.state.width / 2.0), (this.state.height / 2.0))
    MatrixMath.multiplyInto(copy, matrix, translate)
    MatrixMath.reuseTranslate2dCommand(translate, -(this.state.width / 2.0), -(this.state.height / 2.0))
    MatrixMath.multiplyInto(copy, translate, copy)
    return copy
  }

  render () {
    return (
      <View {...this.pinchZoomResponder.handlers} onLayout={(e) => this._onLayout(e)}>
        <Text ref={(ref) => { this.transformView = ref }}>Pinch me!</Text>
      </View>
    )
  }
}
```

The gestureState object has the shape:

```javascript
{
  transform, cx, cy, scaleX, scaleY, dx, dy
}
```

- `transform` is a 4x4 matrix that can be used with `react-native/Libraries/Utilities/MatrixMath` to easily transform points and graphics.
- `cx` is the pinch X center
- `cy` is the pinch Y center
- `scaleX` is the pinch x scale
- `scaleY` is the pinch y scale
- `dx` is the current delta x of the center of the pinch
- `dy` is the current delta y of the center of the pinch

# Configuration

The responder can also receive a set of options as the second parameter.

```javascript
var responders = {
  onPinchZoomStart: (e) => {}
  onPinchZoomEnd: (e) => {}
  onResponderMove: (e, gestureState) => {}
}
var options = {
  transformX: true,
  transformY: true
}
new PinchZoomResponder(responders, options)
```

The `options` object is optional and it's fields can include:

- `transformX` true | false.  True by default. Enables transformation along the X axis
- `transformY` true | false.  True by default.  Enables transformation along the Y axis.
