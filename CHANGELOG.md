## 3.1.4 (January 2019)

- Swapping images now automatically adjusts size and panning. Fixes [#6](https://github.com/lukebrandonfarrell/react-native-images-collage/issues/6).

## 3.1.3 (January 2019)

- Added a `calculateAspectRatioFit` method to calculate image size on load. This automatically sizes images to fit the container, and prevents images from being loaded at full width/height.

## 3.1.2 (January 2019)

- Removed `getDerivedStateFromProps` as it was breaking image swapping.
- Supported swapping of mixed sources of URI and `require`. Fixes [#10](https://github.com/lukebrandonfarrell/react-native-images-collage/issues/10). This was accomplished by using a conditional `Image.resolveAssetSource(image)` in the `findIndex` method. 

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
