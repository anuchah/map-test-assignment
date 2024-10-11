import {combineReducers} from '@reduxjs/toolkit';
import geoSlice from '../slice/geo/geo.slice';
import {persistReducer} from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage';

const geoPersistConfig = {key: 'geo', storage: AsyncStorage};

export default combineReducers({
  geo: persistReducer(geoPersistConfig, geoSlice),
});
