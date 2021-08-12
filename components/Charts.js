import React, {useEffect, useState, useCallback} from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native'
import axios from '../utils/apikit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import refreshAccessToken from '../utils/refreshAccessToken';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';
import PayC from './PayC'


export default function ArtistsCom({route, navigation}) {
    const type = route.name.toLowerCase();
    const [time, setTime] = useState('short_term');
    const [access_token, setAccess_token] = useState('');
    const [refresh_token, setRefresh_token] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showContent, setShowContent] = useState(true);

    useEffect(() => {

      setLoading(true);
      
      const getDataAsync = async () => {
        try {
          refreshAccessToken();
          const res2 = await axios.get(`/api/top/${type}?time_range=${time}&limit=50&access_token=${await AsyncStorage.getItem('access_token')}`);
          setItems(res2.data);
        } catch(error) { 
          
        } finally {
          setLoading(false);
        }
      };
      
      const getDataAllAsync = async () => {
        try {
          refreshAccessToken();
          const res2 = await axios.get(`/api/topAll/${type}?time_range=${time}&limit=50&access_token=${await AsyncStorage.getItem('access_token')}`);
          setItems(res2.data);
        } catch(error) { 
          
        } finally {
          setLoading(false);
        }
      };

        getDataAllAsync();

        return () => {
            
        };
      }, [time]);
      
    return loading ? (
    <View style={{flex: 1, justifyContent: "center", backgroundColor: 'black'}}>
      <ActivityIndicator size="large" color="#00ff00" />
    </View>) : (
      <View style={styles.container}>
            <ScrollView style={{marginTop: 40}}>
                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: showContent ? 130 : 30}}>
                    {items.length > 0 ? items.map((item, index) => {
                        return (index+1)%25 == 0 ? (
                          <View key={index} style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10}}>
                                <TouchableOpacity style={{width: 150, height: 150, margin: 10}}  onPress={async e => {
                                  let screen = '';
                                  if(type == 'artists') {
                                    screen = 'Artist'
                                  }else if(type == 'tracks') {
                                    screen = 'Track';
                                  }
                                  navigation.navigate(screen, {params: {id: item.id}});
                                }}>
                                  <View style={{width: '100%', height: '100%', borderRadius: 6, position: 'relative', justifyContent: 'flex-end'}}>
                                    <Image style={{width: '100%', height: '100%', borderRadius: 6}} source={{uri:  item.imageUrl}} />
                                    <Text style={{color: 'white', position: 'absolute', textShadowColor: 'black', textShadowOffset: {width: -1, height: 1},textShadowRadius: 5}}>{index+1}. {item.name}</Text>
                                  </View>
                                </TouchableOpacity>
                                <AdMobBanner
                                  bannerSize="banner"
                                  adUnitID="ca-app-pub-3783119502769597/7581022953"
                                  servePersonalizedAds={false}
                                  onDidFailToReceiveAdWithError={(err) => console.log(err)} 
                                   />
                            </View>

                        ) : (
                            <View key={index} style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10}}>
                                <TouchableOpacity style={{width: 150, height: 150, margin: 10}}  onPress={async e => {
                                  let screen = '';
                                  if(type == 'artists') {
                                    screen = 'Artist'
                                  }else if(type == 'tracks') {
                                    screen = 'Track';
                                  }
                                  navigation.navigate(screen, {params: {id: item.id}});
                                }}>
                                  <View style={{width: '100%', height: '100%', borderRadius: 6, position: 'relative', justifyContent: 'flex-end'}}>
                                    <Image style={{width: '100%', height: '100%', borderRadius: 6}} source={{uri:  item.imageUrl}} />
                                    <Text style={{color: 'white', position: 'absolute', textShadowColor: 'black', textShadowOffset: {width: -1, height: 1},textShadowRadius: 5}}>{index+1}. {item.name}</Text>
                                  </View>
                                </TouchableOpacity>
                            </View>
                        )
                    }) : <Text>You haven't listened to any {type} since {time}</Text>}
                </View>
            </ScrollView>
          <View style={styles.footer}>
            <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'black'}}>
              <View style={time == 'short_term' ? styles.timeFocus :styles.button}><TouchableOpacity onPress={() => setTime('short_term')}><Text style={{color: '#00FF56'}}>4 week</Text></TouchableOpacity></View>
              <View style={time == 'medium_term' ? styles.timeFocus :styles.button}><TouchableOpacity onPress={() => setTime('medium_term')}><Text style={{color: '#00FF56'}}>6 months</Text></TouchableOpacity></View>
              <View style={time == 'long_term' ? styles.timeFocus :styles.button}><TouchableOpacity onPress={() => setTime('long_term')}><Text style={{color: '#00FF56'}}>Lifetime</Text></TouchableOpacity></View>
            </View>
          </View>
      </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black'
    }, 
    button: {
        padding: 7,
        backgroundColor: '#000000'
    },
    timeFocus: {
        padding: 7,
        backgroundColor: '#141414'
    },
    footer: {
      position: 'absolute',
      top: 0,
      width: '100%',
      justifyContent: 'space-around'
    }
})
