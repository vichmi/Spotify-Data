import axios from './apikit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function getAccessToken() {
    console.log('in')
    const res = await axios.get(`/api/code?code=${await AsyncStorage.getItem('code')}`);
    console.log(res.data);
}