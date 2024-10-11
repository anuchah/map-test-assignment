import {
  Button,
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import requestLocationPermission from '../../utils/requestLocationPermission';
import Geolocation from '@react-native-community/geolocation';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {RootState} from '../../redux/store';
import {clearOldData, fetchGeoJSON} from '../../redux/slice/geo/geo.slice';

MapLibreGL.setAccessToken(null);
MapLibreGL.setConnected(true);
const mapStyle =
  'https://api.maptiler.com/maps/outdoor-v2/style.json?key=XdZ4UbqwUB8c9u4btUKu';

const MapScreen = () => {
  const dispatch = useAppDispatch();
  const geoJSONData = useAppSelector((state: RootState) => state.geo.data);
  const mapRef = useRef<MapLibreGL.MapViewRef>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [currentPosition, getCurententPosition] = useState<
    [number, number] | null
  >(null);
  const [loading, setLoading] = useState(true);

  console.log('geoJSONData', geoJSONData.length);

  function handleMarkerPress(event: any) {
    const feature = event.features[0];
    setSelectedFeature(feature);
    setModalVisible(true);
  }

  async function onRegionDidChange(e: any) {
    const westLng = e.properties.visibleBounds[0][0];
    const southLat = e.properties.visibleBounds[0][1];
    const eastLng = e.properties.visibleBounds[1][0];
    const northLat = e.properties.visibleBounds[1][1];

    const bbox = [westLng, southLat, eastLng, northLat].join(',');

    const limit: number = 50;
    const offset: number = 0;

    dispatch(fetchGeoJSON({bbox, limit, offset}));
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        getCurententPosition([longitude, latitude]);
      },
      error => {
        console.log('error', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  useEffect(() => {
    if (geoJSONData.length >= 0) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [geoJSONData]);

  return (
    <View style={{flex: 1}}>
      {loading ? (
        <ActivityIndicator size="large" color="indigo" style={styles.loader} />
      ) : (
        <MapLibreGL.MapView
          style={{width: '100%', height: '100%'}}
          ref={mapRef}
          styleURL={mapStyle}
          logoEnabled={false}
          onRegionDidChange={onRegionDidChange}>
          {currentPosition && (
            <MapLibreGL.Camera
              zoomLevel={15}
              centerCoordinate={currentPosition}
            />
          )}

          {currentPosition && (
            <MapLibreGL.PointAnnotation id="point" coordinate={currentPosition}>
              <View
                style={{
                  width: 15,
                  height: 15,
                  backgroundColor: 'indigo',
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </MapLibreGL.PointAnnotation>
          )}

          {geoJSONData && (
            <MapLibreGL.ShapeSource
              id="geojson-source"
              shape={{type: 'FeatureCollection', features: geoJSONData}}
              onPress={handleMarkerPress}>
              <MapLibreGL.SymbolLayer
                id="marker-symbol"
                style={{
                  iconImage: require('../../assets/location-pin.png'),
                  iconSize: 0.09,
                }}
              />
            </MapLibreGL.ShapeSource>
          )}
        </MapLibreGL.MapView>
      )}

      {modalVisible && selectedFeature && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}>
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <Text style={styles.text}>
                Latitude: {selectedFeature.geometry.coordinates[1]}
              </Text>
              <Text style={styles.text}>
                Longitude: {selectedFeature.geometry.coordinates[0]}
              </Text>
              <Text style={styles.text}>
                CountryName : {selectedFeature.properties.ct_en || 'N/A'}
              </Text>
              <Button title="ปิด" onPress={() => setModalVisible(false)} />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    gap: 8,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  loader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});

export default MapScreen;
