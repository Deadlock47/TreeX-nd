import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
     <Stack>
          <Stack.Screen name='[tag]' options={{headerShown:false}} ></Stack.Screen>
          {/* <Stack.Screen name='[actress]' options={{headerTitle:'actr',headerShown:false}} ></Stack.Screen> */}
      </Stack>
  )
}

export default _layout