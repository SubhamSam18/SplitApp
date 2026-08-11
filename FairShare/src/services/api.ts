import axios from 'axios';
import { Platform } from 'react-native';
import { store } from '../../Redux/store';
import { clearUser } from '../../Redux/userSlice';
import { API_URL_ANDROID, API_URL_IOS } from '../config';

const baseURL = Platform.OS === 'android'
  ? API_URL_ANDROID
  : API_URL_IOS;

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
    return Promise.reject(error);
  }
);

export default API;
