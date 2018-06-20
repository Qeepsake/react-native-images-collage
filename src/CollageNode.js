/* @flow */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import CollageImage from './CollageImage';

class CollageNode extends React.Component {
  render() {
    const {
      image, containerWidth, containerHeight,
      move, moveX, moveY, selected, swapped,
      onPress, onLongPress, onPressOut, style
    } = this.props;
    const movingImageStyle = selected ? styles.moveImageStyle : {};
    const highlightImageStyle = image.highlight ? styles.highlightImageStyle : {};
    const opacity = selected ? 0.8 : 1.0;

    return (
      <View style={[ {
        flex: 1,
        overflow: 'hidden',
        transform: [
          { translateX: -moveX },
          { translateY: -moveY }
        ],
      }, movingImageStyle, highlightImageStyle, style ]}>
        <CollageImage
          image={ image }
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          onPress={onPress}
          onLongPress={onLongPress}
          onPressOut={onPressOut}
          opacity={opacity}
          selected={selected}
          move={move} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  moveImageStyle : {
    borderColor: 'white',
    borderWidth: 2,
    zIndex: 2,
  },
  highlightImageStyle: {
    borderColor: 'red',
    borderWidth: 3,
  }
});

export default CollageNode;
