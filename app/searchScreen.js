import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Item from '../components/item';
import * as SQLite from 'expo-sqlite';
import { ScrollView } from 'react-native';

const search = () => {
  const [status , setStatus] = useState('start')
  const db = SQLite.useSQLiteContext()
  const [loading , setLoading] = useState(false);
  const [data , setData] = useState({});
  const [txtinput , setTxtinput] = useState("");
  const [searchInput , setSearchInput] = useState("");

  async function fetch_code_data(code){
    setLoading(true);
    const response = await axios.get(`https://rn-jv.mytyper.workers.dev/code/${lowerCode}`);
    const result = response.data;
    setLoading(false);
    setData(result);
    // // console.log(result)
  }
  
  useEffect(()=>{
      if(txtinput.length < 4) setStatus("start")
  },[txtinput])
  return (
    <SafeAreaProvider className="h-full bg-neutral-700 " >
      <SafeAreaView className=" bg-neutral-800 w-screen h-full" >
      <StatusBar backgroundColor='transparent' ></StatusBar>
      <View className="flex-row w-screen justify-center items-center">
          <View className='mb-3 flex-row justify-between rounded-full mt-3 mr-2 ml-2 items-center border border-neutral-500' >
              <TextInput value={txtinput} onChangeText={setTxtinput}  placeholder='Search' placeholderTextColor={'lightgray'} 
              // onChangeText={handleSearchDebounce}
              className=' text-white pb-3 pt-3 pl-6 flex-1 text-base tracking-wider ' ></TextInput>

              <TouchableOpacity 
                  onPress={()=>{
                      // setStatus("loading");
                      setSearchInput(txtinput);
                  }}

                  className='rounded-full p-3 m-1 bg-neutral-700'
              >
                  <FontAwesome name="search" size={24} color="white" />
              </TouchableOpacity>

          </View>
          {/* 
            <View className="rounded-xl p-3 mr-4  h-14 bg-[#d3b107] ">
              <Text className="text-white text-center ">
                  <MaterialIcons name="playlist-add" size={28} color="white" />
              </Text>
            </View>
          */}
      </View>
    {/* ######################### */}
    <View className="w-screen h-screen " >
      {
        
        <ScrollView  showsVerticalScrollIndicator={false}>
        
         
          <View className='gap-4 w-screen mb-40  p-3 flex-row flex-wrap justify-start ' >
            {
                searchInput.length > 4 &&
                searchInput.split(',').map((item,key) =>
                {
                  let code_final = item;
                  if(item.includes('-') || item.includes(' '))
                  {
                    code_final = item.split("-").join("");
                    code_final = item.split(" ").join("");
                  }
                  // console.log(code_final)
                  return <Item isSearch={true} code={code_final} key={key} thumb={true} ></Item>
                }
                )
            }
          </View>
        </ScrollView>
      }
        {/* add to database button */}
        <TouchableOpacity>

        </TouchableOpacity>
    </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default search