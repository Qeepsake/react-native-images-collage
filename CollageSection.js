import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

class CollageSection extends React.Component {
  renderImages(){
    const { images, imageStyle } = this.props;
    const { imageStandardStyle } = styles;

    return images.map((element, i) => {
      return <Image key={i} source={{ uri: element }} style={[ imageStandardStyle, imageStyle ]} />;
    });
  }

  render() {
    const { style } = this.props;
    const { collageSectionStyle } = styles;

    return (
      <View style={[ collageSectionStyle, style ]}>
        { this.renderImages() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  collageSectionStyle : {
    flex: 1,
  },
  imageStandardStyle : {
    flex: 1,
  }
});

export { CollageSection };
