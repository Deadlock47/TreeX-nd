import { View, Text, Pressable, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Storage } from 'expo-sqlite/kv-store';
import Item from '../../../components/item';
import { Nunito_400Regular } from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';

const index = () => {
  const {playlist} = useLocalSearchParams();
  console.log(typeof playlist);
  const [codes,setCodes] = useState([]);
  const [refreshing,setRefreshing] = useState(true);

   let [fontsLoaded] = useFonts({
        Nunito_400Regular
      });

  async function get_playlist_codes(playlist){
    try {
      
      const result = await Storage.getItem(playlist);
      console.log("ttttt",result);
      setCodes(result.split(','));
      console.log(codes);
      setRefreshing(false);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    get_playlist_codes(playlist);
  },[]);

  return (
    <SafeAreaProvider  >
      <SafeAreaView className='w-screen bg-neutral-900 h-full '  >
        <ScrollView className='w-screen p-2 h-full mb-20 '
                      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={get_playlist_codes} ></RefreshControl>}
        
        >
        <View className='flex-row mt-2 mb-5 justify-between' >  
          <Pressable 
              onTouchEnd={()=>{
                router.back();
              }}
              className='bg-yellow-500 ml-1 p-1  rounded-md ' >
            <Text className='' > 
                <Ionicons name="chevron-back" size={30} color="black" />
            </Text>
          </Pressable>
          <View className='w-fit mt-2 h-auto  bg-neutral-900' >
            <Text className='text-white -ml-6 text-3xl text-center font-bold ' style={{fontFamily: 'Nunito_700Bold', fontSize: 30}} adjustsFontSizeToFit={true} >{playlist}({codes.length-1})</Text>
          </View>
          <View>
          </View>
      </View>
      <View className='flex-row flex-wrap gap-3 justify-center items-center mb-32' >
            {
                codes?.map((item,index)=> item !== "" &&
                    <Item code={item} key={index} thumb={true} ></Item>
                )   
            }
          
        </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default index