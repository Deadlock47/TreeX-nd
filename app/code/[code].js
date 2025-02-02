import { View, Text, Dimensions ,ScrollView, RefreshControl, StyleSheet, Pressable} from 'react-native'
import { Image } from 'expo-image'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Storage } from 'expo-sqlite/kv-store'
import { LinearGradient } from 'expo-linear-gradient'
import ImageView from "react-native-image-viewing";
import VideoScreen from './player'

let {width , height} = Dimensions.get('window')


const Code = () => {
  
  const {code} = useLocalSearchParams()

  const [visible,setVisible] = useState(false);
  const [data,setData] = useState({})
  const [screenshots,setScreenshots] = useState([]);
  const [refreshing,setRefreshing] = useState(true);
  const [imageIdx,setImageIdx] = useState(0);
  const [currentIndex,setCurrentIndex] = useState(0);
  // const [actressName , setActressName] = useState("");

  async function get_data(code) {
    // setData(await Storage.getItem(code))
    const result = await Storage.getItem(code);
    setData(JSON.parse(result))
    setScreenshots(data?.screenshots)
    // console.log(data)
    setRefreshing(false) 
    

  }
  function set_Images(){
    
    const arr = []
    
    // console.log(screenshots)
    // setScreenshots(arr);
  }
  useEffect(()=>{
    
      get_data(code)  
      if(data)
      {
        setScreenshots(data?.screenshots)
      }
      
      console.log(data)
      // // console.log(screenshots)
  },[code])
  return (
    // <SafeAreaProvider className="" >
      <SafeAreaView className=" bg-neutral-900 w-screen h-full" >
          <StatusBar backgroundColor='transparent' ></StatusBar>
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={get_data} ></RefreshControl>}
             
            className="w-screen h-fit">

              <View  className="w-fit  h-fit" >
                <Image className="  " width={'auto'} height={265} contentFit='contain' source={{uri : data?.poster}} ></Image>
                <LinearGradient
                  colors = {['transparent','rgba(23, 23, 23, 0.7)','rgba(23, 23, 23, 1)']}
                  // colors={['rgba(0,0,0,0.8)', 'transparent']}
                  style = {{
                    width  , 
                    height : height*0.1
                  }}
                  start = {{
                    x : 0.5 , y : 0
                  }}
                  end = {{
                    x : 0.5 , y : 1
                  }}
                  className='absolute -bottom-0'
                >

                </LinearGradient>
              </View>
              <View className="w-screen" >
                  <Text style={{'color':'white'}} className="p-3 -mt-4 text-base "><Text className=" font-bold text-2xl" >{data?.id}</Text> {"\n"}{data?.title }</Text>
              </View>
              <View className=" flex-row mt-5 h-auto " >
                  {/* left */}
                  <View className="h-fit p-2 flex justify-center items-center " width={width*0.43} >
                    <Image className=" rounded-xl " width={170} height={160} resizeMode='contain' source={{uri : data?.poster_thumb ? data?.poster_thumb : '../assets/nores-removebg-preview.png'}} ></Image>
                  </View>
                  {/* right */}
                  <View className=" p-4 flex-col justify-center gap-2  " width={width*0.57} >
                        <Text className="text-neutral-300 " >
                          <Text>{'\u2022'} </Text>
                          <Text className="font-bold">Release Date</Text> | { data?.details?.release_date }
                        </Text>
                        <Text className="text-neutral-300" >
                          <Text>{'\u2022'} </Text>
                          <Text className="font-bold">Runtime</Text> | {data?.details?.runtime}
                        </Text>
                        <Text className="text-neutral-300" >
                          <Text>{'\u2022'} </Text>
                          <Text className="font-bold">Director</Text> |  {data?.details?.director}
                        </Text>
                        <Text className="text-neutral-300" >
                          <Text>{'\u2022'} </Text>
                          <Text className="font-bold">Studio</Text> |  {data?.details?.studio}
                        </Text>
                  </View>
              </View>
                  {/* tags */}
              <View className=" w-full h-fit p-3 " >
                  <View>
                        <Text className=" text-xl text-neutral-300 p-2" >Tags:</Text>
                        <Text className='' >Load Tags</Text>
                  </View>
                  <View className="w-fit h-fit flex flex-row flex-wrap gap-1 p-4" >
                    {
                      data?.tags?.map((tag , key)=>{
                        // console.log(data.tags)
                        return (
                          <Pressable onTouchEnd={()=>{
                                     router.push({pathname : `/tags/${tag.tag_id}`,params : {tag_name : tag.name}})
                                   }} key={tag.tag_id} className='' >
                                     <Text className='w-fit bg-yellow-700 p-2 h-fit pt-2.5 pb-2.5 text-neutral-200 ' key={tag.tag_id}>{tag.name}</Text>
                                   </Pressable>
                        )
                      })
                      
                    }
                    
                  </View>
              </View>
              {/* actress  */}
              { data?.actress && (
                <View className="w-screen h-fit p-3" >
                    <Text className="text-neutral-300  text-xl  p-2" >Actress:</Text>
                    <ScrollView horizontal className="w-screen h-auto flex-row gap-6 p-2 " >
                     {
                     
                      data?.actress?.length > 0 && data?.actress?.map((item,key)=>(<View key={key} className="w-fit h-full ml-4 " >
                        <Pressable   onTouchEnd={()=>{
                          // console.log(item)
                                  router.push({pathname : `/casts/${item.id}`,params :{image : item.image , name : item.name}})
                                }} className="w-fit h-fit">
                          <Image borderRadius={40} width={100} height={100} contentFit='cover'  source={ item.image.includes("null") ?  require("../../assets/no_image_actress.jpg") : item.image  }
                          >
                          </Image>
                        </Pressable>
                        <Text className="text-center text-neutral-200" >{ item?.name}</Text>
                      </View>))
                    }
                    
                    </ScrollView>
              </View>)}
              {/* screenshots  */}
              <View className="mb-7 h-fit w-screen" >
                <Text className="text-neutral-300  text-xl pl-5" >Screenshots:</Text>
                 <View className="p-4 w-screen flex-row justify-center flex-wrap gap-1 h-fit" >

                    {
                    data?.screenshots && data.screenshots.map((item,key)=> <Pressable onTouchEnd={()=>{
                      setImageIdx(key)
                      // // console.log(key)
                      setCurrentIndex(key)
                      setVisible(true);
                    }}  key={key} className=' bg-red-400' >
                      <Image width={100} height={100} contentFit='cover'  source={{uri : item}} ></Image>
                    </Pressable>)
                    }
                 </View>
                  
                  {
                    data?.screenshots &&
                        <ImageView
                        images={data.screenshots.map((item)=>
                        {
                        
                        const url_item = item.includes("jp-") ?  item : item.replace("-","jp-");

                        return ({
                          uri : url_item
                        })
                      }
                      )}
                        imageIndex={currentIndex}
                        
                        // imageIndex={true}
                        onImageIndexChange={(index)=> setImageIdx(index)}
                        // imagesCount={data?.screenshots && data?.screenshots?.length}
                        HeaderComponent={()=>{
                        return (  <View className="h-16 bg-transparent w-full flex-row items-center justify-center " >
                            <View className="w-fit mt-1   " >
                              <Text className="text-white text-center " style={styles.text}>{`${imageIdx + 1} / ${data?.screenshots ? data.screenshots.length : 0}`}</Text>
                            </View>
                             
                          </View>)
                        }}
                        visible={visible}
                        onRequestClose={() => setVisible(false)}
                      />
                  }
                
              </View>
              <View className="w-screen h-fit mb-10 " >
                <Text className="text-neutral-200 text-xl pl-5  " >Trailer:</Text>
                <View>
                {data?.preview  
                && <VideoScreen video_url = {data?.preview}></VideoScreen>
                  
                }
                  </View>
              </View>
          </ScrollView>

          
      </SafeAreaView>
    // </SafeAreaProvider>
  )
}


const styles = StyleSheet.create({
 
  text: {
    fontSize: 17,
    color: "#FFF"
  }
});


export default Code