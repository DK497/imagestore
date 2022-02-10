import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet,BackHandler ,Alert } from "react-native";
import FormContainer from "../Form/FormContainer";
import Input from "../Form/Input";
import Error from "../Form/Error";
import baseURL from "../../assets/baseUrl"
import jwt_decode from 'jwt-decode'
import { Icon } from 'react-native-elements'
import {
  Button } from "native-base"


const Login = (props) => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hey Wait!", "Are you sure you want exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loadingsvg, setLoadingsvg] = useState(false);
  const [logintext, setLogintext] = useState("LOGIN");



  const handleSubmit = () => {
    const user = {
      email,
      password,
    };

    if (email === "" || password === "") {
      setError("Please fill in your credentials");
    } else {

      fetch(`${baseURL}user/login`, {
        method: "POST",
        // to convert object to string
        body: JSON.stringify(user),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // successful login
          if (data) {
            console.log("qwe");
            // data has two fields user having storelist and token
            // setStoreslist(stores);
            const token = data.token;
            const decoded = jwt_decode(token);
            setLoadingsvg(false);
            setLogintext('LOGIN');
          
            props.navigation.navigate('Shops',{storelist:data.stores})
           
          } else {
            // if we dont have data
            alert("data sent on login is null try logging again");
          }
          
        })
        .catch((err) => {
          
          setLoadingsvg(false)
          setLogintext('LOGIN') 
          alert(`${err.name}:Please provide correct credentials`)
         


        });

    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: '#E0BFB8' }}>
      <View style={{ flexDirection: 'row', elevation: 15, top: "15%", alignSelf: 'center', marginRight: 10, backgroundColor: '#D8BFD8' }}>

        <Icon
          raised
          name='shopping-bag'
          type='feather'
          color='#f50'
          onPress={() => console.log('login')} />
        <Text style={{
          color: 'black',
          fontSize: 30, color: '#722F37', padding: 10
        }}>Image Store</Text>
      </View>

      <FormContainer title={`${logintext}`} >
        <Input
          placeholder={"Enter Email"}
          name={"email"}
          id={"email"}
          value={email}
          onChangeText={(text) => { setEmail(text.toLowerCase()); setError();setLoadingsvg(false);setLogintext('LOGIN') }}
        />
        <Input
          placeholder={"Enter Password"}
          name={"password"}
          id={"password"}
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => { setPassword(text); setError();setLoadingsvg(false);setLogintext('LOGIN')  }}
        />
       
        <View style={{alignItems:'center'}}>
        {error ? <Error message={error} /> : null}
            <Button size="lg"  colorScheme="primary"
            onPress={() => {handleSubmit();setLoadingsvg(true);setLogintext('...Signing IN') }}
            variant="subtle" isLoading={loadingsvg} spinnerPlacement="end" 
            isLoadingText="Signing In">
        Log In
      </Button>
                </View>

      </FormContainer>
    </View>

  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    alignItems: "center",
  },
  middleText: {
    marginBottom: 20,
    alignSelf: "center",
  },
});

export default Login;
