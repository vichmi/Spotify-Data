import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../utils/apikit';
import React, {useState, useEffect} from 'react'
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Image, StatusBar, Dimensions } from 'react-native'
import { ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native';
import refreshAccessToken from '../utils/refreshAccessToken';

export default function Artist({navigation, route}) {

    const [artist, setArtist] = useState({});
    const [albums, setAlbums] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const getItems = async () => {
            try {
                refreshAccessToken();
                
                const res = await axios.get(`/api/artist/${route.params.params.id}?access_token=${await AsyncStorage.getItem('access_token')}`);
                setArtist(res.data);
                
                const res2 = await axios.get(`/api/artist/${route.params.params.id}/albums?access_token=${await AsyncStorage.getItem('access_token')}`);
                setAlbums(res2.data.items);
                
                const res3 = await axios.get(`/api/artist/${route.params.params.id}/top-tracks?access_token=${await AsyncStorage.getItem('access_token')}`)
                setTracks(res3.data.tracks);
            }catch(err){
                console.log(err);
            }finally{
                setLoading(false)
            }
        }
        getItems();
    }, [])

    return loading ? <ActivityIndicator style={styles.container} size="large" color="#00ff00" /> : (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor='transparent' />
            <ScrollView>
                <ImageBackground source={{uri: artist.images[0].url}} style={{width: '100%', height: Dimensions.get('window').width}}>
                    <Text style={{color: 'white', fontSize: 35, textShadowColor: 'black', textShadowOffset: {width: -1, height: -1},textShadowRadius: 50, bottom: 0, position: 'absolute', left: 5}}>{artist.name}</Text>
                </ImageBackground>

                <Text style={styles.h2}>Stats</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                    <View style={{backgroundColor: '#141414', padding: 10, marginBottom: 10, marginTop: 10, borderRadius: 5, alignItems: 'center'}}>
                        <Text style={{fontSize: 16, color: 'white', paddingBottom: 10}}>Followers</Text>
                        <Text style={{fontSize: 16, color: 'white'}}>{artist.followers.total}</Text>
                    </View>
                    
                    <View style={{backgroundColor: '#141414', padding: 10, marginBottom: 10, marginTop: 10, borderRadius: 5, alignItems: 'center'}}>
                        <Text style={{fontSize: 16, color: 'white', paddingBottom: 10}}>Popularity</Text>
                        <Text style={{fontSize: 16, color: 'white'}}>{artist.popularity}</Text>
                    </View>
                    
                    <View style={{backgroundColor: '#141414', width: '80%', padding: 10, marginBottom: 10, marginTop: 10, borderRadius: 5, alignItems: 'center'}}>
                        <Text style={{fontSize: 16, color: 'white', paddingBottom: 10}}>Genres</Text>
                        {/* <Text style={{fontSize: 16, color: 'white'}}>{artist.genres.join(', ')}</Text> */}
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                            {artist.genres.map((genre, index) => {
                                return (
                                    <View key={index} style={{backgroundColor: '#0d0d0d', padding: 5, borderRadius: 10, margin: 5}}><Text style={{color: 'white'}}>{genre}</Text></View>
                                )
                            })}
                        </View>
                    </View>
                </View>

                <View>
                    <Text style={styles.h2}>Top Tracks</Text>
                    <View style={{alignItems: 'center'}}>
                        {tracks.map((track, index) => {
                            let artists = track.artists;
                            for(let i=0;i<artists.length;i++) {
                                artists[i] = track.artists[i].name;
                            }
                            let artistString = artists.join(', ');
                            return (
                                <TouchableOpacity onPress={e => {
                                    navigation.navigate('Track', {params: {id: track.id}});
                                }} key={index} style={{backgroundColor: 'none', flexDirection: 'row', marginBottom: 10, width: '90%', borderRadius: 10}}>
                                    <Image source={{uri: track.album.images[1].url}} style={{width: 80, height: 80, borderRadius: 5}} />
                                    <View style={{textAlign: 'left', justifyContent: 'center'}}>
                                        <Text style={{color: 'white', left: 5}}>{track.name}</Text>
                                        <Text style={{color: '#bdbdbd', left: 5}}>{artistString}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
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
    aristsContainer: {
      backgroundColor: '#141414',
      marginBottom: 5,
      width: '95%',
      alignSelf: 'center',
      borderRadius: 10,
      flexDirection: 'row'
    },
    addOptionsContainer: {
        bottom: 0,
        width: '100%'
    },
    addOptionsContainer2: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderTopWidth: 1.5,
      borderTopColor: '#141414'
    },
    addOptionIcon: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    h2: {
        color: '#00FF56',
        fontSize: 24,
        padding: 10,
        alignSelf: 'center'
    }
  });
  