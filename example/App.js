/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import { DynamicCollage } from 'react-native-images-collage';

const photos = ["https://picsum.photos/400", "https://picsum.photos/400", "https://picsum.photos/400", "https://picsum.photos/400", "https://picsum.photos/400", "https://picsum.photos/400", "https://picsum.photos/400"];

const App = () => {
  const collageRef = useRef(null);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.sectionContainer}>
            <DynamicCollage
              ref={collageRef}
              width={"100%"}
              height={300}
              images={photos}
              matrix={[ 3, 2, 2 ]} 
              onEditButtonPress={(m, i) => {
                collageRef.current.replaceImage(`https://picsum.photos/${(150 + Math.random() * 100).toFixed(0)}`, m, i);
              }}
              EditButtonComponent={() => {
                return <View style={styles.button} />
              }}
              editButtonPosition={"bottom-right"}
              isEditButtonVisible={true}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "blue",
    width: 25,
    height: 25,
    zIndex: 9999
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default App;
