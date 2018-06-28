import React from 'react';
import { View, Image, PanResponder, StyleSheet } from 'react-native';

class CollageImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      panning: false,
      x: 0, y:  0,
      dx: 0, dx: 0,
      width: 0, height: 0,
      color: '#'+Math.floor(Math.random()*16777215).toString(16),
    };
  }

  componentWillMount(){
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderMove: (evt, gestureState) => {
        console.log(this.state.x);
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
        this.setState({ panning: false, selected: false });
      },
    });

    Image.getSize(this.props.source.uri, (width, height) => {
      this.setState({ width, height });
    });
  }

  render() {
    const { source, style } = this.props;
    const { x, y, width, height } = this.state;

    const right = x + (width / 2);
    const bottom = y + (height / 2);

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'row', width: width, overflow: 'hidden', backgroundColor: this.state.color }}>
          <Image source={source} style={[ style, { right, bottom, width, height }]} resizeMode='cover' {...this._panResponder.panHandlers} />
        </View>
      </View>
    );
  }
}

export default CollageImage;
