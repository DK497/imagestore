import React from 'react';
import { ScrollView, StyleSheet, Text,View } from 'react-native';
import { Icon } from 'react-native-elements'



const FormContainer = (props) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{flexDirection:'row',marginRight:10, backgroundColor:'#CCCCFF', borderRadius:30}}>
            <Icon
  raised
  name='key'
  type='feather'
  color='#7FFFD4'
  onPress={() => console.log('hello')} />
            <Text style={styles.title}>{props.title}</Text>
            </View>
           
            {props.children}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop:'34%',
        // marginBottom: "25%",
        padding:30,
        // width: width,
        justifyContent: 'center',
        alignItems: 'center',
       borderWidth:1,
       borderColor:'#702963',
       elevation:5,
       borderRadius:3

    },
    title: {
        fontSize: 30,
        color:'#841584',
       
        paddingHorizontal:20,
        paddingTop:10,
       
    }
})

export default FormContainer;