## 3.2.1 (February 2019)

- Fixed scaling issues on Android (App crashing when scaling because `touchBank` was undefined).

## 3.2.0 (January 2019)

- Removed the `longPressSensitivity` property as it did not work as intended and caused complications with swapping.
- Fixed the PanResponder to respond to single touches by changing the `onStartShouldSetPanResponder` and `onStartShouldSetPanResponderCapture` to return true.
- Fixed the peer-dependencies warning.
- Documented the cause of [issue #12](https://github.com/lukebrandonfarrell/react-native-images-collage/issues/12).

## 3.1.8 (January 2019)

- Removed the `<TouchableWithoutFeedback />` which wraps each image to enable a long press and replaced it with a custom PanResponder long press timer.
    - New prop `longPressDelay` this sets the time delay for long press to be detected.
    - New prop `longPressSensitivity` this is the sensitivity of the long press.
- Scaling is now retained by default when swapping images, but can be controlled with `retainScaleOnSwap`.

## 3.1.7 (January 2019)

- Reset image panning to 0 when layout matrix prop is updated. Fixes [#6](https://github.com/lukebrandonfarrell/react-native-images-collage/issues/6).

## 3.1.6 (January 2019)

- Images will auto-resize to fit the container when the matrix prop is updated. Partially fixes [#6](https://github.com/lukebrandonfarrell/react-native-images-collage/issues/6).

## 3.1.5 (January 2019)

- Added `zIndex` to be updated for the selected image. Fixes [#5](https://github.com/lukebrandonfarrell/react-native-images-collage/issues/5).

## 3.1.4 (January 2019)

- Swapping images now automatically adjusts size and panning. Partially fixes [#6](https://github.com/lukebrandonfarrell/react-native-images-collage/issues/6).

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
