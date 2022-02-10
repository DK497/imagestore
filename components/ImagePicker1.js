import React, { useState, useEffect } from 'react';
// Import required components
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';

import Icon from "react-native-vector-icons/FontAwesome"

const ImagePicker1 = (props) => {
  let isCameraPermitted;
  let isStoragePermitted;


  const [mainImage, setMainImage] = useState("");
  // console.log(mainImage)

  useEffect(() => {
    // setMainImage(props.defaultimg)   
// to get camera access permission
    async () => {
      isCameraPermitted = await requestCameraPermission();
      isStoragePermitted = await requestExternalWritePermission();

      if (!(isCameraPermitted && isStoragePermitted)) {
        alert("Sorry, we need camera roll permissions to make this work!")

      }
    }

    return () => {
      // setMainImage() 

    }
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };

      launchCamera(options, (response) => {
        // console.log('Response = ', response);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        // console.log('base64 -> ', response.base64);
        // console.log('uri -> ', response.uri);
        // console.log('width -> ', response.width);
        // console.log('height -> ', response.height);
        // console.log('fileSize -> ', response.fileSize);
        // console.log('type -> ', response.type);
        // console.log('fileName -> ', response.fileName);
        else{
          setMainImage(response.assets[0].uri);
          props.img(response.assets[0].uri);
          return;
        }
        
      });
    
  };

  const chooseFile = (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      allowEditing: true
    };
    launchImageLibrary(options, (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      // console.log('base64 -> ', response.base64);
      // console.log('uri -> ', response.uri);
      // console.log('width -> ', response.width);
      // console.log('height -> ', response.height);
      // console.log('fileSize -> ', response.fileSize);
      // console.log('type -> ', response.type);
      // console.log('fileName -> ', response.fileName);
      setMainImage(response.assets[0].uri);
      props.img(response.assets[0].uri);
      // console.log('fileName -> ', response.assets[0].uri);
    });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Image style={styles.image} source={{ uri: mainImage||props.defaultimg }} />

      <TouchableOpacity activeOpacity={0.5} 
        // onPress={() => chooseImage('photo')}
        onPress={() => captureImage('photo')}
        onLongPress={() => chooseFile('photo')}
        style={styles.imagePicker}>
          
        <Icon style={{ color: "#FA8072" }} name="camera" />
      </TouchableOpacity>

    </SafeAreaView>
  );
};

export default ImagePicker1;

const styles = StyleSheet.create({
  imageContainer: {
    width: 200,
    height: 200,
    borderStyle: "solid",
    borderWidth: 8,
    padding: 0,
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "#E0E0E0",
    elevation: 10
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100
  },
  imagePicker: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "grey",
    padding: 8,
    borderRadius: 100,
    elevation: 20
  }
});