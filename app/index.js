// React and React Native
import { View, Text, ScrollView, Image, Switch, RefreshControl, Alert, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';

// Expo Router
import { Link, router } from 'expo-router';

// Expo SQLite
import { Storage } from 'expo-sqlite/kv-store';

// Expo Clipboard
import * as Clipboard from 'expo-clipboard';

// Status Bar
import { StatusBar } from 'expo-status-bar';

// Safe Area
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Icons
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';

// Components
import Item from '../components/item';

const index = () => {
    const [jav_list , setJav_list] = useState([]);
    const [refreshing,setRefreshing] = useState(true);

    async function refresh_data()
    {
      const result = await Storage.getItem("code_list");
      // console.log(result);
      //
      await Storage.clear();
      await Clipboard.setStringAsync(result);
      

    }

    async function get_jav_lists() {
      const lists = await Storage.getItem("code_list");
      console.log(lists)
      if(!lists)
      {
         await Storage.setItem("code_list","");
      }

      setJav_list(lists.split(","));
      // console.log(jav_list)
      // let code_lists = await Storage.getItem("code_list");
      setRefreshing(false);
    }
    
    
    useEffect(()=>{
      get_jav_lists();
    },[])
  return (
    <SafeAreaProvider className='h-full bg-neutral-700'>
      <SafeAreaView className=" bg-neutral-900 w-screen h-full" >
          <StatusBar  ></StatusBar>
          <View className="flex-row items-center justify-between py-4 px-3   " >
            <Entypo onPress={()=>{
                // refresh_data();
                // router.replace("/")
                Alert.alert("Refresh","Are you sure you want to refresh the data?",
                  [
                    {
                      text: 'NO',
                      onPress: () => ToastAndroid.show('Cancel Pressed', ToastAndroid.SHORT),
                      style: 'cancel',
                    },
                    {
                      text: 'YES',
                      onPress: () => {
                        refresh_data()
                        ToastAndroid.show('Data Refreshed and Copied', ToastAndroid.SHORT);
                        setRefreshing(true);
                        setRefreshing(false);
                      }
                
                    }
                  ],

                )
            }} className="bg-[#b28300] rounded-2xl p-1" name="menu" size={40} color="white" />
            <Feather onPress={()=>{
                router.push("/searchScreen")
            }} name="search" size={34} color="white" className="bg-[#ca9401] rounded-2xl p-2" />
            
          </View>
          <View className=' w-screen h-10 flex-row items-center justify-between' >
              <View className='bg-yellow-500 pl-2 ml-3 w-fit h-8 text-center flex-row items-center justify-center p-1 rounded-xl'>
                <Text>Sort By </Text>
              </View>
              <View className=' flex-row justify-center items-center w-auto h-10'>
                <Text className='text-white  '>Change layout</Text>
                <Switch trackColor={{false: '#767577', true: '#81b0ff'}}
          // thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
           className='w-fit text-white h-fit'></Switch>
              </View>

          </View>
          <View className='flex justify-end pl-3 pt-2 w-screen '>
            <View className='' >
              <Text className='text-neutral-300 p-1' >Results : {jav_list.length-1}</Text>
            </View>
          </View>
          <ScrollView className = "w-screen p-2  h-fit "
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={get_jav_lists} ></RefreshControl>}
            
          >
              
                {/* 
                 
                 
                 
                 <Item code={'IPX-201'}></Item> */}

                 {/* <Item  code={'IPX-169'}></Item>
                 <Item code={'IPX-222'}></Item>
                 <Item code={'EBOD-875'}></Item>

                <Item code={'IPX-201'}></Item>
                */}
                {/* <Item code={'R170'}></Item> */}
                
                {
                  jav_list.map((item,index)=>item !== "" && <Item code={item} key={index} thumb_t={false} ></Item>)
                }
                <View className='mb-16' ></View>
          </ScrollView>

      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default index