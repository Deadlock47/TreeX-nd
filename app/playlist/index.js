// React and React Native
import { View, Text, TextInput, TouchableOpacity, ScrollView, RefreshControl, Image } from 'react-native';
import React, { useEffect, useState } from 'react';

// Expo Router
import { router } from 'expo-router';

// Expo SQLite
import { Storage } from 'expo-sqlite/kv-store';

// Expo Fonts
import { useFonts } from 'expo-font';
import { Inter_900Black } from '@expo-google-fonts/inter';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';

// Icons
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';

// Playlist Image Data
import { playlist_image } from './data_img';

// Safe Area
import { SafeAreaView } from 'react-native-safe-area-context';

const index = () => {
    let [fontsLoaded] = useFonts({
          Inter_900Black,
          Roboto_400Regular,
          Nunito_400Regular,
          Nunito_700Bold
        });
    const [txtinput , setTxtinput] = useState("");
    const [searchInput , setSearchInput] = useState("");
    const [playlists ,setPlaylists] = useState([]);
    const [refreshing,setRefreshing] = useState(true)
    
    async function get_list()
    {
        try {
            const result = await Storage.getItem("playlist");
            console.log(result);
            if (!result) {
          await Storage.setItem("playlist", "Favourite");
          await Storage.setItem("Favourite", "");
            }
            // set_list("Favourite");
            const arr = result.split(",");
            setPlaylists(arr);
        } catch (error) {
            console.error("Error fetching playlist:", error);
        } finally {
            setRefreshing(false);
        }

    }
    async function set_list(name)
    {
      try {
        const result = await Storage.getItem("playlist");
        let arr = result ? result.split(',') : [];
        if (!arr.includes(name) && name.trim() !== "") {
          arr.push(name);
          await Storage.setItem(name, "");
          await Storage.setItem("playlist", arr.join(','));
        }
      } catch (error) {
        console.error("Error updating playlist:", error);
      }
    }

    useEffect(()=>{
      get_list();
      // set_list()
    },[])

  return (
    <SafeAreaView className='bg-neutral-900 h-full ' >
      <View className='w-screen' >
        <Text className='text-white text-center text-4xl pt-3  ' style={{fontFamily: 'Nunito_700Bold', fontSize: 30}} >PlayList</Text>
      </View>
      <View className='mb-3 flex-row justify-between rounded-full mt-3 mr-2 ml-2 items-center border border-neutral-500' >
              <TextInput value={txtinput} onChangeText={setTxtinput}  placeholder='Add Playlist' placeholderTextColor={'lightgray'} 
              // onChangeText={handleSearchDebounce}
              className=' text-white pb-3 pt-3 pl-6 flex-1 text-base tracking-wider ' ></TextInput>

              <TouchableOpacity 
                  onPress={()=>{ 
                      setSearchInput(txtinput);
                      // console.log(txtinput)
                      set_list(txtinput);
                  }}

                  className='rounded-full p-3 m-1 bg-neutral-700'
              >
                  <Entypo name="add-to-list" size={24} color="white" />
              </TouchableOpacity>
        </View>
        <ScrollView className='w-screen h-auto   p-2 '
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={get_list} ></RefreshControl>}
          
        >
          <View className='flex-row gap-5 mb-24 pl-5 mt-2 flex-wrap' >


            {
              playlists?.map((item,key)=> item!=="" && <Playlist_Item item={item} key={key} ></Playlist_Item>
              )
            }
          </View>
        </ScrollView>
    </SafeAreaView>
  )
}

const Playlist_Item = ({item})=>{

  const [isImage , setIsImage] = useState("");
  async function getImage() {
    
    for(let i=0;i<playlist_image.length;i++)
      {
        if(playlist_image[i].category.includes(item))
          setIsImage(playlist_image[i].image);
      }
  }
  useEffect(()=>{
    getImage()
  },[])
  let [fontsLoaded] = useFonts({
    Inter_900Black,
    Roboto_400Regular,
    Nunito_400Regular,
    Nunito_700Bold
  });
  return (
    <View 
      onTouchEnd={()=>{
        router.push(`/playlist/${item}`)
      }}
    className='w-[calc(45%)] rounded-xl   bg-neutral-700 overflow-hidden h-32 flex justify-center items-center ' >
        {
          isImage ? 
          <Image className=" rounded-t-xl bg-[#ffffff72] "  width={"100%"} height={'100%'} resizeMode='cover'  source={{uri : isImage.length>0 && isImage}} ></Image>
          : null
        }
        <Text className='text-white w-full text-center underline absolute underline-offset-1 text-2xl ' 
          style={{fontFamily: 'Nunito_700Bold', fontSize: 22}}
          adjustsFontSizeToFit={true}
          numberOfLines={1} 
        >
          {item}
        </Text>
    </View>
  )
}


export default index