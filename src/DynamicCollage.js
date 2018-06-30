import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import CollageImage from './CollageImage';

class DynamicCollage extends React.Component {
  constructor(props) {
    super(props);
  }

  renderMatrix(){
    const { matrix, separators, direction, style } = this.props;

    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const sectionDirection = (direction == 'row') ? 'column' : 'row';

    return matrix.map((element, m, array) => {
      const startIndex = m ? array.slice(0, m).reduce(reducer) : 0;

      const images = this.props.images.slice(startIndex, startIndex + element).map((image, i) => {
        return (
          <CollageImage
            key={i}
            source={{ uri: image }}
            style={{ flex: 1, margin: separators }}
            boundaries={ this.getImageBoundaries(m, i) }
            ref={`image${i}`}
            selectedCallback={ this.imageSelected.bind(this) }
            matrixId={m} />
        );
      });

      return (
        <View
          key={m}
          style={{ flex: 1, flexDirection: sectionDirection }}
          ref={`matrix${m}`}>
          { images }
        </View>
      );
    });
  }

  render() {
    const { width, height, borders, borderColor, direction, backgroundColor, containerStyle } = this.props;

    return (
      <View style={[ { width, height }, containerStyle, { borderWidth: borders, borderColor: borderColor, backgroundColor: backgroundColor } ]}>
        <View style={{ flex: 1, flexDirection: direction }}>
          { this.renderMatrix() }
        </View>
      </View>
    );
  }

  imageSelected(matrixId){
    const { matrix } = this.props;

    // Reset the zIndex of all matrices
    matrix.map((element, index) => { this.refs[`matrix${index}`].setNativeProps({ zIndex: 1 }); });

    // Update the zIndex of the matrix which contains the selected image
    this.refs[`matrix${matrixId}`].setNativeProps({ zIndex: 999 });
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

    return boundries;
  }
}

DynamicCollage.defaultProps = {
  borders: 4,
  borderColor: 'white',
  direction: 'row',
  separators: 0,
  backgroundColor: 'white',
};

export { DynamicCollage };
