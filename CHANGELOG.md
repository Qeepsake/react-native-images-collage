## > 3.2.6

See releases: [https://github.com/Qeepsake/react-native-images-collage/releases](https://github.com/Qeepsake/react-native-images-collage/releases)

## 3.2.6

- Fixed an issue with image swapping [#19](https://github.com/Qeepsake/react-native-images-collage/pull/16).

## 3.2.5 (February 2019)

- Added an id to each CollageImage so it can be uniquely identified.
- Added the image initial size and source size to the state so it can be updated.
- Each axis of image scales independently as ratio depending on image size (width / height).
- Improved scale anchor point to scale from the point the scale started at.
- Fixed an issue with images being cropped while scalling then updating the matrix (initial width/height was not being updated).

## 3.2.4 (February 2019)

- Fixed long press not being triggered on single touch.
- Added `longPressSensitivity` back to the library, now works reliably and accepts an float of 1 (low) to 10+ (high) to control the sensitivity of the long press.
- Clears timeout when component is unmounted to prevent any memory leaks.
- Added scaling anchor point so images scale from the center. Resolves [#11](https://github.com/lukebrandonfarrell/react-native-images-collage/issues/11).

## 3.2.3 (February 2019)

- Fixed auto-positioning issue when switching layout direction caused by image animation not being stopped.

## 3.2.2 (February 2019)

- Fixed images being cropped while scaling (Now scales by initial ratio).

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
