// React and React Native
import React from 'react';
import { View, Text } from 'react-native';

// Expo Router
import { Stack } from 'expo-router';

const _layout = () => {
  return (
     <Stack>
        <Stack.Screen name='index' options={{headerShown:false}} ></Stack.Screen>
        <Stack.Screen name='[tag]' options={{headerTitle:'tag',headerShown:false}} ></Stack.Screen>
    </Stack>
  )
}

export default _layout;