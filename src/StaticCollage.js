import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

class StaticCollage extends React.Component {
  renderMatrix(){
    const { matrix, separators, direction, width, height, style } = this.props;

    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const sectionDirection = (direction == 'row') ? 'column' : 'row';

    return matrix.map((element, m, array) => {
      const startIndex = m ? array.slice(0, m).reduce(reducer) : 0;

      const images = this.props.images.slice(startIndex, startIndex + element).map((image, i) => {
        return <Image key={i} source={{ uri: image }} style={{ flex: 1, margin: separators }} />;
      });

      return (
        <View key={m} style={{ flex: 1, flexDirection: sectionDirection }}>
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
}

StaticCollage.defaultProps = {
  borders: 4,
  borderColor: 'white',
  direction: 'row',
  separators: 0,
  backgroundColor: 'white',
};

export { StaticCollage };
