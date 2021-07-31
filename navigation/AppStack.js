import React from 'react'
import { View, Text } from 'react-native'

import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; 
import Charts from '../components/Charts';
import Track from '../screens/Track.js';
import Artist from '../screens/Artist.js';
import Home from '../screens/Home.js';
import Search from '../screens/Search.js';
import Playlist from '../screens/Playlist.js';
import { Button } from 'react-native';
import { Alert } from 'react-native';

const Tab = createBottomTabNavigator();

export default function AppStack({route}) {
    return (
        <Tab.Navigator tabBarOptions={{activeTintColor: 'white', inactiveTintColor: '#999999', style: {backgroundColor: 'black'}}}>
            <Tab.Screen name='Home' component={HomeTab} options={{
                title: 'Home',
                tabBarIcon: ({color}) => <Ionicons name="home" size={30} color={'#00FF56'}/>
            }} />
            <Tab.Screen name='Search' component={SearchTab} options={{
                title: 'Search',
                tabBarIcon: ({color}) => <Ionicons name="search" size={30} color={'#00FF56'}/>,
            }} />
            <Tab.Screen name="Artists" component={ArtistsTab} options={{
                title: "Artists",
                tabBarIcon: ({color}) => <Ionicons name="person" size={30} color={'#00FF56'}/>,
            }} />
            <Tab.Screen name="Tracks" component={TracksTab} options={{
                title: "Tracks",
                tabBarIcon: ({color}) => <Ionicons name="musical-notes" size={30} color={'#00FF56'}/>,
            }} />
        </Tab.Navigator>
    )
}

const HomeNavigator = createStackNavigator();

function HomeTab({route, navigation}) {
    return (
        <HomeNavigator.Navigator>
            <HomeNavigator.Screen name="Home" component={Home} options={{
                title: "Home",
                headerStyle: {
                    backgroundColor: 'black'
                },
                headerTitleStyle: {
                    color: 'white',
                },
                headerRight: () => (
                    <Ionicons name="information-circle" style={{right: 5}} size={30} color={'#00FF56'} onPress={() => Alert.alert('Home Screen', 'This screen show you your recent played spotify songs. You can click on the song for more information')} />
                ),
            }} />
            <HomeNavigator.Screen name='Track' component={STrackNav} options={{
                headerShown: false,
            }} />
            <HomeNavigator.Screen name='Artist'  component={Artist} options={{
                headerShown: false,
            }} />
        </HomeNavigator.Navigator>
    )
}

const SearchNav = createStackNavigator();
function SearchTab({navigation, route}) {
    return (
        <SearchNav.Navigator>
            <SearchNav.Screen name='Search' component={Search}  options={{
                title: "Search",
                headerStyle: {
                    backgroundColor: 'black'
                },
                headerTitleStyle: {
                    color: 'white',
                },
                headerRight: () => (
                    <Ionicons name="information-circle" style={{right: 5}} size={30} color={'#00FF56'} onPress={() => Alert.alert('Search Screen', 'Here you can search for any song or artist')} />
                ),
            }} />
            <SearchNav.Screen name='Artist'  component={Artist} options={{
                headerShown: false
            }} />
            <SearchNav.Screen name='Track' tabBarVisible={false}  component={STrackNav} options={{
                headerShown: false
            }} />
        </SearchNav.Navigator>
    )
}

const ArtistsNavigator = createStackNavigator();
function ArtistsTab({navigation, route}) {
    return (
        <ArtistsNavigator.Navigator>
            <ArtistsNavigator.Screen name="Artists" component={Charts} options={{
                title: "Artists",
                headerStyle: {
                    backgroundColor: 'black'
                },
                headerTitleStyle: {
                    color: 'white',
                },
                headerRight: () => (
                    <Ionicons name="information-circle" style={{right: 5}} size={30} color={'#00FF56'} onPress={() => Alert.alert('Artist Screen', 'These are your most listened artist. You can click on the artist for more information')} />
                ),
            }} />
            <ArtistsNavigator.Screen name='Artist' tabBarVisible={false}  component={Artist} options={{
                title: '',
                headerTransparent: true,
                headerStyle: {
                    backgroundColor: 'transparent'
                },
            }} />
            <ArtistsNavigator.Screen name='Track' tabBarVisible={false} component={STrackNav} options={{
                headerShown: false
            }} />
        </ArtistsNavigator.Navigator>
    )
}

const TracksNavigator = createStackNavigator();
function TracksTab({navigation, route}) {
    return (
        <TracksNavigator.Navigator>
            <TracksNavigator.Screen name="Tracks" component={Charts} options={{
                title: "Tracks",
                headerStyle: {
                    backgroundColor: 'black'
                },
                headerTitleStyle: {
                    color: 'white',
                },
                headerRight: () => (
                    <Ionicons name="information-circle" style={{right: 5}} size={30} color={'#00FF56'} onPress={() => Alert.alert('Tracks Screen', 'These are your most listened songs. You can click on the song for more information')} />
                ),
            }} />
            <TracksNavigator.Screen name='Track'  component={STrackNav} options={{
                headerShown: false
            }} />
            
            <TracksNavigator.Screen name='Artist' tabBarVisible={false}  component={Artist} options={{
                headerShown: false
            }} />
        </TracksNavigator.Navigator>
    )
}

const SingleStrackNav = createStackNavigator();

function STrackNav({route, navigation}) {
    return (
        <SingleStrackNav.Navigator>
            <SingleStrackNav.Screen name='Track' tabBarVisible={false} initialParams={route.params} component={Track} options={{
                title: '',
                headerTransparent: true,
                headerStyle: {
                    backgroundColor: 'transparent'
                },
                headerTintColor: 'white'
            }} />
            
            <SingleStrackNav.Screen name='Playlists' tabBarVisible={false}  component={Playlist} options={{
                title: '',
                headerTransparent: true,
                headerStyle: {
                    backgroundColor: 'transparent'
                },
                headerTintColor: 'white'
            }} />
        </SingleStrackNav.Navigator>
    )
}