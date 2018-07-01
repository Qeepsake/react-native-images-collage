[![npm](https://img.shields.io/npm/v/react-native-images-collage.svg?style=flat-square)](https://www.npmjs.com/package/react-native-images-collage)
[![npm licence](http://img.shields.io/npm/l/react-native-images-collage.svg?style=flat-square)](https://npmjs.org/package/react-native-images-collage)
[![npm downloads](http://img.shields.io/npm/dt/react-native-images-collage.svg?style=flat-square)](https://npmjs.org/package/react-native-images-collage)

<p align="center">
  <img src="https://github.com/LukeBrandonFarrell/open-source-images/blob/master/react-native-images-collage/react-native-images-collage.png" width="140" height="140">
  <h2 align="center">React Native Images Collage</h2>
</p>

<img align="left" src="https://raw.githubusercontent.com/LukeBrandonFarrell/open-source-images/master/react-native-images-collage/i3.gif" width="48%" />
<img src="https://raw.githubusercontent.com/LukeBrandonFarrell/open-source-images/master/react-native-images-collage/i4.gif" width="48%" />
<img align="left" src="https://raw.githubusercontent.com/LukeBrandonFarrell/open-source-images/master/react-native-images-collage/i2.gif" width="48%" />
<img src="https://raw.githubusercontent.com/LukeBrandonFarrell/open-source-images/master/react-native-images-collage/i1.gif" width="48%" />

## Update

3.x.x is now live.The component has been rewritten from scratch to use direct manipulation to avoid multiple rerender and the major issues have been fixed. Some changes include:

- Additional props for greater customisation
- No dependencies!
- Image flickering while panning and scaling has been fixed.
- Added new animations for smooth interaction.

## Install

To get started install via npm:
```sh
 npm install react-native-images-collage --save
```

## Usage

### Dynamic and Static Collage

To use in React Native. Import:
```js
 import { DynamicCollage, StaticCollage } from './react-native-images-collage';
```

Then add this to your code:
```js
  <DynamicCollage
    width={Dimensions.get('window').width / 1.1}
    height={Dimensions.get('window').width / 1.1}
    images={ photos }
    matrix={ [ 1, 1, 1, 1 ] } />
```

StaticCollage does not include any panning, scaling or arrangement logic. Used this is if you want to render multiple non-interactive collages. StaticCollage takes the same props as DynamicCollage.

### Layouts

Instead of building your own matrix of collage layouts. There is a JSON file you can import which includes multiple layouts, up to 6 images.
```js
 import { LayoutData } from 'react-native-images-collage';
```

You can then access a layout like so:
```js
 matrix={ LayoutData[NumberOfImages][i].matrix }
 direction={ LayoutData[NumberOfImages][i].direction }
```

The number in the first bracket will be the configuration you want to access. E.g. configuration for 5 images. The second number is the specific layout you want to access e.g. [2, 2, 1]. You will have to inspect the JSON file to find this out.

### Notes

If you want to capture the collage as a single image. Take a look at [react-native-view-shot](https://github.com/gre/react-native-view-shot).

## Props

**Note:** For this to work as expected, the number of images has to be equal to the result of all numbers in the matrix. e.g. if matrix is [ 1, 2, 1 ] ( 1 + 2 + 1 = 4), there has to be 4 images.  

| Prop            | Type          | Optional  | Default | Description                                                                             |
| --------------- | ------------- | --------- | ------- | --------------------------------------------------------------------------------------- |
| width           | float         | No        |         | Width of component. Not optional. Used to calculate image boundaries for switching      |
| height          | float         | No        |         | Height of component. Not optional. Used to calculate image boundaries for switching     |
| images          | array         | No        |         | Images for the collage.                                                                 |
| matrix          | centered      | No        |         | An array [ 1, 1, 1 ] equal to the number of images. Used to define the layout           |
| separators      | int           | Yes       | 0       | Amount of space between images.                                                         |
| direction       | string        | Yes       | row     | Direction of the collage: 'row' or 'column'.                                            |
| borders         | int           | Yes       | 4       | Width of borders.                                                                       |
| borderColor     | string        | Yes       | white   | Border colour.                                                                          |
| backgroundColor | string        | Yes       | white   | Background color of collage.                                                            |
| containerStyle  | object        | Optional  | 100%    | Style applied to the container of the collage                                           |

## Contributing

There are still a lot of issues in this project. So any PRs would be appreciated.

## Authors

* [**Luke Brandon Farrell**](https://lukebrandonfarrell.com/) - *Author*

## License

This project is licensed under the MIT License
