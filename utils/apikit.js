import axios from 'axios';

const instance = axios.create({baseURL: 'https://spotify-backend-mobileapp.herokuapp.com/'});

export default instance;
