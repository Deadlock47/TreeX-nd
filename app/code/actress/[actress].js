// React and React Native
import { View, Text, StyleSheet, ScrollView, Dimensions, RefreshControl, Pressable, Image } from 'react-native';
import React, { useEffect, useState } from 'react';

// Expo Router
import { router, useLocalSearchParams } from 'expo-router';

// Expo SQLite
import { Storage } from 'expo-sqlite/kv-store';

// Expo Fonts
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import { Nunito_400Regular } from '@expo-google-fonts/nunito';

// Components
import Item from '../../../components/item';

// Linear Gradient
import { LinearGradient } from 'expo-linear-gradient';

// Safe Area
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Status Bar
import { StatusBar } from 'expo-status-bar';

// Icons
import Ionicons from '@expo/vector-icons/Ionicons';

const Actress_Info = () => {
    const params = useLocalSearchParams();
    const {actress,name , image} = params;
    // const actress = data.name;
    // console.log("ghghgh",actress , name , image)
    // console.log(actress , name , image);
    let [fontsLoaded] = useFonts({
      Inter_900Black,
      Roboto_400Regular,
      Nunito_400Regular
    });
    
    const [refreshing,setRefreshing] = useState(true);
    const [actress_codes ,setActress_codes] = useState();
    
    // const []
    
    function refresh(){
      setRefreshing(false)
    }
    async function get_codes()
    {
        const key_str = actress.toString()+"code";
        const result = await Storage.getItem(key_str)
        setActress_codes(result.split(","))
        // console.log(result)
        // refresh();
        setRefreshing(false);
    }
    useEffect(()=>{ 
        // refresh();
        get_codes();
        console.log(actress_codes)
    },[name])

    // // console.log(actress , image , actress_code)
  return (
    <SafeAreaProvider className='w-screen h-full bg-neutral-900' >
        <StatusBar style='auto' ></StatusBar>
      <SafeAreaView className="w-screen h-full bg-neutral-900" >
        <View className='absolute top-10 z-10 left-10' >
          <Pressable 
              onTouchEnd={()=>{ 
                router.back();
                console.log("btn - pressed")
              }}
              className='bg-yellow-500 p-1  rounded-md ' >
              <Text className='' > 
                  <Ionicons name="chevron-back" size={30} color="black" />
              </Text>
            </Pressable>
        </View>
        <ScrollView 
          className='w-screen h-auto  p-2  '
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={get_codes} ></RefreshControl>}      
        >
        <View  className='w-screen h-fit p-10 flex gap-3 justify-center items-center  ' >
          <View className='h-fit w-fit  rounded-md' style={styles.cardShadow} >
            <Image  source={{uri : image }}   className='' style={{width:160 , height:160 , borderRadius:60}} contentFit='contain' ></Image>
          </View>
          <Text className='text-white  ' style={{fontFamily: 'Nunito_400Regular', fontSize: 20}} >{name}</Text>
        </View>
        <View className='flex-row flex-wrap gap-3 justify-center items-center mb-32' >
            {
                actress_codes?.map((item,index)=>
                
                    <Item code={item} key={index} thumb={true} ></Item>
                )   
            }
          
        </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  cardShadow: {
   borderRadius: 60,
   backgroundColor: 'transparent',
   shadowColor: '#ffffff',
   shadowOffset: {
     width: 1,
     height: 1,
   },
   shadowOpacity: 0.22,
   shadowRadius: 4.22,
   elevation: 2,
  },
  cardContainer: {
   backgroundColor: '#fff',
   borderRadius: 16,
   overflow: 'hidden',
  },
  });

export default Actress_Info