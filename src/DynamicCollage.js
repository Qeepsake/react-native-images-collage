import React from 'react';
import { View, LayoutAnimation } from 'react-native';
import CollageNode from './CollageNode';
import ImageObject from './ImageObject';

class DynamicCollage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
      selectedImage: null,
      moveX: 0,
      moveY: 0,
    };
  }

  componentWillMount(){
    const images = this.props.images.map((image) => {
      return new ImageObject(image);
    });

    this.setState({ images });
  }
  
  componentWillReceiveProps(nextProps) {
    if(this.props.matrix != nextProps.matrix){
      this.reset();
    }
  }

  setMoveImage(image){ this.setState({ selectedImage: image, moveX: 0, moveY: 0 }); }
  unsetMoveImage(){ this.setState({ selectedImage: null, moveX: 0, moveY: 0 }); }

  moveImage(translateX, translateY){
    const { images, selectedImage } = this.state;

    if(selectedImage){
      images.map((image) => {
        if(id = this.isOver(image, selectedImage)){
          image.highlight = true;
        } else {
          image.highlight = false;
        }
      });
    }

    this.setState({ moveX: translateX, moveY: translateY });
  }
  
  onRelease(){
    const { images, selectedImage } = this.state;
    
    if(selectedImage){
      images.map((image) => {
        if(id = this.isOver(image, selectedImage)){
          image.highlight = false;
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          this.setState({ images: this.swapIndicesById(this.state.images, id, selectedImage.id)});
        }
      });
    }
    
    this.unsetMoveImage();  
  }
  
  isOver(image, selectedImage){
    return image.isInBoundaries(selectedImage, -this.state.moveX, -this.state.moveY);
  }
  
  reset(){
    const { images } = this.state;
  
    const resetImages = images.map((image) => {
      return image.reset();
    });
  
    this.setState({ images: resetImages });
  }

  renderMatrix(){
    const { matrix, separators, direction, width, height, style } = this.props;
    const { selectedImage, moveX, moveY } = this.state;

    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const sectionDirection = (direction == 'row') ? 'column' : 'row';

    return matrix.map((element, m, array) => {
      const startIndex = m ? array.slice(0, m).reduce(reducer) : 0;

      const images = this.state.images.slice(startIndex, startIndex + element).map((image, i) => {
        const selected = selectedImage ? (selectedImage.id == image.id) : false;

        const relativeContainerWidth = (direction == 'row') ? width / matrix.length : width / matrix[m];
        const relativeContainerHeight = (direction == 'row') ? height / matrix[m] : height / matrix.length;

        const boundries = (direction == 'row') ? {
          lx: relativeContainerWidth * (m), ly: relativeContainerHeight * (i),
          ux: relativeContainerWidth * (m + 1), uy: relativeContainerHeight * (i + 1),
        } : {
          lx: relativeContainerWidth * (i), ly: relativeContainerHeight * (m),
          ux: relativeContainerWidth * (i + 1), uy: relativeContainerHeight * (m + 1),
        };

        image.setBoundaries(boundries);
        image.setRelativeWidth(relativeContainerWidth);
        image.setRelativeHeight(relativeContainerHeight);

        return (
          <CollageNode key={i}
            image={ image }
            containerWidth={ relativeContainerWidth }
            containerHeight={ relativeContainerHeight }
            move={this.moveImage.bind(this)}
            selected={selected ? true : false}
            moveX={selected ? this.state.moveX : 0}
            moveY={selected ? this.state.moveY : 0}
            onPress={() => console.log('focus')}
            onLongPress={() => this.setMoveImage(image)}
            onPressOut={() => this.onRelease()}
            style={{ margin: separators }} />
        );
      });

      return (
        <View key={m} style={{ flex: 1, flexDirection: sectionDirection }}>
          { images }
        </View>
      );
    });
  }

  swapIndicesById(array, id1, id2) {
    const newArray = array.slice();
    const index1 = array.findIndex((image) => image.id == id1);
    const index2 = array.findIndex((image) => image.id == id2);

    newArray[index1] = array[index2];
    newArray[index2] = array[index1];

    return newArray;
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

DynamicCollage.defaultProps = {
  borders: 4,
  borderColor: 'white',
  direction: 'row',
  separators: 0,
  backgroundColor: 'white',
};

export { DynamicCollage };
