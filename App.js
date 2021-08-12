import React, {useState, useEffect} from 'react';
import {Text, View, StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainStackNav from './navigation/MainStackNav.js';

  import NetInfo from "@react-native-community/netinfo"

const Stack = createStackNavigator();

export default function App() {
    const [connected, setConnected] = useState(true);

    useEffect(() => {
        NetInfo.fetch().then(state => {
            setConnected(state.isConnected);
          });
    }, []);

    return !connected ? <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'black'}}>
        <Text style={{color: 'white', fontSize: 24}}>No Internet Connection</Text>
    </View> :(
        <NavigationContainer>
            <StatusBar translucent backgroundColor='transparent' />
            <MainStackNav />
        </NavigationContainer>
    ) ;
}
