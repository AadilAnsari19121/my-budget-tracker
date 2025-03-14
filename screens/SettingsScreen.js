import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import AddItemUserInputModal from './AddItemUserInputModal';
import { TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons,Entypo } from '@expo/vector-icons';
import EnterAmount from './EnterAmount';
import ExtraExpense from './ExtraExpense';
import ClearDataFromLocal from './ClearDataFromLocal';
import { createStackNavigator } from '@react-navigation/stack';
import SectionListDisplay from './SectionListDisplay';
import CrudWithNode from './CrudWithNode';


const Stack = createStackNavigator();
const SettingsHome = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Set Budget')}>
                <Ionicons name="keypad" size={24} color={'#333'} />
                <Text style={styles.title}>Set Budget</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Extra Expenses')} >
                <MaterialCommunityIcons name="cash-remove" size={25} color={'#333'} />
                <Text style={styles.title}>Extra Expenses</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Section List')} >
                <MaterialCommunityIcons name="cash-remove" size={25} color={'#333'} />
                <Text style={styles.title}>Section List</Text>
            </TouchableOpacity>


        </View>
    );
};

const SettingsScreen = () => {

    const handleEnterAmountProcess = async (am,nav) => {
        console.log(am);
        try {
            await AsyncStorage.setItem('BudgetAmount2',JSON.stringify(am));
            await AsyncStorage.setItem('EditAm',JSON.stringify(true));
            nav.goBack(); 
        } catch (error) {
            console.log("edit error",error);
        }
    }
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    height: 90,
                    shadowColor: 'black',
                    elevation: 1,
                    shadowOpacity: 0,
                    shadowOffset: { width: 0, height: 0 },
                },
                headerTitleStyle: {
                    fontSize: 20,
                    color: '#333',
                },
                headerTintColor: '#333',
            }}
        >
            <Stack.Screen name="SettingsHome" component={SettingsHome} options={{title:'Settings'}}/>
            <Stack.Screen
                name="Set Budget"
                children={(props) => <EnterAmount {...props} onProceed={(am) => handleEnterAmountProcess(am, props.navigation)} />}
            />

            <Stack.Screen name='Extra Expenses' component={ExtraExpense} />
            <Stack.Screen name='Section List' component={CrudWithNode}/>
           
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        // justifyContent: 'center',
        alignItems: 'start',
        backgroundColor: '#f8f8f8',
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        paddingLeft: 20,
        borderBottomWidth: 0.2,
        borderBottomColor: "#333",
    },
    title: {
        fontSize: 20,
        marginLeft: 10,
        color: "#333",
        paddingBottom: 2
        // backgroundColor:'red'
    }
});

export default SettingsScreen;
