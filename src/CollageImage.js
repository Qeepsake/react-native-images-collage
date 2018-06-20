import React from 'react';
import { View, Image, LayoutAnimation, TouchableWithoutFeedback, PanResponder } from 'react-native';
import PinchZoomResponder from 'react-native-pinch-zoom-responder';

class CollageImage extends React.Component {
  state = {
    x: 0, y: 0,
    dx: 0, dy: 0,
    width: 0, height: 0,
    initialWidth: 0, initialHeight: 0,
    deltaMoveX: 0, deltaMoveY: 0,
    deltaScale: 0,
    panning: false,
    animating: false,
    handlers: {},
  }

  componentWillMount(){
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderMove: (evt, gestureState) => {
        if(!this.state.animating){
          if(!this.state.panning){
            this.setState({ panning: true });
            this.setState({ dx: this.state.x + gestureState.moveX, dy: this.state.y + gestureState.moveY });
            this.setState({ deltaMoveX: gestureState.moveX, deltaMoveY: gestureState.moveY });
          }

          if(!this.props.selected){
            //PANNING LOGIC
            const translateX = this.state.dx - gestureState.moveX;
            const translateY = this.state.dy - gestureState.moveY;

            this.props.image.setX(translateX);
            this.props.image.setY(translateY);

            const restrains = this.restrainAxis(translateX, translateY, this.state.width, this.state.height);

            this.setState(restrains);
          } else {
            //SELECTED / ARRANGING LOGIC
            const touchPositionX = gestureState.moveX;
            const touchPositionY = gestureState.moveY;

            const translateX = this.state.deltaMoveX - gestureState.moveX;
            const translateY = this.state.deltaMoveY - gestureState.moveY;

            this.props.move(translateX, translateY);
          }

          if(gestureState.numberActiveTouches == 2){
            this.setState({ handlers: this.pinchZoomResponder.handlers });
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.setState({ panning: false });

        if(this.props.selected){
          this.props.onPressOut();
        }
      },
    });

    this.pinchZoomResponder = new PinchZoomResponder({
      onResponderMove: (e, gestureState) => {
        // if (gestureState) {
        //   const size = this.resizeImage(gestureState.scaleX, gestureState.scaleY, this.state.width, this.state.height);
        //
        //   LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        //   this.setState(size);
        // }
      },
      onPinchZoomEnd: (e) => {
        this.setState({ handlers: this._panResponder.panHandlers });
      },
    });

    this.setState({ handlers: this._panResponder.panHandlers });
  }

  componentDidMount() {
    const { image } = this.props;
    const { containerWidth, containerHeight } = this.props;

    Image.getSize(image.url, (width, height) => {
      const size = this.imageRatio(width, height);
      image.setSize(size.width, size.height);
      this.setState({ width: size.width, height: size.height, initialWidth: size.width, initialHeight: size.height });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { image } = nextProps;

    if(image.isReset){
      image.isReset = false;
      this.setState({ x: 0, y: 0, width: this.state.initialWidth, height: this.state.initialHeight });
    }

    if(this.props.image.url != image.url){
      this.setState({ x: image.x, y: image.y, width: this.state.initialWidth, height: this.state.initialHeight });
    }
  }

  imageRatio(width, height){
    const { containerWidth, containerHeight } = this.props;

    let hRatio = containerWidth / width;
    let vRatio =  containerHeight / height;
    let ratio  = Math.max ( hRatio, vRatio );

    let calWidth = Math.round(Number(width * ratio));
    let calHeight = Math.round(Number(width * ratio));

    return { width: calWidth, height: calHeight };
  }

  resizeImage(scaleX, scaleY, width, height){
    if(width && height){
      const { containerWidth, containerHeight } = this.props;
      const { deltaScale, initialWidth, initialHeight } = this.state;

      let scale = Math.max(scaleX, scaleY);

      const newWidth = width;
      const newHeight = height;

      if(deltaScale > scale){
        newWidth = newWidth * 0.9;
        newHeight = newHeight * 0.9;
      } else if(deltaScale < scale){
        newWidth = newWidth * 1.1;
        newHeight = newHeight * 1.1;
      }

      if(newWidth > containerWidth && newWidth < initialWidth &&
        newHeight > containerHeight && newHeight < initialHeight){
        return { width: newWidth, height: newHeight };
      }

      this.setState({ deltaScale: scale });
    }

    return { width, height };
  }

  restrainAxis(x, y, width, height){
    const { containerWidth, containerHeight } = this.props;
    const restrains = { x, y };

    if(x < 0){
      restrains.x = 0;
    }

    if(width > 0){ // AKA. HAS IMAGE BEEN LOADED
      if(x > (width - containerWidth)){
        restrains.x = (width - containerWidth);
      }
    }

    if(y < 0){
      restrains.y = 0;
    }

    if(height > 0){ // AKA. HAS IMAGE BEEN LOADED
      if(y > (height - containerHeight)){
        restrains.y = (height - containerHeight);
      }
    }

    return restrains;
  }

  render() {
    const { image, imageStyle, onPress, onLongPress, onPressOut, opacity } = this.props;
    const { x, y, width, height } = this.state;

    return (
      <View {...this.state.handlers}>
        <TouchableWithoutFeedback
          onPress={ () => onPress() }
          onLongPress={ () => onLongPress() }>
          <Image
            source={{ uri: image.url }}
            resizeMode='cover'
            style={[ imageStyle,
              {
                width: width,
                height: height,
                right: x,
                bottom: y,
                opacity: opacity
              }
            ]} />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default CollageImage;
