import React from "react";
import { View, Image, StyleSheet } from "react-native";
import PropTypes from "prop-types";

import { LayoutData } from "./Layouts";
import CollageImage from "./CollageImage";

class DynamicCollage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageFocusId: null,
      images: props.images,
      collageWidth: null,
      collageHeight: null,
      collageOffsetX: null,
      collageOffsetY: null,
    };
  }

  renderMatrix() {
    const {
      matrix,
      direction,
      retainScaleOnSwap,
      longPressDelay,
      longPressSensitivity,
      width,
      height,
    } = this.props;
    const { collageOffsetX, collageOffsetY, imageFocusId } = this.state;

    const sectionDirection = direction === "row" ? "column" : "row";
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    return matrix.map((element, m, array) => {
      const startIndex = m ? array.slice(0, m).reduce(reducer) : 0;

      const images = this.state.images
        .slice(startIndex, startIndex + element)
        .map((image, i) => {
          // Determines if the source is a URL, or local asset
          const source = Number.isInteger(image)
            ? Image.resolveAssetSource(image)
            : { uri: image };

          return (
            <CollageImage
              key={i}
              ref={`image${m}-${i}`}
              source={source}
              style={[{ flex: 1 }, this.props.imageStyle]}
              boundaries={this.getImageBoundaries(m, i)}
              translationStartCallback={this.imageTranslationStart.bind(this)}
              translationUpdateCallback={this.imageTranslationUpdate.bind(this)}
              translationEndCallback={this.imageTranslationEnd.bind(this)}
              matrixId={m}
              imageId={`image${m}-${i}`}
              imageSelectedStyle={this.props.imageSelectedStyle}
              panningLeftPadding={this.props.panningLeftPadding}
              panningRightPadding={this.props.panningRightPadding}
              panningTopPadding={this.props.panningTopPadding}
              panningBottomPadding={this.props.panningBottomPadding}
              scaleAmplifier={this.props.scaleAmplifier}
              retainScaleOnSwap={retainScaleOnSwap}
              longPressDelay={longPressDelay}
              onEditButtonPress={() => this.props.onEditButtonPress(m, i)}
              isEditButtonVisible={this.props.isEditButtonVisible}
              EditButtonComponent={this.props.EditButtonComponent}
              editButtonPosition={this.props.editButtonPosition}
              editButtonIndent={this.props.editButtonIndent}
              matrix={matrix}
              direction={direction}
              longPressSensitivity={longPressSensitivity}
              collageOffsetX={collageOffsetX}
              collageOffsetY={collageOffsetY}
              imageFocusId={imageFocusId}
              imageContainerStyle={this.props.imageContainerStyle}
              onImageFocus={(event) => this.setImageFocusId(event, m, i)}
              imageFocussedStyle={this.props.imageFocussedStyle}
            />
          );
        });

      return (
        <View
          key={m}
          ref={`matrix${m}`}
          style={{ flex: 1, flexDirection: sectionDirection }}
        >
          {images}
        </View>
      );
    });
  }

  render() {
    const { width, height, matrix, direction, containerStyle } = this.props;
    const { images, collageWidth, collageHeight } = this.state;

    // CHECK IF MATRIX = NUMBER OF PHOTOS
    if (matrix.reduce((a, b) => a + b, 0) !== images.length) {
      throw new Error(
        "Number of images must be equal to sum of matrix. E.g. Matrix = [ 1, 2 ] = 3. Images.length = 3 "
      );
    }

    return (
      <View
        style={[{ width, height }, containerStyle]}
        onLayout={(event) => {
          this.setState({
            collageWidth: event.nativeEvent.layout.width,
            collageHeight: event.nativeEvent.layout.height,
            collageOffsetX: event.nativeEvent.layout.x,
            collageOffsetY: event.nativeEvent.layout.y,
          });
        }}
      >
        <View style={{ flex: 1, flexDirection: direction }}>
          {collageWidth !== null && collageHeight !== null
            ? this.renderMatrix()
            : null}
        </View>
      </View>
    );
  }

  imageTranslationStart(selectedImage) {
    const { matrix } = this.props;
    const { images } = this.state;
    const { matrixId, imageId } = selectedImage.props;
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    // Reset zIndex's
    matrix.map((element, m, array) => {
      const startIndex = m ? array.slice(0, m).reduce(reducer) : 0;

      // Reset the zIndex of all matrices
      this.refs[`matrix${m}`].setNativeProps({ zIndex: 1 });

      // Reset the zIndex of all the images
      images.slice(startIndex, startIndex + element).map((image, i) => {
        this.refs[`image${m}-${i}`].refs["imageContainer"].setNativeProps({
          zIndex: 1,
        });
      });
    });

    // Update the zIndex of the matrix which contains the selected image
    this.refs[`matrix${matrixId}`].setNativeProps({ zIndex: 999 });
    // Update the zIndex of the selected image
    this.refs[imageId].refs["imageContainer"].setNativeProps({ zIndex: 999 });
  }

  imageTranslationUpdate(selectedImage) {
    const targetImageId = this.isImageInBoundaries(selectedImage);

    if (typeof targetImageId === "string") {
      // IMAGE IS IN BOUNDARIES - HIGHLIGHT POTENTIAL SWAP
      // USE DIRECT MANIPULATION TO AVOID RE-RENDERING ALL IMAGES
      this.refs[targetImageId].refs["imageContainer"].setNativeProps({
        style: this.props.imageSwapStyle,
      });
    }
  }

  imageTranslationEnd(selectedImage) {
    const { images } = this.state;
    const targetImageId = this.isImageInBoundaries(selectedImage);

    if (typeof targetImageId === "string") {
      // SWAP IMAGES
      const targetImage = this.refs[targetImageId];

      const reorderedImages = images.slice();
      const index1 = images.findIndex((image) =>
        this.imageFindIndexBySource(image, selectedImage)
      );
      const index2 = images.findIndex((image) =>
        this.imageFindIndexBySource(image, targetImage)
      );

      // Swap the images by index
      reorderedImages[index1] = images[index2];
      reorderedImages[index2] = images[index1];

      // Set the reordered images as state
      this.setState({ images: reorderedImages, imageFocusId: null });

      // Call the swapped functions on each image
      selectedImage.imageSwapped(targetImage);
      targetImage.imageSwapped(selectedImage);
    }
  }

  isImageInBoundaries(selectedImage) {
    const { matrix, separatorStyle } = this.props;
    const { images } = this.state;
    const { translateX, translateY } = selectedImage.state;
    const {
      lx,
      ly,
      relativeContainerWidth,
      relativeContainerHeight,
    } = selectedImage.props.boundaries;

    let targetImageId = null;

    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    matrix.map((element, m, array) => {
      const startIndex = m ? array.slice(0, m).reduce(reducer) : 0;

      images.slice(startIndex, startIndex + element).map((image, i) => {
        // RESET STYLES
        this.refs[`image${m}-${i}`].refs["imageContainer"].setNativeProps({
          style: { ...this.props.imageResetStyle, ...separatorStyle },
        });

        // IS IMAGE NOT THE SELECTED IMAGE (DON'T COMPARE OWN BOUNDARIES)
        if (selectedImage.props.imageId !== `image${m}-${i}`) {
          const targetBoundaries = this.getImageBoundaries(m, i);

          const imagePositionX = lx + relativeContainerWidth / 2 - translateX;
          const imagePositionY = ly + relativeContainerHeight / 2 - translateY;

          // IS IMAGE IN BOUNDARIES?
          if (
            imagePositionX > targetBoundaries.lx &&
            imagePositionX < targetBoundaries.ux &&
            imagePositionY > targetBoundaries.ly &&
            imagePositionY < targetBoundaries.uy
          ) {
            targetImageId = `image${m}-${i}`;
          }
        }
      });
    });

    return targetImageId;
  }

  /**
   * Finds the index of a image, either URL or `required`.
   *
   * @param image
   * @param targetImage
   *
   * @return int
   */
  imageFindIndexBySource(image, targetImage) {
    // We need to resolve the image to get the URI, if we want to support require();
    const targetImageURI = targetImage.props.source.uri;
    const imageResolved = Number.isInteger(image)
      ? Image.resolveAssetSource(image).uri
      : image;

    return imageResolved === targetImageURI;
  }

  /**
   * Gets the index of the image, by matrix
   *
   * @param {number} m - matrix index
   * @param {number} i - images index
   *
   * @returns {number} index
   */
  imageFindIndexByMatrix(m, i) {
    // The matrix numbers before this image index
    const matrixPrefix = this.props.matrix.slice(0, m);
    // Sum of images before the 'i' index
    const sumOfMatrixPrefix = matrixPrefix.reduce((a, b) => a + b, 0);
    // This index of the image taking into account the matrix
    const realIndex = sumOfMatrixPrefix + i;

    return realIndex;
  }

  /**
   * Function used to calculate the lower and upper bounds of an image in the collage.
   *
   * @param m {number} - matrix index
   * @param i {number} - images index
   * @return {object}
   */
  getImageBoundaries(m, i) {
    const { matrix, direction } = this.props;
    const { collageWidth, collageHeight } = this.state;

    const relativeContainerWidth =
      direction === "row"
        ? collageWidth / matrix.length
        : collageWidth / matrix[m];
    const relativeContainerHeight =
      direction === "row"
        ? collageHeight / matrix[m]
        : collageHeight / matrix.length;

    const boundries =
      direction === "row"
        ? {
            lx: relativeContainerWidth * m,
            ly: relativeContainerHeight * i,
            ux: relativeContainerWidth * (m + 1),
            uy: relativeContainerHeight * (i + 1),
          }
        : {
            lx: relativeContainerWidth * i,
            ly: relativeContainerHeight * m,
            ux: relativeContainerWidth * (i + 1),
            uy: relativeContainerHeight * (m + 1),
          };

    return { ...boundries, relativeContainerWidth, relativeContainerHeight };
  }

  /**
   * Updates the collage width and height
   *
   * @param {Object} size - new size for collage
   * @param {number} size.width - width of collage
   * @param {number} size.height - height of collage
   */
  updateCollageSize({ width, height }) {
    this.setState({
      collageHeight: height ? height : this.state.collageHeight,
      collageWidth: width ? width : this.state.collageWidth,
    });
  }

  /**
   * Function used to replace an image in the collage
   *
   * @param {number|string} source - source of image (url or file asset)
   * @param {number} m - matrix index
   * @param {number} i - images index
   */
  replaceImage(source, m, i) {
    const replaceIndex = this.imageFindIndexByMatrix(m, i);
    const replacedImages = this.state.images.map((image, index) => {
      if (replaceIndex === index) {
        return source;
      }

      return image;
    });

    this.setState(
      {
        images: replacedImages,
      },
      () => {
        const targetImage = this.refs[`image${m}-${i}`];
        targetImage.calculateImageSize();
      }
    );
  }

  /**
   * Function used to focus the image that was just pressed
   *
   * @param {number} m - matrix index
   * @param {number} i - image index
   *
   * @typedef {Object} Indexes
   * @property {number} m - matrix index
   * @property {number} i - image index
   *
   * @return {GestureResponderEvent} e - gesture responder event
   * @returns {Indexes} matrix and image indexes
   *
   */
  setImageFocusId(event, m, i) {
    const imageId = `image${m}-${i}`;
    this.setState((prevState) => ({
      imageFocusId: prevState.imageFocusId === imageId ? null : imageId,
    }));
    this.props.onImageFocus && this.props.onImageFocus(event, m, i);
  }
}

