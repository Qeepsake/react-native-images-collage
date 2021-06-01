import React from "react";
import {
  View,
  Image,
  PanResponder,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";

class CollageImage extends React.Component {
  constructor(props) {
    super(props);

    this.id = props.imageId;

    this.state = {
      selected: false,
      animating: false,
      panningX: 0,
      panningY: 0,
      translateX: 0,
      translateY: 0,
      width: 0,
      height: 0,
      initialWidth: 0,
      initialHeight: 0,
      srcWidth: 0,
      srcHeight: 0,
      ratio: 0,
    };

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
    this.deltaScaling = 0;

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (e, gestureState) => {
        this.onLongPressTimeout = setTimeout(() => {
          this.setState({ selected: true }, () => {
            this.props.translationStartCallback(this);
          });
        }, props.longPressDelay);
      },
      onPanResponderMove: (evt, gestureState) => {
        const {
          panningX,
          panningY,
          width,
          height,
          initialWidth,
          initialHeight,
          ratio,
        } = this.state;
        const { scaleAmplifier, longPressSensitivity } = this.props;
        const {
          relativeContainerWidth,
          relativeContainerHeight,
        } = this.props.boundaries;

        const moveX = gestureState.moveX; // MOVEMENT ALONG THE X
        const moveY = gestureState.moveY; // MOVEMENT ALONG THE Y

        //INTERRUPT ANIMATIONS
        if (this.snapAnimation != null) {
          // CANCEL ANIMARION AND CAPTURE POSITION
          this.setState({
            animating: false,
            panningX: this.animatedX._value,
            panningY: this.animatedY._value,
          });

          // INTERRUPT ANIMATION
          this.snapAnimation.stop();
          this.snapAnimation = null;
        }

        // PAN
        if (gestureState.numberActiveTouches == 1) {
          if (!this.state.animating) {
            if (!this.panning) {
              this.panning = true;

              this.originPanningX = moveX;
              this.originPanningY = moveY;

              this.originTranslateX = moveX;
              this.originTranslateY = moveY;

              // RESET DELTA PANNING
              this.deltaPanningX = this.originPanningX - moveX;
              this.deltaPanningY = this.originPanningY - moveY;
            } else {
              // CALCULATE MOVEMENT

              if (!this.state.selected) {
                // IMAGE IS NOT SELECTED - CALCULATE PANNING

                // CALCULATE FRICTION TO APPLY TO PANNING (APPLIED WHEN IMAGE REACHES END OF BOUND FOR RESISTANCE EFFECT)
                const { frictionX, frictionY } = this.calculateFriction(
                  panningX,
                  panningY
                );

                const panningMovementX = this.originPanningX - moveX;
                const panningMovementY = this.originPanningY - moveY;

                // CALCULATE THE DIRECTION WE ARE PANNING IN
                this.directionX =
                  this.deltaPanningX - panningMovementX > 0 ? "right" : "left";
                this.directionY =
                  this.deltaPanningY - panningMovementY > 0 ? "down" : "up";

                // CALCULATE THE INCREMENTS BETWEEN PANNING IN ORDER TO APPLY FRICTION FORCE
                const incrementX =
                  (this.deltaPanningX - panningMovementX) * frictionX;
                const incrementY =
                  (this.deltaPanningY - panningMovementY) * frictionY;

                // APPLY THE INCREMENT TO OUR PANNING VALUE
                const newPanningX = panningX - incrementX;
                const newPanningY = panningY - incrementY;

                // How much movement should cancel the long press? We use a base of 10.
                const longPressCancelSensitivity = 10 * longPressSensitivity;

                // Clear long press timer if we are panning
                if (
                  Math.abs(panningMovementX) > longPressCancelSensitivity ||
                  Math.abs(panningMovementY) > longPressCancelSensitivity
                )
                  if (this.onLongPressTimeout)
                    clearTimeout(this.onLongPressTimeout);

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
          // SCALE
        } else if (gestureState.numberActiveTouches == 2) {
          const touches = evt.touchHistory.touchBank.filter(
            (item) => item !== null || item !== undefined
          );
          const touchOne = touches[0];
          const touchTwo = touches[1];

          const scalingValue = Math.max(
            Math.abs(touchOne.currentPageX - touchTwo.currentPageX),
            Math.abs(touchOne.currentPageY - touchTwo.currentPageY)
          ); // SCALING AMOUNT

          // Clear long press timer if we are scaling
          if (this.onLongPressTimeout) clearTimeout(this.onLongPressTimeout);

          if (!this.scaling) {
            // FIRST TOUCH - START SCALING
            this.scaling = true;

            this.deltaScaling = scalingValue;
          } else {
            // SCALING
            const incrementScaling =
              (this.deltaScaling - scalingValue) * scaleAmplifier;

            // Support portrait and landscape photos by scaling each axis by ratio depending on the image properties
            const incrementScalingWidth =
              initialWidth > initialHeight
                ? incrementScaling * ratio
                : incrementScaling;
            const incrementScalingHeight =
              initialHeight > initialWidth
                ? incrementScaling * ratio
                : incrementScaling;

            // Calculate our new image size from scaling
            const newWidth = width - incrementScalingWidth;
            const newHeight = height - incrementScalingHeight;

            // Don't scale if width or height is not greater than container, we always scale if the scale is positive (making the image larger)
            if (
              (newWidth > relativeContainerWidth &&
                height > relativeContainerHeight) ||
              incrementScaling < 0
            ) {
              // Calculate anchor pecentage, where has the user started the scale relative to the container as a percentage
              const anchorRelativePercentageX =
                ((moveX - this.props.collageOffsetX) / relativeContainerWidth) *
                100;
              const anchorRelativePercentageY =
                ((moveY - this.props.collageOffsetY) /
                  relativeContainerHeight) *
                100;

              // Calculate anchor point relative to image width
              const anchorPointX = Math.max(
                1,
                (3 * anchorRelativePercentageX) / 100
              );
              const anchorPointY = Math.max(
                1,
                (3 * anchorRelativePercentageY) / 100
              );

              // Calculate anchor panning to scale by center
              const anchorPanningX =
                panningX - (width - newWidth) / anchorPointX;
              const anchorPanningY =
                panningY - (height - newHeight) / anchorPointY;

              this.setState({
                width: newWidth,
                height: newHeight,
                panningX: anchorPanningX,
                panningY: anchorPanningY,
              });
            }

            // DELTA SCALING
            this.deltaScaling = scalingValue;
          }
        }
      },
      onPanResponderEnd: (e, gestureState) => {
        // Focusses the image, if user just taps it, and there is no movement or holding
        if (Math.abs(gestureState.dx) < 5 && !this.state.selected) {
          if (this.props.onImageFocus) this.props.onImageFocus(e);
        }

        // Disable scaling, and panning
        this.panning = false;
        this.scaling = false;

        // Clear long press timer
        if (this.onLongPressTimeout) clearTimeout(this.onLongPressTimeout);

        if (this.state.selected) {
          this.props.translationEndCallback(this);
          this.setState({ selected: false, translateX: 0, translateY: 0 });
        }

        this.calculateImagePosition();
      },
    });

    this.calculateImageSize();
  }

  componentDidUpdate(prevProps) {
    const {
      matrix,
      direction,
      boundaries,
      panningLeftPadding,
      panningRightPadding,
      panningTopPadding,
      panningBottomPadding,
    } = this.props;
    const { width, height } = this.state;

    this.leftEdge = 0;
    this.rightEdge = width - (boundaries.ux - boundaries.lx);
    this.topEdge = 0;
    this.bottomEdge = height - (boundaries.uy - boundaries.ly);

    this.leftEdgeMax = this.leftEdge - panningLeftPadding;
    this.rightEdgeMax = this.rightEdge + panningRightPadding;
    this.topEdgeMax = this.topEdge - panningTopPadding;
    this.bottomEdgeMax = this.bottomEdge + panningBottomPadding;

    // Auto resize collage images when matrix, direction, or collage size is updated
    if (matrix !== prevProps.matrix || direction !== prevProps.direction) {
      if (this.snapAnimation != null) {
        // INTERRUPT ANIMATION
        this.snapAnimation.stop();
        this.snapAnimation = null;
      }

      this.setState({
        panningX: 0,
        panningY: 0,
      });

      this.calculateImageSize();
    }
  }

  componentWillUnmount() {
    // Clear long press timer when component is unmounted
    if (this.onLongPressTimeout) clearTimeout(this.onLongPressTimeout);
  }

  calculateFriction(x, y) {
    let frictionX = 1.0;
    let frictionY = 1.0;

    if (x < this.leftEdge && this.directionX === "right") {
      // TOO FAR RIGHT
      frictionX = Math.max(
        0,
        (x - this.leftEdgeMax) / (this.leftEdge - this.leftEdgeMax)
      ); // REVERSE NORMALIZATION
    }

    if (x > this.rightEdge && this.directionX === "left") {
      // TOO FAR RIGHT
      frictionX = Math.max(
        0,
        (x - this.rightEdgeMax) / (this.rightEdge - this.rightEdgeMax)
      ); // REVERSE NORMALIZATION
    }

    if (y < this.topEdge && this.directionY === "down") {
      // TOO FAR DOWN
      frictionY = Math.max(
        0,
        (y - this.topEdgeMax) / (this.topEdge - this.topEdgeMax)
      ); // REVERSE NORMALIZATION
    }

    if (y > this.bottomEdge && this.directionY === "up") {
      // TOO FAR UP
      frictionY = Math.max(
        0,
        (y - this.bottomEdgeMax) / (this.bottomEdge - this.bottomEdgeMax)
      ); // REVERSE NORMALIZATION
    }

    return { frictionX, frictionY };
  }

  /**
   * Updates the image postion, will use animation to snap the image into place if it is out of bounds
   */
  calculateImagePosition() {
    const { panningX, panningY } = this.state;

    this.setState({ animating: true });

    this.animatedX.setValue(panningX);
    this.animatedY.setValue(panningY);

    let animateXTo = this.animatedX._value;
    let animateYTo = this.animatedY._value;
    if (panningX < this.leftEdge) {
      animateXTo = this.leftEdge;
    }
    if (panningX > this.rightEdge) {
      animateXTo = this.rightEdge;
    }
    if (panningY < this.topEdge) {
      animateYTo = this.topEdge;
    }
    if (panningY > this.bottomEdge) {
      animateYTo = this.bottomEdge;
    }

    if (
      animateXTo != this.animatedX._value ||
      animateYTo != this.animatedY._value
    ) {
      this.snapAnimation = Animated.parallel([
        Animated.spring(this.animatedX, {
          toValue: animateXTo,
          duration: 100,
        }),
        Animated.spring(this.animatedY, {
          toValue: animateYTo,
          duration: 100,
        }),
      ]);

      this.snapAnimation.start(() => {
        this.setState({ animating: false, panningX: animateXTo });
      });
    } else {
      this.setState({ animating: false });
    }
  }

  /**
   * Calculates the size of the image. This includes width, height, intial size and source size.
   *
   * @param targetWidth {number} target width to overwrite the width to be calculated
   * @param targetHeight {number} target height to overwite the height to be calculated
   * @param keepScale {bool} Keeps the scale of the image, does not try to adjust to container size
   */
  calculateImageSize(
    targetWidth = null,
    targetHeight = null,
    keepScale = false
  ) {
    Image.getSize(this.props.source.uri, (width, height) => {
      // SCALE IMAGE TO FIT THE CONTAINER
      const { imageWidth, imageHeight } = this.calculateAspectRatioFit(
        targetWidth ? targetWidth : width,
        targetHeight ? targetHeight : height,
        this.props.boundaries.relativeContainerWidth,
        this.props.boundaries.relativeContainerHeight,
        keepScale
      );

      this.setState(
        {
          width: imageWidth,
          height: imageHeight,
          initialWidth: imageWidth,
          initialHeight: imageHeight,
          srcWidth: width,
          srcHeight: height,
          ratio: Math.max(imageHeight / imageWidth, imageWidth / imageHeight),
        },
        () => {
          this.calculateImagePosition();
        }
      );
    });
  }

  /**
   * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
   * images to fit into a certain area. We use Math.max becuase we don't want
   * the image to resize smaller than the container.
   *
   * @param {Number} srcWidth width of source image
   * @param {Number} srcHeight height of source image
   * @param {Number} maxWidth maximum available width
   * @param {Number} maxHeight maximum available height
   * @param {Bool} Keeps the scale of the image
   *
   * @return {Object} { imageWidth, imageHeight }
   */
  calculateAspectRatioFit(
    srcWidth,
    srcHeight,
    maxWidth,
    maxHeight,
    keepScale = false
  ) {
    const newMaxWidth = keepScale ? Math.max(srcWidth, maxWidth) : maxWidth;
    const newMaxHeight = keepScale ? Math.max(srcHeight, maxHeight) : maxHeight;

    const ratio = Math.max(newMaxWidth / srcWidth, newMaxHeight / srcHeight);
    return { imageWidth: srcWidth * ratio, imageHeight: srcHeight * ratio };
  }

  /**
   * Method triggered when image has been swapped
   *
   * @param image - A CollageImage class
   */
  imageSwapped(image) {
    const { retainScaleOnSwap } = this.props;

    // SWAP PROPERTIES
    let targetImagePanningX = image.state.panningX;
    let targetImagePanningY = image.state.panningY;
    const targetImageWidth = image.state.width;
    const targetImageHeight = image.state.height;

    if (targetImagePanningX < this.leftEdge) {
      targetImagePanningX = this.leftEdge;
    }
    if (targetImagePanningX > this.rightEdge) {
      targetImagePanningX = this.rightEdge;
    }
    if (targetImagePanningY < this.topEdge) {
      targetImagePanningY = this.topEdge;
    }
    if (targetImagePanningY > this.bottomEdge) {
      targetImagePanningY = this.bottomEdge;
    }

    // WHEN IMAGE IS SWAPPED THEN WE RECALCULATE THE SIZE.
    this.calculateImageSize(
      targetImageWidth,
      targetImageHeight,
      retainScaleOnSwap
    );

    this.setState({
      panningX: targetImagePanningX,
      panningY: targetImagePanningY,
    });
  }

  render() {
    const {
      source,
      style,
      imageSelectedStyle,
      imageFocusId,
      imageFocussedStyle,
      imageContainerStyle,
    } = this.props;
    const {
      panningX,
      panningY,
      translateX,
      translateY,
      width,
      height,
      selected,
      animating,
    } = this.state;

    const right = animating ? this.animatedX : panningX;
    const bottom = animating ? this.animatedY : panningY;

    return (
      <View
        ref={"imageContainer"}
        style={[
          {
            flex: 1,
            overflow: "hidden",
            transform: [
              { translateX: -translateX },
              { translateY: -translateY },
            ],
          },
          imageContainerStyle,
          imageFocusId === this.id ? imageFocussedStyle : null,
        ]}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            width: width,
            height: height,
          }}
          {...this._panResponder.panHandlers}
        >
          <Animated.Image
            ref={"image"}
            source={source}
            style={[
              style,
              { right, bottom, width, height },
              selected ? imageSelectedStyle : null,
            ]}
            resizeMode="cover"
          />
        </View>
        {this.props.isEditButtonVisible && (
          <TouchableOpacity
            onPress={this.props.onEditButtonPress}
            style={{
              position: "absolute",
              margin: this.props.editButtonIndent
                ? this.props.editButtonIndent
                : 20,
              top:
                this.props.editButtonPosition &&
                this.props.editButtonPosition.includes("top")
                  ? 0
                  : null,
              bottom:
                this.props.editButtonPosition &&
                this.props.editButtonPosition.includes("bottom")
                  ? 0
                  : null,
              left:
                this.props.editButtonPosition &&
                this.props.editButtonPosition.includes("left")
                  ? 0
                  : null,
              right:
                this.props.editButtonPosition &&
                this.props.editButtonPosition.includes("right")
                  ? 0
                  : null,
            }}
          >
            {this.props.EditButtonComponent()}
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

CollageImage.propTypes = {
  panningLeftPadding: PropTypes.number.isRequired, // LEFT PANNING PADDING
  panningRightPadding: PropTypes.number.isRequired, // RIGHT PANNING PADDING
  panningTopPadding: PropTypes.number.isRequired, // TOP PANNING PADDING
  panningBottomPadding: PropTypes.number.isRequired, // BOTTOM PANNING PADDING
  scaleAmplifier: PropTypes.number.isRequired, // ADJUST SCALING
  retainScaleOnSwap: PropTypes.bool,
  longPressDelay: PropTypes.number,
  longPressSensitivity: PropTypes.number, // 1 - 20 - How sensitive is the long press?
  onEditButtonPress: PropTypes.func,
  EditButtonComponent: PropTypes.func,
  editButtonPosition: PropTypes.oneOf([
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
  ]),
  isEditButtonVisible: PropTypes.bool,
  editButtonIndent: PropTypes.number,
  imageContainerStyle: PropTypes.object,
  imageFocussedStyle: PropTypes.object,
  imageFocusId: PropTypes.string,
  onImageFocus: PropTypes.func,
};

export default CollageImage;
