## 3.1.0 (December 2018)

- Added support for local images using `resolveAssetSource`. To use local images pass `require(".my-image.jpg")` instead of a URL. Closed [#4](https://github.com/lukebrandonfarrell/react-native-images-collage/issues/4).
 
## 3.0.4 (December 2018)

- Fixed issue with width and height resolving to NaN when they are set as a percentages.

## 3.0.0 (June 2018)

The component has been rewritten from scratch to use direct manipulation to avoid multiple re-renders and the major issues have been fixed. Some changes include:

- Additional props for greater customisation
- No dependencies!
- Image flickering while panning and scaling has been fixed.
- Added new animations for smooth interaction.
