
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { View } from 'react-native';

export default function RootLayout() {

  return (
    <View style={{ flex: 1}}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}/>
      <StatusBar style="auto" />
    </View>
  );
}
