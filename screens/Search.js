import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'; 
import axios from '../utils/apikit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Search({navigation}) {
    const [items, setItems] = useState({});
    const [typed, setTyped] = useState('');
    const [loading, setLoading] = useState(true);
    const [preloadedItems, setPreloadedItems] = useState([]);


    useEffect(() => {
        setLoading(true);
        AsyncStorage.getItem('search-items')
        .then(res => {
            setPreloadedItems(JSON.parse(res))
        })
        .finally(() => setLoading(false))
    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.searchCon}>
            <KeyboardAvoidingView style={styles.searchCon}>
                <TextInput onChangeText={async e => {
                    try {
                        setLoading(true);
                        const res = await axios.get(`/api/search?access_token=${await AsyncStorage.getItem('access_token')}&q=${e}`);
                        setItems(res.data);
                    }catch(err) {
                        console.log(err);
                    }finally{
                        setLoading(false);
                    }
                }} style={[styles.input, {textAlign:'center'}]} placeholder='Enter a song or an artist' />
                <TouchableOpacity style={{position: 'absolute', right: 10, top: 4}}><MaterialIcons name="search" size={32} color="black" /></TouchableOpacity>
                </KeyboardAvoidingView>
            </View>

            {!loading? <ScrollView style={{marginTop: 10}}>
                {preloadedItems == null ? null: <Text style={{color: 'white'}}>Previously</Text> }
                {preloadedItems == null ? null : preloadedItems.map((item, key) => {
                    if(key < 6) {
                    return (
                        <TouchableOpacity key={key} style={{flexDirection: 'row', marginTop: 10}} onPress={e => {
                            navigation.navigate(item.type == 'Song' ? 'Track' : 'Artist', {params: {id: item.id}});
                        }}>
                            <Image source={{uri: item.image}} style={{width: 65, height: 65}} />
                            <View style={{alignSelf: 'center', left: 10}}>
                                <Text style={{color: 'white'}}>{item.text}</Text> 
                                <Text style={{color: '#bdbdbd'}}>{item.type}</Text>
                            </View>
                        </TouchableOpacity>)
                    }else return null;
                })}
                {items.tracks == null ? null : <Text style={{color: 'white', marginTop: 20}}>New</Text>}
                {items.tracks == null ? null : items.tracks.items.map((item, key) => {
                    return (
                        <TouchableOpacity key={key} style={{flexDirection: 'row', marginTop: 10}} onPress={async e => {
                            const result = JSON.parse(await AsyncStorage.getItem('search-items')) || [];
                            let res = result.filter(i => i.id == item.id)
                            if(!res[0])  {
                                result.push({image: item.album.images[1].url, text: item.name, type: 'Song', id: item.id});
                                await AsyncStorage.setItem('search-items', JSON.stringify(result));
                            }
                            navigation.navigate('Track', {params: {id: item.id}});
                        }}>
                            {item.album.images && item.album.images[1] && item.album.images[1].url ? <Image source={{uri: item.album.images[1].url}} style={{width: 65, height: 65}} /> : null}
                            <View style={{alignSelf: 'center', left: 10}}>
                                <Text style={{color: 'white'}}>{item.name}</Text> 
                                <Text style={{color: '#bdbdbd'}}>Song</Text>
                            </View>
                        </TouchableOpacity>)
                })}
                {items.artists ? items.artists.items.map((item, key) => {
                    return (
                        <TouchableOpacity key={key} style={{flexDirection: 'row', marginTop: 10}} onPress={async e => {
                            const result = JSON.parse(await AsyncStorage.getItem('search-items')) || [];
                            let res = result.filter(i => i.id == item.id);
                            if(!res[0]) {
                                result.push({image: item.images[1].url, text: item.name, type: 'Artist', id: item.id});
                                await AsyncStorage.setItem('search-items', JSON.stringify(result));
                            }
                            navigation.navigate('Artist', {params: {id: item.id}});
                        }}>
                            {item.images && item.images[1] && item.images[1].url ? <Image source={{uri: item.images[1].url}} style={{width: 65, height: 65}} /> : null}
                            <View style={{alignSelf: 'center', left: 10}}>
                                <Text style={{color: 'white'}}>{item.name}</Text> 
                                <Text style={{color: '#bdbdbd'}}>Artist</Text>
                            </View>
                        </TouchableOpacity>)
                }) : null}
            </ScrollView> : <ActivityIndicator style={styles.container} size="large" color="#00ff00" />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black'
    },
    searchCon: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        height: 40
    },
    input: {
        width: '95%',
        backgroundColor: '#fff',
        alignSelf: 'center',
        borderRadius: 10,
        height: 40
    },
    h2: {
        color: '#00FF56',
        fontSize: 18,
        padding: 10,
        alignSelf: 'center'
    }
  });
  