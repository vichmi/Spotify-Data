import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthStack from './navigation/AuthStack.js';
import AppStack from './navigation/AppStack.js';
import MainStackNav from './navigation/MainStackNav.js';
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
    setTestDeviceIDAsync,
  } from 'expo-ads-admob';
  import NetInfo from "@react-native-community/netinfo";
import axios from './utils/apikit';
import RNRestart from 'react-native-restart'; 

const Stack = createStackNavigator();

export default function App() {
    const [connected, setConnected] = useState(true);

    useEffect(() => {
        NetInfo.fetch().then(state => {
            setConnected(state.isConnected);
          });
        // RNRestart.Restart();
        console.log(RNRestart)
    }, []);

    return !connected ? <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'black'}}>
        <Text style={{color: 'white', fontSize: 24}}>No Internet Connection</Text>
    </View> :(
        <NavigationContainer>
            <StatusBar translucent backgroundColor='transparent' />
            <MainStackNav />
            <AdMobBanner
                bannerSize="smartBannerPortrait"
                adUnitID="ca-app-pub-3783119502769597/4160411448"
                servePersonalizedAds={false}
                onDidFailToReceiveAdWithError={(err) => console.log(err)} 
                style={{position: 'absolute', bottom: 50}}
            />
        </NavigationContainer>
    ) ;
}
