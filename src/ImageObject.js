class ImageObject {
  constructor(url) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.url = url;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.isReset = false;
    this.highlight = false;
  }

  setX(value){
    this.x = value;
  }

  setY(value){
    this.y = value;
  }

  setSize(width, height){
    this.width = width;
    this.height = height;
  }

  setRelativeWidth(value){
    this.relativeWidth = value;
  }

  setRelativeHeight(value){
    this.relativeHeight = value;
  }

  setBoundaries(value){
    this.boundries = value;
  }

  isInBoundaries(selected, x, y){
    if(this.id != selected.id){
      const imagePositionX = (selected.boundries.lx + selected.relativeWidth / 2) + x;
      const imagePositionY = (selected.boundries.ly + selected.relativeHeight / 2) + y;

      if(imagePositionX > (this.boundries.lx) && imagePositionX < (this.boundries.ux) &&
        imagePositionY > (this.boundries.ly) && imagePositionY < (this.boundries.uy)){
        return this.id;
      }
    }

    return false;
  }

  reset(){
    this.isReset = true;

    return this;
  }
}

export default ImageObject;