DynamicCollage.defaultProps = {
  // VARIABLES --------------
  direction: "row", // DIRECTION OF THE COLLAGE
  panningLeftPadding: 15, // LEFT PANNING PADDING
  panningRightPadding: 15, // RIGHT PANNING PADDING
  panningTopPadding: 15, // TOP PANNING PADDING
  panningBottomPadding: 15, // BOTTOM PANNING PADDING
  scaleAmplifier: 1.0, // ADJUST SCALING
  retainScaleOnSwap: true,
  longPressDelay: 500,
  longPressSensitivity: 3,

  // STYLE --------------
  containerStyle: {
    borderWidth: 4,
    borderColor: "black",
    backgroundColor: "white",
  },
  imageStyle: {}, // DEFAULT IMAGE STYLE
  imageContainerStyle: {
    // DEFAULT IMAGE CONTAINER STYLE
    borderWidth: 2,
    borderColor: "white",
  },

  // STYLE OF SEPARATORS ON THE COLLAGE
  separatorStyle: {
    borderWidth: 2,
    borderColor: "white",
  },

  // IMAGE SELECTED
  imageSelectedStyle: {
    opacity: 0.6,
  },

  // IMAGE SWAP
  imageSwapStyle: {
    borderColor: "#EB4A4A",
    borderWidth: 4,
  },
  imageSwapStyleReset: {
    borderWidth: 0,
  }, // RESET ANY STYLE APPLIED WITH imageSwapStyle

  // IMAGE FOCUS
  imageFocussedStyle: {},
};

DynamicCollage.propTypes = {
  images: PropTypes.array,
  matrix: PropTypes.array,
  direction: PropTypes.oneOf(["row", "column"]),
  panningLeftPadding: PropTypes.number, // LEFT PANNING PADDING
  panningRightPadding: PropTypes.number, // RIGHT PANNING PADDING
  panningTopPadding: PropTypes.number, // TOP PANNING PADDING
  panningBottomPadding: PropTypes.number, // BOTTOM PANNING PADDING
  scaleAmplifier: PropTypes.number, // ADJUST SCALING
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
  onImageFocus: PropTypes.func,
  onImagePress: PropTypes.func,
};

export { DynamicCollage };
