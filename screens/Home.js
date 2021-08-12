import React from 'react'
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Dimensions  } from 'react-native';
import axios from '../utils/apikit';
import refreshAccessToken from '../utils/refreshAccessToken'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import millify from "millify";
import { FlatList,VirtualizedLists, Modal } from 'react-native';


export default function Home({navigation, route}) {
    const [recently, setRecently] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({});
    const [modalVisible, setModalVisible] = useState(true);

    const RenderTracks = ({track, index}) => {
        let artists = [...track.artists];
        for(let i=0;i<artists.length;i++) {
            artists[i] = track.artists[i].name;
        }
        let artistString = artists.join(', ');
        return (
            <TouchableOpacity onPress={e => {
                navigation.navigate('Track', {params: {id: track.id}});
            }} style={{backgroundColor: 'none', flexDirection: 'row', marginBottom: 10, width: '100%', borderRadius: 10, left: 5}}>
                <Image source={{uri: track.imageUrl}} style={{width: 80, height: 80, borderRadius: 5}} />
                <View style={{textAlign: 'left', justifyContent: 'center', flex: 1, width: '100%'}}>
                    <Text style={{color: 'white', left: 5}}>{track.name}</Text>
                    <Text style={{color: '#bdbdbd', left: 5}}>{artistString}</Text>
                    <Text style={{color: 'white', right: 20, position: 'absolute', fontSize: 17}}>{index+1}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        const getItems = async () => {
            try{
                refreshAccessToken();
                const res2 = await axios.get(`/api/recently?access_token=${await AsyncStorage.getItem('access_token')}&limit=30`);
                setRecently(res2.data);

                const res3 = await axios.get(`/api/me?access_token=${await AsyncStorage.getItem('access_token')}`);
                setProfile(res3.data);

                const res4 = await axios.get(`/api/recently?access_token=${await AsyncStorage.getItem('access_token')}&limit=30`);
                setRecently(res4.data);
            }catch(err){
                console.log(err);
            }finally{
                setLoading(false);
            }
        }
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
                        
                        {recently ? <FlatList
                            data={recently}
                            renderItem={({item, index}) => <RenderTracks track={item} index={index} />}
                            keyExtractor={(item, index) => String(index)}
                        /> :null}
                    </View>
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
  