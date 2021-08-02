import React from 'react'
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Dimensions  } from 'react-native';
import axios from '../utils/apikit';
import refreshAccessToken from '../utils/refreshAccessToken'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import * as Progress from 'react-native-progress';
import convert from 'convert-seconds';
import millify from "millify";
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
    setTestDeviceIDAsync,
  } from 'expo-ads-admob';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';


export default function Home({navigation, route}) {
    const [recently, setRecently] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({});

    useEffect(() => {
        const getItems = async () => {
            try{
                refreshAccessToken();
                const res2 = await axios.get(`/api/recently?access_token=${await AsyncStorage.getItem('access_token')}&limit=30`);
                setRecently(res2.data);

                const res3 = await axios.get(`/api/me?access_token=${await AsyncStorage.getItem('access_token')}`);
                setProfile(res3.data);
            }catch(err){
                console.log(err);
            }finally{
                setLoading(false);
            }
        }
        getItems();
        getItems();
    }, []);


    return loading ? <ActivityIndicator style={styles.container} size="large" color="#00ff00" /> : (
        <View style={[styles.container]}>
            <ScrollView style={{left: 5}}>
                <Text style={[styles.h2, {fontSize: 24, alignSelf: 'center'}]}>Profile</Text>
                <View>
                    {profile.images[0] ? 
                        <View style={{alignItems: 'center'}}>
                            <Image source={{uri: profile.images[0].url}} style={{width: 200, height: 200, borderRadius: 12}} />
                            <Text style={{color: 'white', fontSize: 22}}>{profile.display_name}</Text>
                            <Text style={{color: '#bdbdbd', fontSize: 14}}>Followers: {millify(profile.followers.total)}</Text>
                        </View>
                    : null }
                </View>
                <View>
                    <View style={{marginBottom: 80}}>
                        <Text style={styles.h2}>Recently played</Text>
                        
                        {recently ? recently.map((track, index) => {
                            let artists = [...track.artists];
                            for(let i=0;i<artists.length;i++) {
                                artists[i] = track.artists[i].name;
                            }
                            let artistString = artists.join(', ');
                            return (
                                <TouchableOpacity onPress={e => {
                                    navigation.navigate('Track', {params: {id: track.id}});
                                }} key={index} style={{backgroundColor: 'none', flexDirection: 'row', marginBottom: 10, width: '100%', borderRadius: 10, left: 5}}>
                                    <Image source={{uri: track.imageUrl}} style={{width: 80, height: 80, borderRadius: 5}} />
                                    <View style={{textAlign: 'left', justifyContent: 'center', flex: 1, width: '100%'}}>
                                        <Text style={{color: 'white', left: 5}}>{track.name}</Text>
                                        <Text style={{color: '#bdbdbd', left: 5}}>{artistString}</Text>
                                        <Text style={{color: 'white', right: 20, position: 'absolute', fontSize: 17}}>{index+1}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }) : null}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

function convertTime(sec) {
    let string = '';
    if(sec > 60) {
        if(sec < 600) {
            if(sec % 60 < 10) string = `0${(sec/60).toFixed(0)}:0${sec%60}`; else `0${(sec/60).toFixed(0)}:${sec%60}`
        }else{
            if(sec % 60 < 10) string = `${(sec/60).toFixed(0)}:0${sec%60}`; else `${(sec/60).toFixed(0)}:${sec%60}`
        }
    }else{
        if(sec % 60 < 10) string = `00:0${sec%60}`; else `00:${sec%60}`
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black'
    },
    h2: {
        color: '#00FF56',
        fontSize: 20,
        paddingTop: 10,
        paddingBottom: 10
    }
  });
  