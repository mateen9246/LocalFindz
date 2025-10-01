import React from 'react';
import { StyleSheet, View, Text, Platform, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, persistor } from './src/store';
import Navigation from './src/navigation';
import { hp } from './src/utils/responsive';
import { COLORS } from './src/constants';

function StatusBarPlaceHolder() {
  const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? hp('4.5%') : hp('2.3%');
  return (
    <View
      style={{
        width: '100%',
        height: STATUS_BAR_HEIGHT,
        backgroundColor: COLORS.primary,
      }}
    >
      <StatusBar backgroundColor={'blue'} barStyle="light-content" />
    </View>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBarPlaceHolder />
          <Navigation />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
});

export default App;
