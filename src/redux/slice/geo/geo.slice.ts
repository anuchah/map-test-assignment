import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {api} from '../../../api';
import {API_KEY, API_URL} from '../../../constants/api';

type GeoState = {
  data: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: null | string;
  bbox: string;
};

const initialState: GeoState = {
  data: [],
  status: 'idle',
  error: null,
  bbox: '',
};

export const fetchGeoJSON = createAsyncThunk(
  'geo/fetchGeoJSON',
  async (
    {bbox, limit, offset}: {bbox: string; limit: number; offset: number},
    thunkAPI,
  ) => {
    try {
      const response = await api.get(API_URL, {
        params: {
          api_key: API_KEY,
          bbox,
          limit,
          offset,
        },
      });
      // console.log('response.data.features', response.data.features);

      return response.data.features;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch data',
      );
    }
  },
);

export const geoSlice = createSlice({
  name: 'geo',
  initialState,
  reducers: {
    clearOldData(state, action: PayloadAction<string>) {
      const newBBox = action.payload;
      state.data = state.data.filter(feature =>
        isInBoundingBox(feature, newBBox),
      );
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchGeoJSON.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchGeoJSON.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        // const dataFeature = action.payload;
        // dataFeature.forEach((newFeature: any) => {
        //   const isFeatureExists = state.data.some(
        //     feature => feature.id === newFeature.id,
        //   );
        //   if (!isFeatureExists) {
        //     state.data.push(newFeature);
        //   }
        // });
        // return state;
        const existingIds = new Set(state.data.map(feature => feature.id));
        const newFeatures = action.payload.filter(
          (newFeature: any) => !existingIds.has(newFeature.id),
        );

        state.data.push(...newFeatures);
      })
      .addCase(fetchGeoJSON.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

const isInBoundingBox = (feature: any, bbox: string) => {
  const [minLon, minLat, maxLon, maxLat] = bbox.split(',').map(Number);
  const [lon, lat] = feature.geometry.coordinates;
  return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
};

export const {clearOldData} = geoSlice.actions;

export default geoSlice.reducer;
