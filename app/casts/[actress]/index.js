import { View, Text, StyleSheet, ScrollView, Dimensions, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider ,SafeAreaView} from 'react-native-safe-area-context';
import { Image } from 'expo-image';
// import { useFonts } from 'expo-font';
import {  useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import { Nunito_400Regular } from '@expo-google-fonts/nunito';
// import Item from '../../components/item';
import Item from '../../../components/item';
import { LinearGradient } from 'expo-linear-gradient';
import { Storage } from 'expo-sqlite/kv-store';


// let {width , height} = Dimensions.get('window')

const Actress_Info = () => {
    const params = useLocalSearchParams();
    const {actress,name , image} = params;
    // const actress = data.name;
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
        refresh();
    }
    useEffect(()=>{
        // refresh();
        get_codes();
        console.log(actress_codes)
    },[name])

    // // console.log(actress , image , actress_code)
  return (
    <SafeAreaProvider className='w-screen h-full bg-neutral-900' >
      <SafeAreaView className="w-screen h-full bg-neutral-900" >
        <StatusBar style='auto' ></StatusBar>
        <ScrollView 
          className='w-screen h-auto  p-2  '
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} ></RefreshControl>}      
        >
        <View  className='w-screen h-fit p-10 flex gap-3 justify-center items-center  ' >
          <View className='h-fit w-fit  rounded-md' style={styles.cardShadow} >
            <Image  source={{uri : image }}   className='' style={{width:140 , height:140 , borderRadius:60}} contentFit='contain' ></Image>
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