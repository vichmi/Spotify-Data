import React, {useEffect, useState} from 'react'
import { View, Text, StatusBar } from 'react-native'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();

export default function MainStackNav() {
    const [firstTime, setFirstTime] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('first-time')
        .then(res => {setFirstTime(res); setLoading(false)});
    }, [])

    return !loading ? (
        <Stack.Navigator screenOptions={{
            headerShown: false
          }}>
            {firstTime == null ? <Stack.Screen name='Login' tintColor='none' component={AuthStack} />: null}
            <Stack.Screen name='HomeNav' component={AppStack} />
        </Stack.Navigator>
    ) : <ActivityIndicator style={{flex: 1, backgroundColor: 'black'}} size="large" color="#00ff00" />
}
