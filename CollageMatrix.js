import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { CollageSection } from './CollageSection';
import LayoutData from './layouts.json';

class CollageMatrix extends React.Component {
  renderMatrix(){
    const { matrix, images, separators, direction, style } = this.props;
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    return matrix.map((element, i, array) => {
      const startIndex = i ? array.slice(0, i).reduce(reducer) : 0;

      return (
        <CollageSection
          key={i}
          images={ images.slice(startIndex, startIndex + element) }
          style={[ style ]}
          imageStyle={{ margin: separators }} />
      );
    });
  }

  render() {
    const { borders, borderColor, direction, containerStyle } = this.props;
    const { collageMatrixStyle } = styles;

    return (
      <View style={[ collageMatrixStyle, containerStyle, { borderWidth: borders, borderColor: borderColor, backgroundColor: backgroundColor } ]}>
        <View style={{ flex: 1, flexDirection: direction }}>
          { this.renderMatrix() }
        </View>
      </View>
    );
  }
}

CollageMatrix.defaultProps = {
  borders: 4,
  borderColor: 'white',
  direction: 'row',
  separators: 0,
  backgroundColor: 'white',
};

const styles = StyleSheet.create({
  collageMatrixStyle : {
    width: '100%',
    height: '100%',
  },
});

export { CollageMatrix, LayoutData };
