import React from 'react'
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Dimensions  } from 'react-native';
import axios from '../utils/apikit';
import refreshAccessToken from '../utils/refreshAccessToken'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import * as Progress from 'react-native-progress';
import convert from 'convert-seconds';

export default function Home({navigation, route}) {
    const [recently, setRecently] = useState([]);
    const [last, setLast] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getItems = async () => {
            try{
                refreshAccessToken();
                const res = await axios.get(`/api/now?access_token=${await AsyncStorage.getItem('access_token')}`);
                if(res.status == 200) setLast(res.data); 

                const res2 = await axios.get(`/api/recently?access_token=${await AsyncStorage.getItem('access_token')}&limit=30`);
                setRecently(res2.data);

            }catch(err){
                console.log(err);
            }finally{
                setLoading(false);
            }
        }
        getItems();
    }, []);

    return loading ? <ActivityIndicator style={styles.container} size="large" color="#00ff00" /> : (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.h2}>Most recent</Text>
                {last ? <TouchableOpacity style={{flexDirection: 'row', width: '100%'}} onPress={e => {
                    navigation.navigate('Track', {params: {id: last.id}});
                }}>
                    <Image source={{uri: last.imageUrl}} style={{width: 120, height: 120, borderRadius: 5}} />
                    <View style={{flex:1, backgroundColor: '#141414'}}>
                        <Text  style={{color: 'white', top: 5, left:5, fontSize: 18}}>{last.name}</Text>
                        <View style={{flexDirection: 'row'}}>
                            {last.artists ? last.artists.map((artist, index) => {
                                let str = '';
                                if(index > 0) {
                                    str += ', ';
                                }
                                str += artist.name;

                                return (
                                    <Text key={index} style={{color: '#bdbdbd', top: 5, left:5, fontSize: 18}}>{str}</Text>
                                )
                            }) : null}

                        </View>
                        
                    </View>
                </TouchableOpacity> : null}
                <View>
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
                            }} key={index} style={{backgroundColor: 'none', flexDirection: 'row', marginBottom: 10, width: '90%', borderRadius: 10}}>
                                <Image source={{uri: track.imageUrl}} style={{width: 80, height: 80, borderRadius: 5}} />
                                <View style={{textAlign: 'left', justifyContent: 'center', flex: 1}}>
                                    <Text style={{color: 'white', left: 5}}>{track.name}</Text>
                                    <Text style={{color: '#bdbdbd', left: 5}}>{artistString}</Text>
                                    <Text style={{color: 'white', right: 5, position: 'absolute', fontSize: 17}}>{index+1}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }) : null}
                </View>
            </ScrollView>
        </View>
    )
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
  