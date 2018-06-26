import React from 'react';
import { View, Image, PanResponder, StyleSheet } from 'react-native';

class CollageImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false, panning: false,
      x: 0, y:  0,
      width: 0, height: 0,
    };
  }

  componentWillMount(){
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderMove: (evt, gestureState) => {
        if(!this.state.panning){
          this.setState({ panning: true });
          this.setState({ dx: this.state.x + gestureState.moveX, dy: this.state.y + gestureState.moveY });
        }

        // RACE CONDITION WITH DX CAUSES BUMB
        console.log(this.state.dx, this.state.dy);

        if(this.state.dx != this.state.x + gestureState.moveX){
          //PANNING LOGIC
          const translateX = this.state.dx - gestureState.moveX;
          const translateY = this.state.dy - gestureState.moveY;

          this.setState({ x: translateX, y: translateY });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.setState({ panning: false });
      },
    });

    Image.getSize(this.props.source.uri, (width, height) => {
      this.setState({ width, height });
    });
  }

  render() {
    const { source, style } = this.props;
    const { x, y, width, height } = this.state;

    return (
      <View style={{ flex: 1, flexDirection: 'row', width: width, overflow: 'hidden' }}>
        <Image {...this._panResponder.panHandlers} source={source} style={[ style, { right: x, bottom: y, width, height }]} resizeMode='cover' />
      </View>
    );
  }
}

export default CollageImage;
