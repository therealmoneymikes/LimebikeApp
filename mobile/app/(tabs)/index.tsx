import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import SignInScreen from '../(auth)/SignInScreen';

export default function TabOneScreen() {
  return (
    <>
      <SignInScreen />
    </>
  );
}

const styles = StyleSheet.create({

});
