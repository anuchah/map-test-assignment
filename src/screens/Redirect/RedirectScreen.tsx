import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {RootStackScreenProps} from '../../types/navigation';
import LottieView from 'lottie-react-native';

type Props = RootStackScreenProps<'Redirect'>;

const RedirectScreen: React.FC<Props> = ({navigation}) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Map');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'white'} />
      <LottieView
        source={require('../../assets/car.json')}
        loop
        autoPlay
        style={{
          width: 300,
          height: 300,
        }}
      />
    </View>
  );
};

export default RedirectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
