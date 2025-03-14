import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window'); // Device width for proper layout

// Custom Bottom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View style={styles.tabBarContainer}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;
                const iconName = route.name === 'Home' ? 'home' : 'settings';

                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => navigation.navigate(route.name)}
                        style={[styles.tabButton, isFocused && styles.activeTab]}
                    >
                        {isFocused && (
                            <View style={styles.circleBackground2}>
                                <View style={styles.circleBackground} />
                            </View>
                        )}

                        <Ionicons
                            name={iconName}
                            size={index === 1 ? 24 : 24}
                            color={isFocused ? '#fff' : '#ccc'}
                        />
                        {isFocused && <Text style={styles.label}>{route.name}</Text>}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const Tabs = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Feed" component={HomeScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};

// Styles
const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
        left: 60,
        right: 60,
        height: 50,
        backgroundColor: '#0B0C40',
        borderRadius: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
        elevation: 5, // Android shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
    },
    activeTab: {
        position: 'relative',
        top: -30, // Elevate active tab
    },
    circleBackground: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#FF6C00',
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleBackground2: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 5,

    },
    label: {
        color: '#fff',
        fontSize: 10,
        marginTop: 2,
    },
});

export default Tabs;
