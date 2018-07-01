import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import CollageImage from './CollageImage';

class DynamicCollage extends React.Component {
  state = { images: null };

  static getDerivedStateFromProps(props, state) {
    if (state.images !== props.images) {
      return {
         images: props.images,
      }
    }
  }

  renderMatrix(){
    const { matrix, separators, direction, style } = this.props;

    const sectionDirection = (direction == 'row') ? 'column' : 'row';
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    return matrix.map((element, m, array) => {
      const startIndex = m ? array.slice(0, m).reduce(reducer) : 0;

      const images = this.state.images.slice(startIndex, startIndex + element).map((image, i) => {
        return (
          <CollageImage
            key={i}
            ref={`image${m}-${i}`}
            source={{ uri: image }}
            style={{ flex: 1, margin: separators }}
            boundaries={ this.getImageBoundaries(m, i) }
            translationStartCallback={ this.imageTranslationStart.bind(this) }
            translationUpdateCallback={ this.imageTranslationUpdate.bind(this) }
            translationEndCallback={ this.imageTranslationEnd.bind(this) }
            matrixId={m}
            imageId={`image${m}-${i}`}
            imageSelectedStyle={ this.props.imageSelectedStyle } />
        );
      });

      return (
        <View
          key={m}
          ref={`matrix${m}`}
          style={{ flex: 1, flexDirection: sectionDirection }}>
          { images }
        </View>
      );
    });
  }

  render() {
    const { width, height, matrix, images, borders, borderColor, direction, backgroundColor, containerStyle } = this.props;

    // CHECK IF MATRIX = NUMBER OF PHOTOS
    if(matrix.reduce((a, b) => a + b, 0) != images.length){
      throw new Error('Number of images must be equal to sum of matrix. E.g. Matrix = [ 1, 2 ] = 3. Images.length = 3 ');
    }

    return (
      <View style={[ { width, height }, containerStyle, { borderWidth: borders, borderColor: borderColor, backgroundColor: backgroundColor } ]}>
        <View style={{ flex: 1, flexDirection: direction }}>
          { this.renderMatrix() }
        </View>
      </View>
    );
  }

  imageTranslationStart(selectedImage){
    const { matrix } = this.props;
    const { matrixId, imageId } = selectedImage.props;

    // Reset the zIndex of all matrices
    matrix.map((element, index) => { this.refs[`matrix${index}`].setNativeProps({ zIndex: 1 }); });

    // Update the zIndex of the matrix which contains the selected image
    this.refs[`matrix${matrixId}`].setNativeProps({ zIndex: 999 });
  }

  imageTranslationUpdate(selectedImage){
    const targetImageId = this.isImageInBoundaries(selectedImage);

    if(typeof targetImageId == 'string'){
      // IMAGE IS IN BOUNDARIES - HIGHLIGHT POTENTIAL SWAP
      // USE DIRECT MANIPULATION TO AVOID RE-RENDERING ALL IMAGES
      this.refs[targetImageId].refs['imageContainer'].setNativeProps({ style: this.props.imageSwapStyle });
    }
  }

  imageTranslationEnd(selectedImage){
    const { images } = this.state;
    const targetImageId = this.isImageInBoundaries(selectedImage);

    if(typeof targetImageId == 'string'){
      // SWAP IMAGES
        const targetImage = this.refs[targetImageId];

        const reorderedImages = images.slice();
        const index1 = images.findIndex((image) => image == selectedImage.refs['image'].props.source.uri);
        const index2 = images.findIndex((image) => image == targetImage.refs['image'].props.source.uri);

        reorderedImages[index1] = images[index2];
        reorderedImages[index2] = images[index1];

        this.setState({ images: reorderedImages });

      // SWAP PROPERTIES
        const targetImagePanningX = targetImage.state.panningX;
        const targetImagePanningY = targetImage.state.panningY;
        const targetImageWidth = targetImage.state.width;
        const targetImageHeight = targetImage.state.height;

        targetImage.state.panningX = selectedImage.state.panningX;
        targetImage.state.panningY = selectedImage.state.panningY;
        targetImage.state.width = selectedImage.state.width;
        targetImage.state.height = selectedImage.state.height;

        selectedImage.state.panningX = targetImagePanningX;
        selectedImage.state.panningY = targetImagePanningY;
        selectedImage.state.width = targetImageWidth;
        selectedImage.state.height = targetImageHeight;
    }
  }

  isImageInBoundaries(selectedImage){
    const { matrix, images } = this.props;
    const { translateX, translateY } = selectedImage.state;
    const { lx, ly, relativeContainerWidth, relativeContainerHeight } = selectedImage.props.boundaries;

    let targetImageId = null;

    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    matrix.map((element, m, array) => {
      const startIndex = m ? array.slice(0, m).reduce(reducer) : 0;

      images.slice(startIndex, startIndex + element).map((image, i) => {
        // RESET STYLES
        this.refs[`image${m}-${i}`].refs['imageContainer'].setNativeProps({ style: this.props.imageResetStyle });

        // IS IMAGE NOT THE SELECTED IMAGE (DON'T COMPARE OWN BOUNDARIES)
        if(selectedImage.props.imageId != `image${m}-${i}`){
          const targetBoundaries = this.getImageBoundaries(m, i);

          const imagePositionX = (lx + relativeContainerWidth / 2) - translateX;
          const imagePositionY = (ly + relativeContainerHeight / 2) - translateY;

          // IS IMAGE IN BOUNDARIES?
          if(imagePositionX > (targetBoundaries.lx) && imagePositionX < (targetBoundaries.ux) &&
            imagePositionY > (targetBoundaries.ly) && imagePositionY < (targetBoundaries.uy)){
              targetImageId = `image${m}-${i}`;
          }
        }
      });
    });

    return targetImageId;
  }

  // Function used to calculate the lower and upper bounds of an image in the collage.
  // m = matrix index
  // i = images index
  getImageBoundaries(m, i){
    const { matrix, direction, width, height } = this.props;

    const relativeContainerWidth = (direction == 'row') ? width / matrix.length : width / matrix[m];
    const relativeContainerHeight = (direction == 'row') ? height / matrix[m] : height / matrix.length;

    const boundries = (direction == 'row') ? {
      lx: relativeContainerWidth * (m), ly: relativeContainerHeight * (i),
      ux: relativeContainerWidth * (m + 1), uy: relativeContainerHeight * (i + 1),
    } : {
      lx: relativeContainerWidth * (i), ly: relativeContainerHeight * (m),
      ux: relativeContainerWidth * (i + 1), uy: relativeContainerHeight * (m + 1),
    };

    return { ...boundries, relativeContainerWidth, relativeContainerHeight };
  }
}

DynamicCollage.defaultProps = {
  borders: 4,
  borderColor: 'white',
  direction: 'row',
  separators: 0,
  backgroundColor: 'white',
  imageSelectedStyle: {
    opacity: 0.6,
  },
  imageSwapStyle: {
    borderColor: 'red',
    borderWidth: 3,
  },
  imageResetStyle: {
    borderWidth: 0,
  }
};

export { DynamicCollage };
