import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, BackHandler, Alert } from 'react-native'
import { Input, Stack, Center, Heading, NativeBaseProvider } from "native-base"
import { Badge, Divider, Icon } from 'react-native-elements'
import { Picker } from '@react-native-picker/picker';

// baseURl
import baseURL from "../../assets/baseUrl";
import axios from 'axios'


const Shop = (props) => {

    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;
    const [listRendered, setListRendered] = useState([]);
    const [searchItem, setSearchItem] = useState("");
    const [searchList, setSearchList] = useState([]);
    const [filterCategory, setFilterCategory] = useState("")
    const [filterBasedList, setFilterBasedList] = useState()
    const [routeValue, setRouteValue] = useState("");


    
    // passed from previous screen
    const { storelist } = props.route.params;
    


    useEffect(() => {
        const backAction = () => {
            Alert.alert("Hold on!", "Are you sure you want SignOut?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "YES", onPress: () => props.navigation.navigate('Login') }
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        // axios
        // .get(`${baseURL}user/${userID}/storelist`)
        // .then((res) => {
        //     console.log("useID:",userID)
        //     // console.log("storedat:",res.data)
        //     const dataofstorelist=res.data
        //     setStoresOfUser(dataofstorelist);
        //     gettingUserSpecificStorelist();
        // })
        // .catch(err => console.log("ShopScreen:Store of user APi cal error"))
    axios
        .get(`${baseURL}stores`)
        .then((res) => {
            // we get storelist for both users and 
            // we convert list into objects
            const objectofshops=convertArrayToObject(res.data, 'id')
            
            // storelist is specific to user
            let array=[];
            storelist.forEach(i=>{
                // setListRendered(oldArray => [...oldArray, objectofshops[i]]);
                array.push(objectofshops[i])
            });
           
            setListRendered(array);
            setSearchList(listRendered);
            setFilterBasedList(searchList);
            


        })
        .catch(err => console.log("ShopScreen:Store APi cal error"))
        

        


        return () => {
        backHandler.remove();
      
       
    };
    }, []);
  
    // always update filterBasedList when searchList chnages
 
    const convertArrayToObject = (array, key) => {
        const initialValue = {};
        return array.reduce((obj, item) => {
            return {
                ...obj,
                [item[key]]: item,
            };
        }, initialValue);
    };



    const filteringElements = (category, value) => {

        if (category === 'route') {
            setFilterBasedList(
                // searchList.filter(i => stores.stores[i][`${category}`] === (value))
                searchList.filter(i=>i[`${category}`]===value )
            )
        }
        else
            setFilterBasedList(
                // searchList.filter(i => stores.stores[i][`${category}`].toLowerCase().includes(value.toLowerCase()))
                searchList.filter(i=>i[`${category}`].toLowerCase().includes(value.toLowerCase()))
                )
       
    }

    return (
        <View style={{ backgroundColor: '#CECEDA',flex:1 }}>

            <Text style={{
                fontSize: 20, backgroundColor: '#000', textAlign: 'center',
                padding: '5%', fontWeight: 'bold', marginBottom: '2%'
            }}>STORES</Text>
            <View>
                <Input variant="rounded" size="md"

                    onChangeText={(i) => {
                        setSearchItem(i);
                        // filteringElements("name", searchItem);
                        setSearchList(
                            // Object.keys(stores.stores).filter(i => 
                            //     stores.stores[i].name.toLowerCase().includes(searchItem.toLowerCase()))
                           listRendered.filter(i=>i.name.toLowerCase().includes(searchItem.toLowerCase()))
                        );
                        setFilterBasedList(searchList);
                       
                    }}

                    InputLeftElement={<Icon
                        reverse size={16} ml='2'
                        name='search-sharp'
                        type='ionicon'
                        color='#517fa4'
                    />}
                    placeholder="Search Shops" />

                <View style={{ flexDirection: 'row' }}>
                    <Picker style={{ width: "50%" }}
                        selectedValue={filterCategory}
                        onValueChange={(itemValue, itemIndex) =>
                            {
                            setFilterCategory(itemValue);
                            setFilterBasedList(searchList);
                            setRouteValue("");
                            
                        }
                        }>
                       
                        <Picker.Item label="None" value="" />
                        <Picker.Item label="Area" value="area" />
                        <Picker.Item label="Type" value="type" />
                        <Picker.Item label="Route" value="route" />

                    </Picker>

                    {filterCategory !== "" && (filterCategory === 'route' ?
                        (<Picker style={{ width: "50%" }}
                            selectedValue={routeValue}
                            onValueChange={(itemValue, itemIndex) => {
                                if (itemValue !== "") {
                                    filteringElements("route", itemValue);
                                    setRouteValue(itemValue);
                                }
                                else {
                                    setRouteValue(itemValue);
                                    setFilterBasedList(searchList)
                                }



                            }

                            }>
                            <Picker.Item label="None" value="" />
                            <Picker.Item label="R1" value="r1" />
                            <Picker.Item label="R2" value="r2" />
                            <Picker.Item label="R3" value="r3" />
                            <Picker.Item label="R4" value="r4" />
                            <Picker.Item label="R5" value="r5" />
                            <Picker.Item label="R6" value="r6" />

                        </Picker>) :
                        <Input style={{ width: "40%" }} variant="underlined"
                            onChangeText={(text) => filteringElements(filterCategory, text)}
                            placeholder="Filter Value" />)
                    }

                </View>


            </View>



            <ScrollView contentContainerStyle={{
                backgroundColor: '#CECEDA',
                flexDirection: 'row',
                flexWrap: 'wrap'
            }}>

                {(searchItem === "" ? listRendered : filterBasedList).map((key, index) => {
                    return (
                        <TouchableOpacity key={index}
                            onPress={() => props.navigation.navigate('Images',{sid:key._id,storelist:storelist,shopname:key.name})}
                            style={{
                                borderWidth: 3,
                                backgroundColor: (index % 2 === 0) ? '#464663' : '#060623', borderRadius: 5,
                                height: deviceHeight / 4, padding: '2%',
                                width: '45%', marginVertical: 10, marginHorizontal: 8,
                                borderColor: (index % 2 === 0) ? '#060623' : '#464663',
                                justifyContent: 'space-evenly'
                            }}>
                            <Badge
                                textStyle={{ color: '#060623' }}
                                containerStyle={{ position: 'absolute', top: -4, left: -4 }}
                                // value={stores.stores[key].area}
                                value={key.area}
                                status={(index % 2 === 0) ? 'success' : 'warning'} />
                            <Badge
                                textStyle={{ color: '#060623' }}
                                containerStyle={{ position: 'absolute', bottom: -4, right: -4 }}
                                value={key.route}
                                status='primary' />



                            <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#B6B6C7', textAlign: 'center' }}>
                                {key.name}
                            </Text>

                            <Divider orientation="horizontal" />
                            <Text style={{ fontSize: 10, color: '#B6B6C7', textAlign: 'center', fontStyle: 'italic' }}>
                                {key.address}
                            </Text>


                        </TouchableOpacity>



                    )
                }


                )
                }
            </ScrollView>
        </View>

    )
}

export default Shop;

const styles = StyleSheet.create({})
