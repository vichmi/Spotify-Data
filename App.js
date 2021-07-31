import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthStack from './navigation/AuthStack.js';
import AppStack from './navigation/AppStack.js';
import MainStackNav from './navigation/MainStackNav.js';

const Stack = createStackNavigator();

export default function App() {
    const [firstTime, setFirstTime] = useState(true);
    useEffect(() => {
        (async () => {
            const res = await AsyncStorage.getItem('first-time');
            if(res === null) setFirstTime(true); else setFirstTime(false);
        })();
    }, []);

    return (
        <NavigationContainer>
            <MainStackNav />
        </NavigationContainer>
    ) 
}
