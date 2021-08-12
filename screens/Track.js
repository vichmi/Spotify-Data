import * as React from 'react';
import {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../utils/apikit';
import { StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView, Text, View, StatusBar, ImageBackground, Dimensions, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import refreshAccessToken from '../utils/refreshAccessToken'
import { Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';


export default function Track({navigation, route}) {
    const [item, setItem] = useState({});
    const [loading, setLoading] = useState(true);
    const [artistSongs, setArtistSongs] = useState([]);
    const [audioAnalysis, setAudioAnalysis] = useState({});
    const [premium, setPremium] = useState(false);
    
    async function play(uri, trackNumber) {
        try {
            const res = await axios.get(`/api/player/play?access_token=${await AsyncStorage.getItem('access_token')}&uri=${uri}&trackNumber=${trackNumber}`);
            if(res.data == 'Open App') {
                Alert.alert("Can't play", "A spotify app needs to be open.")
            }
        }catch(err){
            console.log(err);
        }
    }

    async function addToQueue(uri) {
        const res = await axios.get(`/api/player/queue?access_token=${await AsyncStorage.getItem('access_token')}&uri=${uri}`);
    }
    useEffect(() => {
        setLoading(true);
        const getItems = async() => {
            try {
                refreshAccessToken();

                const res = await axios.get(`/api/track/${route.params.params.id}?access_token=${await AsyncStorage.getItem('access_token')}`);
                setItem(res.data);

                const res2 = await axios.get(`/api/trackAnal/${res.data.id}?access_token=${await AsyncStorage.getItem('access_token')}`);
                setAudioAnalysis(res2.data);

                const res3 = await axios.get(`/api/artist/${res.data.artists.artists[0].id}/top-tracks?access_token=${await AsyncStorage.getItem('access_token')}`);
                setArtistSongs(res3.data.tracks);
            }catch(err){
                console.log(err);
            }finally{
                setLoading(false);
            }
        };

        AsyncStorage.getItem('profile')
        .then(res => {
            if(res == 'premium') {
                setPremium(true);
            }
        })

        getItems();
    }, []);


    return loading ? <ActivityIndicator style={styles.container} size="large" color="#00ff00" /> : (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor='transparent' />

            <ScrollView>
                <ImageBackground source={{uri: item.imageUrl}} style={{width: '100%', height: Dimensions.get('window').width}}>
                    <Text style={{color: 'white', fontSize: 35, textShadowColor: 'black', textShadowOffset: {width: 1, height: 1},textShadowRadius: 7, bottom: 0, position: 'absolute', left: 5}}>{item.name}</Text>
                </ImageBackground>
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.h2}>Artists</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flexDirection: 'row'}}>
                        {item.artists.artists.map((artist, index) => {
                            return (
                                <View key={index} style={{marginRight: 10}}>
                                    <Image style={{width: 150, height: 150, borderRadius: 10}} source={{uri: artist.images[1].url}} />    
                                    <Text style={{color: 'white', alignSelf: 'center'}}>{artist.name}</Text>
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.h2}>Song Details</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap'}}>
                        {Object.keys(audioAnalysis).map((key, index) => {
                            if(Number(audioAnalysis[key]) && (audioAnalysis[key] <= 1 && audioAnalysis[key]*-1 <= 1) && key != 'mode' && key != 'key') {
                                return (
                                    <PercantageRec key={index} percantage={(audioAnalysis[key]*100).toFixed(2)} text={key} />
                                );
                            }
                        })}
                    </View>
                </View>
                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
                    <View style={{backgroundColor: '#141414', width: 150, height: 80, justifyContent: 'center', borderRadius: 7}}>
                        <Text style={{color: 'white', textAlign: 'center', justifyContent: 'flex-start'}}>Tempo</Text>
                        <Text style={{color: 'white', textAlign: 'center', justifyContent: 'flex-end'}}>{audioAnalysis.tempo} BPM</Text>
                    </View>
                    <View style={{backgroundColor: '#141414', width: 150, height: 80, justifyContent: 'center', borderRadius: 7}}>
                        <Text style={{color: 'white', textAlign: 'center', justifyContent: 'flex-start'}}>Loudness</Text>
                        <Text style={{color: 'white', textAlign: 'center', justifyContent: 'flex-end'}}>{audioAnalysis.loudness} BPM</Text>
                    </View>
                </View>

            <View style={{alignItems: 'center', marginTop: 25}}>
                <Text style={styles.h2}>More tracks from {item.artists.artists[0].name}</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
                    {artistSongs.map((song, index) => {
                        return (
                            <View key={index} style={{backgroundColor: '#141414', borderRadius: 6, alignItems: 'center', marginBottom: 10}}>
                                <ImageBackground source={{uri: song.album.images[1].url}} style={{width: 150, height: 150, borderRadius: 6}}>
                                    <Text style={{color: 'white', position: 'absolute', textShadowColor: 'black', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 7, bottom: 0}}>{song.name}</Text>
                                </ImageBackground>
                            </View>
                        )
                    })}
                </View>
            </View>
            </ScrollView>
            

            <View style={styles.addOptionsContainer}>
                <View style={[styles.addOptionsContainer2, {marginBottom: premium ? 0 : 50}]}>
                    <TouchableOpacity style={styles.addOptionIcon} onPress={async e => play(item.albumUri, item.trackNumber)}>
                        <MaterialIcons name="play-circle-fill" size={32} color="white" />
                        <Text style={{color: 'white'}}>Play Now</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.addOptionIcon} onPress={async() => {
                        navigation.navigate('Playlists', {trackUri: item.trackUri});
                    }} >
                        <MaterialIcons name="playlist-add" size={32} color="white"/>
                        <Text style={{color: 'white'}}>Add To Playlist</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.addOptionIcon} onPress={() => addToQueue(item.trackUri)}>
                        <MaterialIcons name="queue-music" size={32} color="white" />
                        <Text style={{color: 'white'}}>Add To Queue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


function PercantageRec({percantage, text}) {
    return (
        <View>
            <Text style={{color: 'white', alignSelf: 'center', textTransform: 'capitalize'}}>{text}</Text>
            <View style={{width: 150, height: 20,  backgroundColor: '#313131', marginBottom: 20}}>
                <View style={{width: 150*percantage/100, height: 20,  backgroundColor: '#00FF56'}} />
                <Text style={{color: 'white', position: 'absolute', textShadowColor: 'black', left: 5, textShadowOffset: {width: 1, height: 1},textShadowRadius: 5}}>{percantage}%</Text>
            </View>
        </View>
    )
}

function capitalizeWords(text) {
    let result = '';
    let wordCharIndex = 0;
    for (let i = 0; i < text.length; i++) {
        let c = text.charAt(i);
        if (/\s/.test(c)) {
            wordCharIndex = 0;
        } else {
            if (wordCharIndex == 0) {
                c = c.toUpperCase();
            } else {
                c = c.toLowerCase();
            }
            wordCharIndex++;
        }
        result += c;
    }
    return result;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  aristsContainer: {
    backgroundColor: '#313131',
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
      padding: 10
  }
});
