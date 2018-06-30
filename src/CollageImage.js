import React from 'react';
import { View, Image, PanResponder, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';

class CollageImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false, animating: false,
      panningX: 0, panningY:  0,
      translateX: 0, translateY: 0,
      width: 0, height: 0,
    };

    this.initialWidth = 0;
    this.initialHeight = 0;

    // PANNING
    this.panning = false;

    this.originPanningX = 0;
    this.originPanningY = 0;

    this.deltaPanningX = 0;
    this.deltaPanningY = 0;

    this.frictionX = 1.0;
    this.frictionY = 1.0;

    this.directionX = null;
    this.directionY = null;

    this.leftEdge = 0; // NEGATIVE VALUE
    this.rightEdge = 0;
    this.topEdge = 0; // NEGATIVE VALUE
    this.bottomEdge = 0;

    this.leftEdgeMax = 0;
    this.rightEdgeMax = 0;
    this.topEdgeMax = 0;
    this.bottomEdgeMax = 0;

    this.animatedX = new Animated.Value(0);
    this.animatedY = new Animated.Value(0);

    this.snapAnimation = null;

    // TRANSLATION
    this.originTranslateX = 0;
    this.originTranslateY = 0;

    // SCALING
    this.scaling = false;

    this.originScalingX = 0;
    this.originScalingY = 0;

    this.deltaScalingX = 0;
    this.deltaScalingY = 0;

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderMove: (evt, gestureState) => {
        const { panningX, panningY, width, height } = this.state;
        const { scaleAmplifier } = this.props;
        const { relativeContainerWidth, relativeContainerHeight } = this.props.boundaries;

        //INTERRUPT ANIMATIONS
        if(this.snapAnimation != null){
          // CANCEL ANIMARION AND CAPTURE POSITION
          this.setState({ animating: false, panningX: this.animatedX._value, panningY: this.animatedY._value });

          // INTERRUPT ANIMATION
          this.snapAnimation.stop();
          this.snapAnimation = null;
        }

        if(gestureState.numberActiveTouches == 1){
          if(!this.state.animating){
            const moveX = gestureState.moveX; // MOVEMENT ALONG THE X
            const moveY = gestureState.moveY; // MOVEMENT ALONG THE Y

            if(!this.panning){
              this.panning = true;

              this.originPanningX = panningX + moveX;
              this.originPanningY = panningY + moveY;

              this.originTranslateX = moveX;
              this.originTranslateY = moveY;

              // RESET DELTA PANNING
              this.deltaPanningX = this.originPanningX - moveX;
              this.deltaPanningY = this.originPanningY - moveY;
            } else {
              // CALCULATE MOVEMENT

              if(!this.state.selected){
                // IMAGE IS NOT SELECTED - CALCULATE PANNING

                // CALCULATE FRICTION TO APPLY TO PANNING (APPLIED WHEN IMAGE REACHES END OF BOUND FOR RESISTANCE EFFECT)
                const { frictionX, frictionY } = this.calculateFriction(panningX, panningY);

                const panningMovementX = this.originPanningX - moveX;
                const panningMovementY = this.originPanningY - moveY;

                // CALCULATE THE DIRECTION WE ARE PANNING IN
                this.directionX = (this.deltaPanningX - panningMovementX) > 0 ? 'right' : 'left';
                this.directionY = (this.deltaPanningY - panningMovementY) > 0 ? 'down' : 'up';

                // CALCULATE THE INCREMENTS BETWEEN PANNING IN ORDER TO APPLY FRICTION FORCE
                const incrementX = (this.deltaPanningX - panningMovementX) * frictionX;
                const incrementY = (this.deltaPanningY - panningMovementY) * frictionY;

                // APPLY THE INCREMENT TO OUR PANNING VALUE
                const newPanningX = (panningX - incrementX);
                const newPanningY = (panningY - incrementY);

                this.setState({ panningX: newPanningX, panningY: newPanningY });

                // DELTA PANNING
                this.deltaPanningX = panningMovementX;
                this.deltaPanningY = panningMovementY;
              } else {
                // IMAGE IS SELECTED - CALCULATE TRANSLATION

                const translateX = this.originTranslateX - moveX;
                const translateY = this.originTranslateY - moveY;

                this.props.translationUpdateCallback(this);

                this.setState({ translateX, translateY });
              }
            }
          }
        } else if(gestureState.numberActiveTouches == 2) {
          const touchOne = evt.touchHistory.touchBank[1];
          const touchTwo = evt.touchHistory.touchBank[2];

          const scalingX = Math.abs(touchOne.currentPageX - touchTwo.currentPageX); // SCALING ALONG THE X
          const scalingY = Math.abs(touchOne.currentPageY - touchTwo.currentPageY); // SCALING ALONG THE Y

          if(!this.scaling){
            this.scaling = true;

            this.originScalingX = width;
            this.originScalingY = height;

            // RESET DELTA SCALING
            this.deltaScalingX = this.originScalingX - scalingX;
            this.deltaScalingY = this.originScalingY - scalingY;
          } else {
            // SCALING
            const scalingMovementX = this.originScalingX - scalingX;
            const scalingMovementY = this.originScalingY - scalingY;

            const incrementScalingX = (width > relativeContainerWidth) ? (this.deltaScalingX - scalingMovementX) * scaleAmplifier : 0;
            const incrementScalingY = (height > relativeContainerHeight) ? (this.deltaScalingY - scalingMovementY) * scaleAmplifier : 0;

            const newWidth = (width + incrementScalingX);
            const newHeight = (height + incrementScalingY);

            this.setState({ width: newWidth, height: newHeight });

            // DELTA PANNING
            this.deltaScalingX = scalingMovementX;
            this.deltaScalingY = scalingMovementY;
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.panning = false;
        this.scaling = false;

        if(this.state.selected){
          this.props.translationEndCallback(this);
          this.setState({ selected: false, translateX: 0, translateY: 0 });
        }

        this.updatePosition();
      },
    });

    Image.getSize(this.props.source.uri, (width, height) => {
      this.initialWidth = width;
      this.initialHeight = height;

      this.setState({ width, height });
    });
  }

  componentDidUpdate(){
    const { boundaries, constraintLeftPadding, constraintRightPadding, constraintTopPadding, constraintBottomPadding } = this.props;
    const { panningX, panningY, width, height } = this.state;

    this.leftEdge = 0;
    this.rightEdge = width - (boundaries.ux - boundaries.lx);
    this.topEdge = 0;
    this.bottomEdge = height - (boundaries.uy - boundaries.ly);

    this.leftEdgeMax = this.leftEdge - constraintLeftPadding;
    this.rightEdgeMax = this.rightEdge + constraintRightPadding;
    this.topEdgeMax = this.topEdge - constraintTopPadding;
    this.bottomEdgeMax = this.bottomEdge + constraintBottomPadding;
  }

  calculateFriction(x, y){
    let frictionX = 1.0;
    let frictionY = 1.0;

    if(x < this.leftEdge && this.directionX == 'right'){ // TOO FAR RIGHT
      frictionX = Math.max(0, (x - this.leftEdgeMax) / (this.leftEdge - this.leftEdgeMax)); // REVERSE NORMALIZATION
    }

    if(x > this.rightEdge && this.directionX == 'left'){ // TOO FAR RIGHT
      frictionX = Math.max(0, (x - this.rightEdgeMax) / (this.rightEdge - this.rightEdgeMax)); // REVERSE NORMALIZATION
    }

    if(y < this.topEdge && this.directionY == 'down'){ // TOO FAR DOWN
      frictionY = Math.max(0, (y - this.topEdgeMax) / (this.topEdge - this.topEdgeMax)); // REVERSE NORMALIZATION
    }

    if(y > this.bottomEdge && this.directionY == 'up'){ // TOO FAR UP
      frictionY = Math.max(0, (y - this.bottomEdgeMax) / (this.bottomEdge - this.bottomEdgeMax)); // REVERSE NORMALIZATION
    }

    return { frictionX, frictionY };
  }

  // Uses react-native image api to reposition image if it is out of bounds
  updatePosition(){
    const { panningX, panningY, width, height } = this.state;

    this.setState({ animating: true });

    this.animatedX.setValue(panningX);
    this.animatedY.setValue(panningY);

    let animateXTo = this.animatedX._value;
    let animateYTo = this.animatedY._value;
    if(panningX < this.leftEdge){ animateXTo = this.leftEdge; }
    if(panningX > this.rightEdge){ animateXTo = this.rightEdge; }
    if(panningY < this.topEdge){ animateYTo = this.topEdge; }
    if(panningY > this.bottomEdge){ animateYTo = this.bottomEdge; }

    if(animateXTo != this.animatedX._value || animateYTo != this.animatedY._value){
      this.snapAnimation = Animated.parallel([
          Animated.spring(this.animatedX, {
              toValue: animateXTo,
              duration: 100
          }),
          Animated.spring(this.animatedY, {
             toValue: animateYTo,
             duration: 100
          })
      ]);

      this.snapAnimation.start(() => {
          this.setState({ animating: false, panningX: animateXTo });
      });
    } else {
      this.setState({ animating: false });
    }
  }

  onLongPress(){
    this.props.translationStartCallback(this);
    this.setState({ selected: true });
  }

  render() {
    const { source, style, selectedStyle } = this.props;
    const { panningX, panningY, translateX, translateY, width, height, selected, animating } = this.state;

    const right = animating ? this.animatedX : panningX;
    const bottom = animating ? this.animatedY : panningY;
    console.log(height, this.initialHeight);
    return (
      <View
        ref={'imageContainer'}
        style={{
          flex: 1, overflow: 'hidden',
          transform: [
            { translateX: -translateX },
            { translateY: -translateY },
          ],
        }}>
        <View style={{ flex: 1, flexDirection: 'row', width: this.initialWidth, height: this.initialHeight, overflow: 'hidden' }} {...this._panResponder.panHandlers}>
            <TouchableWithoutFeedback
              onLongPress={ () => this.onLongPress() }>
              <Animated.Image
                ref={'image'}
                source={source}
                style={[ style, { right, bottom, width, height }, selected ? selectedStyle : null]}
                resizeMode='cover' />
            </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

CollageImage.defaultProps = {
  constraintLeftPadding: 15,
  constraintRightPadding: 15,
  constraintTopPadding: 15,
  constraintBottomPadding: 15,
  selectedStyle: {
    opacity: 0.6,
  },
  scaleAmplifier: 1.0,
};

export default CollageImage;
