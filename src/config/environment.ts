import { Platform } from 'react-native';

const getAPIBaseURL = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  } else {
    return 'http://localhost:3000';
  }
};

export const API_BASE_URL = getAPIBaseURL();
