import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as SQLite from 'expo-sqlite';
import Item from '../components/item';
import { Storage } from 'expo-sqlite/kv-store';

const search = () => {
  const [status, setStatus] = useState('start');
  const db = SQLite.useSQLiteContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [bulk, setBulk] = useState(false);
  const [bulkValue,setBulkValue] = useState("");
  const [txtinput, setTxtinput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchPress, setSearchPress] = useState(false);
  const [bulkStatus,setBulkStatus] = useState(0);
  const [finalBulkValue,setFinalBulkValue] = useState("");

  const pause = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  async function set_bulk_video_storage(codes){
    try {
      const result = await Storage.getItem("code_list");  
      let jav_codes = codes.split(",");
      if(!result)
      {
        await Storage.setItem("code_list","");
      }
      const final_result = result.split(",");
      jav_codes = [...new Set([...final_result,...jav_codes])];  
      await Storage.setItem("code_list",jav_codes.join(","));
    } catch (error) {
      console.log(error);
    }
  }

  async function bulkValueCorrect(codes)
  {
    try {
      
      let nw_codes = codes.split(",");
      nw_codes = nw_codes.filter(code__ => code__ !== "" );
      console.log('nw_codes:',nw_codes)
      // await pause(2000);
      const value = nw_codes.map(__code__ => {
        if(__code__ === "") return "";
        const cleanedCode = __code__.replace(/\s+/g, '');
        const match = cleanedCode.match(/^([a-zA-Z]+)(\d+)$/);
        if (match) {
          const letters = match[1].toUpperCase();
        const numbers = match[2];
        return `${letters}-${numbers}`;
      }
      return __code__;
    });
    console.log('fgfgfg',value)
    setFinalBulkValue(value.join(","));
  } catch (error) {
    console.log(error);
  }
  }


  return (
    <SafeAreaProvider className="h-full bg-neutral-700">
      <SafeAreaView className="bg-neutral-800 w-screen h-full">
        <StatusBar backgroundColor='transparent'></StatusBar>

        <View className="flex-row w-fit justify-center items-center">
          <View className='mb-3 flex-row justify-between rounded-full mt-3 mr-2 ml-2 items-center border border-neutral-500'>
            <TextInput
              value={txtinput}
              onChangeText={setTxtinput}
              numberOfLines={3}
              placeholder='Search'
              placeholderTextColor={'lightgray'}
              className='text-white text-wrap pb-3 pt-3 pl-6 flex-1 text-base tracking-wider'
            ></TextInput>

            <TouchableOpacity
              onPress={() => {
                setSearchInput(txtinput);
                if (searchPress) {
                  setTxtinput("");
                  setSearchInput("");
                }
                setSearchPress(!searchPress);
              }}
              className='rounded-full p-3 m-1 bg-neutral-700'
            >
              {
                searchPress ?
                  <FontAwesome name="remove" size={24} color="white" />
                  :
                  <FontAwesome name="search" size={24} color="white" />
              }
            </TouchableOpacity>
          </View>
        </View>
        {/* add in bulk */}

        { bulk &&
          <View className=' absolute top-32 flex gap-3  bg-black w-[calc(90%)] m-6 z-20 h-auto p-4 '  >
            <View className=' flex items-end w-fit' >
              <View onTouchEnd={()=>setBulk(false)} className='w-fit h-fit' >
                <Text className='text-white w-fit text-3xl px-2 pb-1 rounded-md h-fit text-center bg-yellow-700' >x</Text>
              </View>
            </View>
            {
               bulkStatus === 0 ? 
               <TextInput 
               style={{
                 textAlignVertical: 'top',
                 color:'lightgray'
               }}
               multiline={true}
               value={bulkValue}
               onChangeText={(text)=>{setBulkValue(text)}}
               numberOfLines={12}   className='w-fit h-80 bg-neutral-700 text-wrap' ></TextInput> :
              bulkStatus === 1
              ?
               <View className='w-full h-80' >
                 <Text className='text-white text-wrap' >{finalBulkValue}</Text>
               </View>
               :
               <View className='w-full h-full' >
                 <ActivityIndicator size="large" color="#d1d5db" />
               </View>
            }
            <Pressable className=' w-fit h-fit rounded-xl'  onTouchEnd={()=>{
              if(bulkStatus === 0) // TextInput
              {
                setBulkStatus(2);
                // console.log("ffffff",bulkValue)
                bulkValueCorrect(bulkValue);
                setBulkStatus(1);
              }
              else if(bulkStatus === 1) // Corrected Values
              {
                setBulkStatus(2);
                // Add to database
                const codes = finalBulkValue.split(",");
                // console.log("adding to db",codes);
                set_bulk_video_storage(finalBulkValue);
                setBulkStatus(0);
                setBulk(false);
              }
              // 2 is loading
            }} >
              <Text className='text-white rounded-xl p-3 text-center bg-yellow-700 ' >Add To Database {finalBulkValue.length > 0 && finalBulkValue.split(',').length }</Text>
            </Pressable>
        </View>
        }
        <View className='p-2 px-6' >
        
        <Pressable
            onTouchEnd={() => {
              // router.back();
              setBulk(true);
            }}
            className="  rounded-md"
          >
            <View className='bg-[#8f6a14]  h-14 flex rounded-lg justify-center items-center p-2   ' >

            <Text className='text-center text-neutral-200 ' >
              Add In Bulk
            </Text>
            </View>
          </Pressable>
        </View>
        {/* Search Results */}
        <View className="w-screen h-screen">
          <ScrollView>
            <View className='gap-4 w-screen mb-40 p-3 flex-row flex-wrap justify-start'>
              {
                searchInput !== '' &&
                searchInput.split(',').map((item, key) => {
                  let code_final = item;
                  if (item.includes('-') || item.includes(' ')) {
                    code_final = item.split("-").join("");
                    code_final = item.split(" ").join("");
                  }
                  return item !== "" && <Item  code={code_final} key={key} thumb={true}></Item>
                })
              }
            </View>
          </ScrollView>

          <TouchableOpacity>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default search