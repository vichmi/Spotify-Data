
import axios from '../utils/apikit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function refreshAccessToken() {
    try {
        const refresh_token = await AsyncStorage.getItem('refresh_token');
            const res = await axios.post(`/api/refresh`,{
                headers: {
                    body: {
                        refresh_token
                    }
                }});
        await AsyncStorage.setItem('access_token', res.data.access_token)
    }catch(err) {
        console.log(err);
    }
}