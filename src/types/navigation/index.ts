import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Redirect: undefined;
  Map: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
