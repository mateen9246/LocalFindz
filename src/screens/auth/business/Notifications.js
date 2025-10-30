import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../constants';
import BottomTab from '../../../components/BottomTab';
export default function Notifications({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Notifications Screen Design Yet To Be Done</Text>
      <BottomTab activeTab="Notifications" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
