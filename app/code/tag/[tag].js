import { View, Text, StatusBar, ScrollView, RefreshControl, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
// import { SafeAreaProvider } from 'react-native-safe-area-context'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Storage } from 'expo-sqlite/kv-store'
import Item from '../../../components/item'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font'
import { Nunito_400Regular } from '@expo-google-fonts/nunito'
import { Roboto_400Regular } from '@expo-google-fonts/roboto'


const Tag = () => {
  const {tag,tag_name} = useLocalSearchParams()
  const [tagCodes,setTagCodes] = useState([]);
  const [refreshing,setRefreshing] = useState(true);
 let [fontsLoaded] = useFonts({
      Roboto_400Regular,
      Nunito_400Regular
    });

  async function get_Tag_Codes(){
    const result = await Storage.getItem(tag.toString());
    // console.log(result)
    setTagCodes([...result.split(',')]);
    setRefreshing(false);
  }

  useEffect(()=>{
    get_Tag_Codes();
    // console.log(tagCodes)
  },[])

  return (
      <SafeAreaView className='w-screen h-full bg-neutral-900' >
      <StatusBar style='light' ></StatusBar>
      <View className='flex  pl-3 pt-2 w-screen '>
        <View className='' >
          <Text className='text-neutral-300 p-1' >Results : {tagCodes.length-1}</Text>
        </View>
      </View>
      <ScrollView className = "w-screen p-2 h-full mb-2 "
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={get_Tag_Codes} ></RefreshControl>}
          >  
          <View className='flex-row w-full  mt-2 mb-5 h-fit justify-between' >  
              <Pressable 
                  onTouchEnd={()=>{
                    // router.replace('/tags');
                    router.back();
                  }}
                  className='' >
                    <View
                      className='bg-yellow-500 w-fit h-fit ml-1 p-1  rounded-md '
                    >

                <Text className='' > 
                    <Ionicons name="chevron-back" size={30} color="black" />
                </Text>
                    </View>
              </Pressable>
              <View className='flex justify-center items-center w-2/4 h-fit  ' >
                <Text className='text-white  text-center  ' style={{fontFamily: 'Nunito_700Bold', fontSize: 24}} adjustsFontSizeToFit={true}  >{tag_name}</Text>
              </View>
              <View>

              </View>
          </View>
      
                {
                  tagCodes.map((item)=>item !== "" && <Item code={item} key={item} ></Item>)
                }
                
          </ScrollView>

      </SafeAreaView>
  )
}

export default Tag