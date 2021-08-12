import React from 'react'
import { View, Text } from 'react-native'
import {WebView} from 'react-native-webview'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StatusBar } from 'expo-status-bar'

export default function Browser({route, navigation}) {
    return (
        <View style={{flex: 1}}>
            <StatusBar />
            <WebView source={{uri: route.params.url}} injectedJavaScript={"window.ReactNativeWebView.postMessage(document.body.innerText)"} javaScriptEnabled={true} onMessage={async (e) => {
                if(e.nativeEvent.url.includes('?code=')) {
                    let data = JSON.parse(e.nativeEvent.data)
                    await AsyncStorage.setItem('access_token', data.access_token);
                    await AsyncStorage.setItem('refresh_token', data.refresh_token);
                    await AsyncStorage.setItem('token_type', data.token_type);
                    await AsyncStorage.setItem('first-time', 'false');
                    navigation.dispatch(navigation.reset({routes: [{name: 'HomeNav'}]}));
                }
            }} />
        </View>
    )
}
