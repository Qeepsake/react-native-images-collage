/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Alert,
} from 'react-native';
import { DynamicCollage } from 'react-native-images-collage';
import { Colors } from 'react-native/Libraries/NewAppScreen';

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
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
