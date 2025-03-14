import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClearDataFromLocal = () => {
    useEffect(()=>{
        const clearData=async () => {
          try {
            await AsyncStorage.clear();
            console.log("data cleared");
          } catch (error) {
            console.log("data clear error ",error);
          }
        }
        clearData();
      },[]);
  return (
    <View>
      <Text>ClearDataFromLocal</Text>
    </View>
  )
}

export default ClearDataFromLocal

const styles = StyleSheet.create({})