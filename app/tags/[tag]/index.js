import { View, Text, StatusBar, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
// import { SafeAreaProvider } from 'react-native-safe-area-context'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Storage } from 'expo-sqlite/kv-store'
import Item from '../../../components/item'

const Tag = () => {
  const {tag,tag_name} = useLocalSearchParams()
  const [tagCodes,setTagCodes] = useState([]);
  const [refreshing,setRefreshing] = useState(true);
  async function get_Tag_Codes(){
    const result = await Storage.getItem(tag.toString());
    console.log(result)
    setTagCodes([...result.split(',')]);
    setRefreshing(false);
  }

  useEffect(()=>{
    get_Tag_Codes();
    console.log(tagCodes)
  },[])

  return (
      <SafeAreaView className='w-screen h-full bg-neutral-900' >
      <StatusBar style='auto' ></StatusBar>
      <View className='w-screen h-auto p-4 bg-neutral-900' >
        <Text className='text-white text-3xl text-center font-bold ' >{tag_name}({tagCodes.length})</Text>
      </View>
      <ScrollView className = "w-screen p-2 h-full mb-20 "
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={get_Tag_Codes} ></RefreshControl>}
            
          >  
                {
                  tagCodes.map((item)=>item !== "" && <Item code={item} key={item} ></Item>)
                }
                
          </ScrollView>

      </SafeAreaView>
  )
}

export default Tag