import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
        <Stack.Screen name='[code]' options={{header: ()=>null}} ></Stack.Screen>
        <Stack.Screen name='tag' options={{header: ()=>null}} ></Stack.Screen>
        <Stack.Screen name='actress' options={{header: ()=>null}} ></Stack.Screen>
        

    </Stack>
  )
}

export default _layout