import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import SplashScreen from './screens/SplashScreen'; // Your Splash Screen
import EnterAmount from './screens/EnterAmount'; // Your Enter Amount screen
import Tabs from './screens/Tabs'; // Your Tabs (Main App)
import Not from './screens/Not';

export default function App() {
  const [isLoading, setIsLoading] = useState(true); // To show splash screen
  const [isFirstTime, setIsFirstTime] = useState(null); // To determine navigation flow

  useEffect(() => {
    const initializeApp = async () => {
      // Simulate splash screen delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check if user has already entered an amount
      const storedAmount = await AsyncStorage.getItem('BudgetAmount');
      setIsFirstTime(!storedAmount); // If no amount is found, it's the first time

      setIsLoading(false); // Stop showing the splash screen
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#000" hidden={false} />
      {/* <Not/> */}
      {isFirstTime ? (
        <EnterAmount
          onProceed={async (amount) => {
            // Save the entered amount and navigate to Tabs
            await AsyncStorage.setItem('BudgetAmount', JSON.stringify(amount));
            await AsyncStorage.setItem('BudgetAmount2', JSON.stringify(amount));
            console.log(typeof amount);
            setIsFirstTime(false); // Now proceed to Tabs
          }}
        />
      ) : (
        <Tabs />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
