import {PermissionsAndroid, Platform, Alert} from 'react-native';

async function requestLocationPermission() {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      if (
        granted['android.permission.ACCESS_FINE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED ||
        granted['android.permission.ACCESS_COARSE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You can use the location');
        return true;
      } else {
        console.log('Location permission denied');
        return false;
      }
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

export default requestLocationPermission;


// useEffect(() => {
//     requestLocationPermission();
//   }, []);

//   useEffect(() => {
//     Geolocation.getCurrentPosition(
//       position => {
//         const {latitude, longitude} = position.coords;
//         setLocation([longitude, latitude]);
//       },
//       error => {
//         console.log('error', error);
//       },
//       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
//     );
//   }, []);

//   const handlePress = () => {
//     Alert.alert('Annotation Pressed', 'You pressed the annotation!');
//   };