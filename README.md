# Project Title

react-native-photo-collage



## Install

To get started install via npm:
`` npm install react-native-photo-collage --save ``

## Usage

To use in React Native. Import:
`` import { CollageMatrix } from 'react-native-photo-collage'; ``

Then add this to your code:
```
<CollageMatrix
  images={ photos }
  matrix={ [ 1, 1, 1, 1 ] }
  direction={ 'row' } />

```

Instead of building your own matrix of collage layouts, there is a JSON file you can import which support up to 6 photos.
`` import { CollageMatrix, LayoutData } from 'react-native-photo-collage'; ``

You can then access a configuration like so:
`` LayoutData[NumberOfPhotos][i] ``

The number in the first bracket will be the configuration you want to access. E.g. configuration for 5 photos. The second number is the specific layout you want to access e.g. [2, 2, 1]. You will have to inspect the JSON file to find this out.

## Props

**Note:** For this to work as expected, the number of images has to be equal to the result of all numbers in the matrix. e.g. if matrix is [ 1, 2, 1 ] there has to be 4 photos.  

| Prop            | Type          | Optional  | Default | Description                                                                             |
| --------------- | ------------- | --------- | ------- | --------------------------------------------------------------------------------------- |
| images          | array         | No        |         | Images for the collage.                                                                 |
| matrix          | centered      | No        |         | An array like this [ 1, 1, 1 ] equal to the number of images. Used to define the layout |
| separators      | int           | Yes       | 0       | Amount of space between images.                                                         |
| direction       | string        | Yes       | row     | Direction of the collage: 'row' or 'column'.                                            |
| borders         | int           | Yes       | 4       | Width of borders.                                                                       |
| borderColor     | string        | Yes       | white   | Border colour.                                                                          |
| backgroundColor | string        | Yes       | white   | Background color of collage.                                                            |
| containerStyle  | object        | Optional  | 100%    | Style applied to the container of the collage                                           |

## Examples



## Contributing

If you want to issue a PR, go ahead ;)


## Authors

* [**Luke Brandon Farrell**](https://lukebrandonfarrell.com/) - *Initial work*

## License

This project is licensed under the MIT License
