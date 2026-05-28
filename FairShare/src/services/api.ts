import axios from 'axios';
import { Platform } from 'react-native';
import { store } from '../../Redux/store';
import { clearUser } from '../../Redux/userSlice';

const baseURL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

const API = axios.create({
  baseURL,
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(clearUser());
    }
    return error;
  }
);

export default API;
