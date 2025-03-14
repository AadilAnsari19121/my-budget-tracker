import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';

const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => 
                ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#333',
                tabBarInactiveTintColor: 'gray',
                headerTitleStyle: { fontSize: 20 },
                headerStyle: {
                    height: 90,
                    shadowColor: 'black', // Removes shadow
                    elevation: 1, // Removes shadow for Android
                    shadowOpacity: 0, // Removes shadow for iOS
                    shadowOffset: { width: 0, height: 0 }, // Optional: Ensures no shadow offset
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} options={{headerShown:false}}/>
        </Tab.Navigator>
    );
};

export default Tabs;
