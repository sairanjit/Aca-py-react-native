import axios from 'react-native-axios';

export default axios.create({
    baseURL: 'http://10.10.10.218:8050'
});