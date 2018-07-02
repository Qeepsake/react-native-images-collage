<p align="center">
  <img src="https://raw.githubusercontent.com/LukeBrandonFarrell/open-source-images/master/react-native-images-collage/react-native-images-collage.png" width="190" height="190">
  <br />
  <a href="https://www.npmjs.com/package/react-native-images-collage" rel="nofollow">
    <img src="https://img.shields.io/npm/v/react-native-images-collage.svg?style=flat-square" alt="version" style="max-width:100%;" />
  </a>
  <a href="https://www.npmjs.com/package/react-native-images-collage" rel="nofollow">
    <img src="http://img.shields.io/npm/l/react-native-images-collage.svg?style=flat-square" alt="license" style="max-width:100%;" />
  </a>
  <a href="https://www.npmjs.com/package/react-native-images-collage" rel="nofollow">
    <img src="http://img.shields.io/npm/dt/react-native-images-collage.svg?style=flat-square" alt="downloads" style="max-width:100%;" />
  </a>

  <hr />
</p>

<img align="left" src="https://raw.githubusercontent.com/LukeBrandonFarrell/open-source-images/master/react-native-images-collage/i3.gif" width="48%" />
<img src="https://raw.githubusercontent.com/LukeBrandonFarrell/open-source-images/master/react-native-images-collage/i4.gif" width="48%" />
<img align="left" src="https://raw.githubusercontent.com/LukeBrandonFarrell/open-source-images/master/react-native-images-collage/i2.gif" width="48%" />
<img src="https://raw.githubusercontent.com/LukeBrandonFarrell/open-source-images/master/react-native-images-collage/i1.gif" width="48%" />

## Update

3.x.x is now live.The component has been rewritten from scratch to use direct manipulation to avoid multiple re-renders and the major issues have been fixed. Some changes include:

- Additional props for greater customisation
- No dependencies!
- Image flickering while panning and scaling has been fixed.
- Added new animations for smooth interaction.

## Install

Install via npm:
```sh
 npm install react-native-images-collage --save
```

## Usage

To use in React Native. Import:
```js
 import { DynamicCollage, StaticCollage } from './react-native-images-collage';
```

### Dynamic Collage

A dynamic collage includes panning, scaling and image arrangement.

```js
  <DynamicCollage
    width={400}
    height={400}
    images={ photos }
    matrix={ [ 1, 1, 1, 1 ] } />
```

### Static Collage

A static collage does not include any panning, scaling or arrangement logic. Use this if you want to render multiple non-interactive collages. Same props as the dynamic collage.

```js
  <StaticCollage
    width={400}
    height={400}
    images={ photos }
    matrix={ [ 1, 1, 1, 1 ] } />
```

### Layouts

Instead of building your own matrix of collage layouts. There is a JSON file you can import which includes multiple layouts. Up to 6 images.
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

- If you want to capture the collage as a single image. Take a look at [react-native-view-shot](https://github.com/gre/react-native-view-shot).
- The number of images has to be equal to the sum of the matrix. e.g. Matrix is [ 1, 2, 1 ] ( 1 + 2 + 1 = 4), there has to be 4 images.
- The component currently only works with URIs; photos on the file system or on a server. It does not work with static images (Although support for static images will be coming soon). To use static images, first save them to the filesystem then pass the URI's to the component.

## Props

| Prop                | Type          | Optional  | Default | Description                                                                             |
| ------------------- | ------------- | --------- | ------- | --------------------------------------------------------------------------------------- |
| width               | float         | No        |         | Width of component. REQUIRED. Used to calculate image boundaries for switching.         |
| height              | float         | No        |         | Height of component. REQUIRED. Used to calculate image boundaries for switching.        |
| images              | array         | No        |         | Images for the collage.                                                                 |
| matrix              | array         | No        |         | An array [ 1, 1, 1 ] equal to the number of images. Used to define the layout.          |
| direction           | string        | Yes       | row     | Direction of the collage: 'row' or 'column'.                                            |
| panningLeftPadding  | number        | Yes       | 15      | Distance image can go beyond the left edge before it is restricted.                     |
| panningRightPadding | number        | Yes       | 15      | Distance image can go beyond the right edge before it is restricted.                    |
| panningTopPadding   | number        | Yes       | 15      | Distance image can go beyond the top edge before it is restricted.                      |
| panningBottomPadding| number        | Yes       | 15      | Distance image can go beyond the bottom edge before it is restricted.                   |
| scaleAmplifier      | number        | Yes       | 1.0     | Amplifier applied to scaling. Increase this for faster scaling of images.               |
| imageStyle          | object        | Yes       | style   | Default image style.                                                                    |
| imageSelectedStyle  | object        | Yes       | style   | The style applied to the image when it has been selected. Long Pressed.                 |
| imageSwapStyle      | object        | Yes       | style   | The style applied to the target image which is being swapped. E.g red borders           |
| imageSwapStyleReset | object        | Yes       | style   | The reverse of imageSwapStyle to reset style after swap. Vital for direct manipulation. |
| seperatorStyle      | object        | Yes       | style   | Style applied to image container. Use border width to create margin between images.     |
| containerStyle      | object        | Yes       | style   | Style applied to the container of the collage. Collage border can be applied here.      |

## Authors

* [**Luke Brandon Farrell**](https://lukebrandonfarrell.com/) - *Author*

## License

This project is licensed under the MIT License
