import axios from 'axios';

const instance = axios.create({baseURL: "http://192.168.0.105:3001/"});

export default instance;