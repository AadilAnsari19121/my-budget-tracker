import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native';
import axios from 'axios';
const Basic_Api_Url='http://192.168.0.129:3000';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CrudWithNode = () => {
    const[fullName,setFullName]=useState(null);
    const[phoneNumber,setPhoneNumber]=useState(null);
    const[email,setEmail]=useState(null);


    useEffect(()=>{
      const getData=async()=>{
        try {
          const data=await AsyncStorage.getItem("hello");
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      };

      getData();
    },[]);


    const addData = async () => {
       
        try {
            await AsyncStorage.setItem("hello", fullName);
        } catch (error) {
            console.log("❌ Error:", error.response ? error.response.data : error.message);
        }
    };
    
  return (
    <View style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <Text style={{fontSize:25,fontWeight:'bold'}}>Add employee data</Text>
      <TextInput
      value={fullName}
      placeholder='Full Name'
      onChangeText={(value)=>setFullName(value)}
      style={{fontSize:18,backgroundColor:'white',width:'80%',textAlign:'left',padding:5,borderBottomColor:'#333',borderBottomWidth:1,borderRadius:5,marginTop:15}}/>

<TextInput
      value={phoneNumber}
      placeholder='Phone Number'
      onChangeText={(value)=>setPhoneNumber(value)}
      style={{fontSize:18,backgroundColor:'white',width:'80%',textAlign:'left',padding:5,borderBottomColor:'#333',borderBottomWidth:1,borderRadius:5,marginTop:15}}/>

<TextInput
      value={email}
      placeholder='Email'
      onChangeText={(value)=>setEmail(value)}
      style={{fontSize:18,backgroundColor:'white',width:'80%',textAlign:'left',padding:5,borderBottomColor:'#333',borderBottomWidth:1,borderRadius:5,marginTop:15}}/>


      <TouchableOpacity style={{width:'70%',height:50,marginTop:35,backgroundColor:'blue',borderRadius:15,justifyContent:'center'}} onPress={addData}><Text style={{fontSize:18,color:'white',textAlign:'center'}}>Add Data</Text></TouchableOpacity>
    </View>
  )
}

export default CrudWithNode

const styles = StyleSheet.create({})