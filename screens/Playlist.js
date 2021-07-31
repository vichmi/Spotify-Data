import React, {useState, useEffect, useRef} from 'react'
import { View, Text, Animated, ScrollView, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native'
import axios from '../utils/apikit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import refreshAccessToken from '../utils/refreshAccessToken'
import { StatusBar } from 'react-native';



export default function Playlist({navigation, route}) {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    async function addToPlaylist(id, uri) {
        const res = await axios.get(`/api/playlist/add/${id}?uri=${uri}&access_token=${await AsyncStorage.getItem('access_token')}`);
        navigation.goBack();
    }
    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                refreshAccessToken();

                const res2 = await axios.get(`/api/playlist/?access_token=${await AsyncStorage.getItem('access_token')}&limit=50&offset=0`);
                setPlaylists(res2.data);
            }catch(err){
                console.log(err);
            }finally{
                setLoading(false);
            }
        })();
    }, [])

    const fadeAnim = useRef(new Animated.Value(0)).current;
        Animated.timing(fadeAnim, {toValue: 1, duration: 500, useNativeDriver: true}).start();
        return loading ? <ActivityIndicator style={styles.container} size="large" color="#00ff00" /> : (
            <Animated.View style={[{
                opacity: fadeAnim
            }, styles.container]}>
            <StatusBar translucent backgroundColor='transparent' />
                <ScrollView style={{marginTop: StatusBar.currentHeight+70}}>
                    {playlists.map((item, index) => {
                        return (
                            <TouchableOpacity style={{
                                transition: 'all 0.4s ease-out',
                                flexDirection: 'row',
                                marginBottom: 10,
                                width: '100%',
                                backgroundColor: '#141414',
                                borderRadius: 5
                            }} key={index} onPress={e => addToPlaylist(item.id, route.params.trackUri)}>
                                <Image style={{width: 100, height: 100, borderRadius: 7}} source={{uri: item.imageUrl}} />
                                <Text style={{justifyContent: 'center', alignSelf: 'center', color:'white', left: 5}}>{item.name}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </Animated.View>
        )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black'
    }
});