import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, Dimensions, ScrollView,BackHandler, Alert } from 'react-native'
import baseURL from "../../assets/baseUrl";
import axios from 'axios'
import ImagePicker1 from "../ImagePicker1"
import mime from 'mime';
import {
    Button,
    Divider,
} from "native-base"
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const ImageScreen = (props) => {


    const { sid ,storelist,shopname} = props.route.params;
    const [imgList, setImgList] = useState([]);
    const [imgPicker, setImgPicker] = useState("");
    const [loadingsvg, setLoadingsvg] = useState(false);
    const [reloadimagedata, setReloadimagedata] = useState(true);

    useEffect(() => {
        const backAction = () => {
            Alert.alert("Hey Wait!", "Are you sure you want to go back to store select screen?", [
              {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
              },
              { text: "YES", onPress: () => props.navigation.navigate('Shops',{storelist:storelist}) }
            ]);
            return true;
          };
      
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
      
          
        axios
            .get(`${baseURL}stores/${sid}/image`)
            .then((res) => {

                

                setImgList(res.data)



            })
            .catch(err => console.log("ImageScreen:Store APi cal error", err.message))

        return () => {
            backHandler.remove();
        }
    }, [reloadimagedata]);

    const onSubmit = () => {
        setLoadingsvg(true);
        if (imgPicker === "") {
            alert("Selct or capture an image")
            setTimeout(() => {
                setLoadingsvg(false);
            }, 500);
        } else {
            let formData = new FormData();
            const newImageUri = "file:///" + imgPicker.split("file:/").join("");
            console.log("image:",imgPicker)
            formData.append("image", {
                uri: newImageUri,
                type: mime.getType(newImageUri),
                name: newImageUri.split("/").pop()
            });

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }

            axios
                .put(`${baseURL}stores/${sid}`, formData, config)
                .then((res) => {
                    if (res.status == 200 || res.status == 201) {
                        alert("Upload done succesfully");

                        setTimeout(() => {
                            setReloadimagedata(!reloadimagedata);
                        }, 500)
                    }
                })
                .catch((error) => {
                    alert("Upload not done");
                    
                })
                setTimeout(() => {
                    setLoadingsvg(false);
                }, 500)
               
               
        }


    }

    return (
        <>
         <Text style={{
                fontSize: 20, backgroundColor: '#000', textAlign: 'center',
                padding: '5%', fontWeight: 'bold'
            }}>Capture or Open Storage</Text>
            <Text style={{color:'#FFDEAD',padding: '3%',
                fontSize: 18, backgroundColor: "#CD7F32", textAlign: 'center', fontWeight: 'bold'
            }}>{shopname}</Text>
              <Text style={{color:'grey',
                fontSize: 14, backgroundColor: "#FFDEAD", textAlign: 'center', fontWeight: 'bold'
            }}>Tap to capture and Longpress to Open Library</Text>
            
        <ScrollView style={{ flex: 1, backgroundColor: "#FFDEAD" }}>
           

            <View style={styles.imagePicker}>
                <ImagePicker1
                    defaultimg={imgPicker}
                    img={(value) => setImgPicker(value)}
                />
            </View>
            <View style={{ alignItems: 'center' }}>
                <Button size="lg" variant="subtle" colorScheme="danger"
                    onPress={() => onSubmit()}
                    isLoading={loadingsvg} spinnerPlacement="end"
                    isLoadingText="...Uploading">
                    Upload
      </Button>
            </View>


            {imgList.map((i, index) => {

                return (
                    <ScrollView key={index}>
                        <Image
                            style={styles.tinyLogo}
                            source={{
                                uri: i.uri
                            }}
                        />

                    </ScrollView>
                )
            })}
        </ScrollView>
        </>
    )
}

export default ImageScreen;

const styles = StyleSheet.create({

    tinyLogo: {
        width: deviceWidth / 1.04,
        height: deviceHeight / 5,
        marginVertical: deviceHeight / 100,
        marginHorizontal: deviceWidth / 70,
        borderWidth: 3, borderColor: '#301934',
        borderRadius: 4
    },
    imagePicker: {
        width: 100,
        height: 100,
        borderStyle: "solid",
        alignSelf: 'center',
        borderWidth: 8,
        padding: 0,
        justifyContent: "center",
        borderRadius: 100,
        borderColor: "#E0E0E0",
        elevation: 10,
        marginBottom: 10
    }
});
