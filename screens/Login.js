import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { View, Text, StyleSheet, StatusBar } from 'react-native'
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';

export default function Login({navigation}) {
    return (
        <View style={styles.container}>
            <StatusBar />
            <Text style={{marginBottom: 5, fontSize: 16, color: 'white'}}>Login With Spotify</Text>
            <TouchableOpacity style={{padding: 10, backgroundColor: '#00de4b'}} onPress={async() => {navigation.navigate('Browser', {url: 'https://spotify-backend-mobileapp.herokuapp.com/api/login'})}}><Text  style={{color: 'white', fontSize: 18}}>Login</Text></TouchableOpacity><AdMobBanner
            bannerSize="smartBannerPortrait"
            adUnitID="ca-app-pub-3783119502769597/4160411448"
            servePersonalizedAds={false}
            onDidFailToReceiveAdWithError={(err) => console.log(err)} 
            style={{position: 'absolute', bottom: 50}} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'black'
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
  });
  