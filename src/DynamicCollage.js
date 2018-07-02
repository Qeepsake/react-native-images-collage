import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import CollageImage from './CollageImage';

class DynamicCollage extends React.Component {
  state = { images: null };

  static getDerivedStateFromProps(props, state) {
    if (state.images !== props.images) {
      return {
         images: props.images,
      }
    }

    return null;
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
            style={[ { flex: 1 }, this.props.imageStyle ]}
            boundaries={ this.getImageBoundaries(m, i) }
            translationStartCallback={ this.imageTranslationStart.bind(this) }
            translationUpdateCallback={ this.imageTranslationUpdate.bind(this) }
            translationEndCallback={ this.imageTranslationEnd.bind(this) }
            matrixId={m}
            imageId={`image${m}-${i}`}
            imageSelectedStyle={ this.props.imageSelectedStyle }
            panningLeftPadding={this.props.panningLeftPadding}
            panningRightPadding={this.props.panningRightPadding}
            panningTopPadding={this.props.panningTopPadding}
            panningBottomPadding={this.props.panningBottomPadding}
            scaleAmplifier={this.props.scaleAmplifier} />
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
    const { width, height, matrix, images, direction, containerStyle } = this.props;

    // CHECK IF MATRIX = NUMBER OF PHOTOS
    if(matrix.reduce((a, b) => a + b, 0) != images.length){
      throw new Error('Number of images must be equal to sum of matrix. E.g. Matrix = [ 1, 2 ] = 3. Images.length = 3 ');
    }

    return (
      <View style={[ { width, height }, containerStyle ]}>
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
    const { matrix, images, seperatorStyle } = this.props;
    const { translateX, translateY } = selectedImage.state;
    const { lx, ly, relativeContainerWidth, relativeContainerHeight } = selectedImage.props.boundaries;

    let targetImageId = null;

    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    matrix.map((element, m, array) => {
      const startIndex = m ? array.slice(0, m).reduce(reducer) : 0;

      images.slice(startIndex, startIndex + element).map((image, i) => {
        // RESET STYLES
        this.refs[`image${m}-${i}`].refs['imageContainer'].setNativeProps({
          style: { ...this.props.imageResetStyle, ...seperatorStyle }
        });

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
  // VARIABLES --------------
    direction: 'row', // DIRECTION OF THE COLLAGE
    panningLeftPadding: 15, // LEFT PANNING PADDING
    panningRightPadding: 15, // RIGHT PANNING PADDING
    panningTopPadding: 15, // TOP PANNING PADDING
    panningBottomPadding: 15, // BOTTOM PANNING PADDING
    scaleAmplifier: 1.0, // ADJUST SCALING

  // STYLE --------------
    containerStyle: {
      borderWidth: 4,
      borderColor: 'black',
      backgroundColor: 'white',
    },
    imageStyle: {}, // DEFAULT IMAGE STYLE

    // STYLE OF SEPERATORS ON THE COLLAGE
    seperatorStyle: {
      borderWidth: 2,
      borderColor: 'white',
    },

    // IMAGE SELECTED
    imageSelectedStyle: {
      opacity: 0.6,
    },

    // IMAGE SWAP
    imageSwapStyle: {
      borderColor: '#EB4A4A',
      borderWidth: 4,
    },
    imageSwapStyleReset: {
      borderWidth: 0,
    } // RESET ANY STYLE APPLIED WITH imageSwapStyle
};

DynamicCollage.propTypes = {
  images: PropTypes.array,
  matrix: PropTypes.array,
  direction: PropTypes.oneOf(['row', 'column']),
  panningLeftPadding: PropTypes.number, // LEFT PANNING PADDING
  panningRightPadding: PropTypes.number, // RIGHT PANNING PADDING
  panningTopPadding: PropTypes.number, // TOP PANNING PADDING
  panningBottomPadding: PropTypes.number, // BOTTOM PANNING PADDING
  scaleAmplifier: PropTypes.number, // ADJUST SCALING
};

export { DynamicCollage };
