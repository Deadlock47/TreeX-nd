// React and React Native
import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native';
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

// Safe Area
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Status Bar
import { StatusBar } from 'expo-status-bar';

const index = () => {

  let [fontsLoaded] = useFonts({
        Inter_900Black,
        Roboto_400Regular,
        Nunito_400Regular,
        Nunito_700Bold
      });
  const [tags,setTags] = useState([]);
  const [refreshing,setRefreshing] = useState(true);
  const [tagSections, setTagSections] = useState([]);


  function groupTagsByFirstLetter(tags) {
    // Sort tags alphabetically by tagname
    tags.sort((a, b) => a.name.localeCompare(b.name));

    let groupedTags = {};

    tags.forEach(tag => {
        let firstLetter = tag.name.charAt(0).toUpperCase(); // Get first letter and capitalize it

        if (!groupedTags[firstLetter]) {
            groupedTags[firstLetter] = [];
        }

        groupedTags[firstLetter].push(tag);
    });
    // console.log(groupedTags)
    return groupedTags;
}


async function getSortedTags() {
  try {
      let storedTags = await Storage.getItem('tags_list');
      let tags = storedTags ? Object.values(JSON.parse(storedTags)) : [];

      return groupTagsByFirstLetter(tags);
  } catch (error) {
      console.log("Error retrieving sorted tags:", error);
      return {};
  }
}

const fetchTags = async () => {
  let sortedTags = await getSortedTags();

  // Convert object to an array of { title, data } for SectionList
  let sectionData = Object.keys(sortedTags).map(letter => ({
      title: letter,
      data: sortedTags[letter]
  }));

  setTagSections(sectionData);
  // console.log(tagSections)
  // setTagSections([])
  setRefreshing(false)
};

  useEffect(()=>{

  fetchTags();
  },[])
  return (
    <SafeAreaProvider className='h-screen bg-neutral-900 '>
      <SafeAreaView className='h-full w-screen bg-neutral-900' >
        <StatusBar style='light' ></StatusBar>
        
        <View className='h-16 mt-2 w-screen' >
          <Text className='text-white text-center  ' style={{fontFamily: 'Nunito_700Bold', fontSize: 30}}>Tags</Text>
        </View>
       
        <ScrollView className='mb-24'
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchTags} ></RefreshControl>}
          
        >
          
            {
              Object.entries(tagSections).map(([index, data]) => {
                // console.log(data.data,data.title)
                return (
                
    <View className='p-2' key={index}>
      <View className='w-8 h-8   flex bg-white  rounded-sm' >

        <Text className='text-center text-xl ' style={{ fontWeight: "bold" }}>{data.title}</Text>
      </View>
      <View className='flex gap-2 mb-4 mt-2 flex-row flex-wrap ' >

        {data.data.map(tag => {
          
          return (
          <Pressable onTouchEnd={()=>{ router.push({pathname : `/tags/${tag.tag_id}`,params : {tag_name : tag.name}}) }} key={tag.tag_id} className='' >
            <Text className='w-fit bg-yellow-700 p-2 h-fit pt-2.5 pb-2.5 text-neutral-200 ' key={tag.tag_id}>{tag.name}</Text>
          </Pressable>
          )
              }
      )
        }
      </View>
    </View>
              )}
            )
            }
            
        </ScrollView>
          
        
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default index