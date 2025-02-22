import { View, Text, Pressable, RefreshControl, ToastAndroid, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Storage } from 'expo-sqlite/kv-store';
import Item from '../../../components/item';

import { Nunito_400Regular } from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';

const index = () => {
  const {playlist} = useLocalSearchParams();
  // console.log(typeof playlist);
  const [codes,setCodes] = useState([]);
  const [refreshing,setRefreshing] = useState(true);

   let [fontsLoaded] = useFonts({
        Nunito_400Regular
      });

  async function get_playlist_codes(playlist){
    try {
      
      const result = await Storage.getItem(playlist);
      // console.log("ttttt",result);
      setCodes(result.split(','));
      // console.log(codes);
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
          <Pressable 
              onTouchEnd={()=>{
                Alert.alert(
                  'Delete Playlist',
                  'Are you sure you want to delete this playlist?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => ToastAndroid.show('Cancelled Delete', ToastAndroid.SHORT),
                      style: 'cancel'
                    },
                    { text: 'OK', onPress: async () => {
                      if(playlist === "Favourite")
                      {
                        ToastAndroid.show('Cannot delete Favourite Playlist', ToastAndroid.SHORT);
                        return;
                      }
                      ToastAndroid.show('Deleted Playlist', ToastAndroid.SHORT);
                      const result = await Storage.getItem("playlist");
                      let arr = result.split(',');
                      arr = arr.filter(item=>item !== playlist);
                      await Storage.setItem("playlist", arr.join(','));
                      await Storage.removeItem(playlist);
                      router.back();
                      } 
                  }
                  ]
                )
              }}
              className='bg-yellow-500 ml-1 p-1  rounded-md ' >
            <Text className='' > 
            <MaterialCommunityIcons name="delete" size={30} color="black" />
            </Text>
          </Pressable>
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