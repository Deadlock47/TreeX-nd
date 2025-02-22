import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
        <Stack.Screen name='index' options={{header: ()=>null}} ></Stack.Screen>
        <Stack.Screen name='[playlist]' options={{headerTitle:'playlist',headerShown:false}} ></Stack.Screen>

    </Stack>
  )
}

export default _layout