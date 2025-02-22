// React and React Native
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ToastAndroid,Image, Dimensions, ScrollView, RefreshControl, StyleSheet, Pressable, Alert, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Storage } from 'expo-sqlite/kv-store';
import { useFonts } from 'expo-font';
import { Inter_900Black } from '@expo-google-fonts/inter';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import { Nunito_400Regular } from '@expo-google-fonts/nunito';
import VideoScreen from './player';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import ImageView from 'react-native-image-viewing';
import BottomPlaylistDrawer from './bottomDrawer';
import { StatusBar } from 'expo-status-bar';
import { PlayList_Add } from '../../components/playlistAdd';

let { width, height } = Dimensions.get('window');

const Code = () => {
  let [fontsLoaded] = useFonts({
    Inter_900Black,
    Roboto_400Regular,
    Nunito_400Regular,
  });

  const snapPoints = useMemo(() => ['80%'], []);
  const { code } = useLocalSearchParams();
  const bottomSheetRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({});
  const [screenshots, setScreenshots] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [showPlaylistBox,setShowPlaylistBox] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [loading,setLoading] = useState(false);

  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleOpenPress = () => bottomSheetRef.current?.expand();

    async function set_Favs(code){
      try {
        
        const result = await Storage.getItem('Favourite');
        let arr = result.split(',');
          // console.log(arr)
          // console.log("first",code)
          if (isFav) {
            arr = arr.filter((item) => item !== code);
            await Storage.setItem('Favourite', arr.join(','));
            setIsFav(false);
            
            ToastAndroid.show('Removed from Favourites', ToastAndroid.SHORT);
          } else {
            arr.push(code);
            await Storage.setItem('Favourite', arr.join(','));
            setIsFav(true);
            ToastAndroid.show('Added to Favourites', ToastAndroid.SHORT);
          }
        } catch (error) {
          console.log(error)
        }
              
    }
  async function check_Favs(code){
      try {
        
        const result = await Storage.getItem("Favourite");
        if(!result)
          {
            await Storage.setItem("Favourite","");
          }
      console.log(result)
      const arr = result.split(',') || [];
      if(arr.includes(code))
      {
        setIsFav(true);
      }
    } catch (error) {
      console.log(error)
    }
    // console.log(code)
  }

  async function get_playlist() {
    const playlist = await Storage.getItem('playlist');
    setPlaylists(playlist.split(','));
  }

  async function get_data(code) {
   try {
     setLoading(true);
     console.log("CODE paGE ",code)
     const result = await Storage.getItem(code);
     let parsed_data = result;
      parsed_data = parsed_data.replace(`,${code}`,``)
      // console.log(parsed_data);
     get_playlist();
     check_Favs(code);
    //  console.log(result)
    //  const result_main = result.slice(0,result.lastIndexOf(','));
     // console.log(playlists);
     setData(JSON.parse(parsed_data));
     setScreenshots(data?.screenshots);
     setRefreshing(false);
     setLoading(false);
   } catch (error) {
      console.log(error);
   }
  }

  useEffect(() => {
    setIsFav(false);
    get_data(code);
    // setLoading(false)
    // console.log("code",code);
  }, [code]);

  return (
    <SafeAreaView className="bg-neutral-900 w-screen h-full">
      
      { loading ? 
        <View className="flex justify-center items-center w-screen h-screen">
          <ActivityIndicator size="large" color="white" />
        </View>
      : 
      <View className='flex justify-center items-center' >
        {/* playlist box */}
        <View className={`${showPlaylistBox ? "" :'hidden'} absolute z-30 w-[calc(90%)] rounded-lg h-[calc(80%)] bg-neutral-800`} >
          <View className='flex-row p-4 justify-between' >
            <Text className='text-white' style={{fontFamily: 'Nunito_700Bold', fontSize: 26}} >Playlist</Text>
            <Pressable onTouchEnd={()=>setShowPlaylistBox(!showPlaylistBox)} className="rounded-xl bg-yellow-500 p-2  mb-3">
              <Text className="text-center text-white">
                <Entypo name="cross" size={26} color="white" />
              </Text>
            </Pressable>
          </View>
          <PlayList_Add></PlayList_Add>
          <ScrollView>
            <View className="flex gap-4 mt-3">
              {playlists?.map((item, index) => item !== '' && <Playlist_Item item={item} key={index} code={code}></Playlist_Item>)}
            </View>
          </ScrollView>
        </View>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={get_data} />}
        className="w-screen h-fit"
      >
      
        <View className="absolute flex-row justify-between  w-screen px-4  z-10">
          <Pressable
            onTouchEnd={() => {
              router.back();
            }}
            className="top-10  rounded-md"
          >
            <View className='bg-[#d4960781] h-fit p-1  ' >

            <Text>
              <Ionicons name="chevron-back" size={30} color="black" />
            </Text>
            </View>
          </Pressable>
          <Pressable
            onTouchEnd = {()=>{
              set_Favs(code)
              // console.log("set_favs")
            }}
            className="bg-yellow-500 flex justify-center items-center p-2 top-[calc(240px)] rounded-full"
          >
            <View className=''>

            <Text>
              {isFav ?
              <Ionicons name="heart-sharp" size={30} color="red" />
              :
              <Ionicons name="heart-outline" size={30} color="black" />}
            </Text>
              </View>
          </Pressable>
        </View>
      {/* <StatusBar ></StatusBar> */}
        <View className="w-fit h-fit">
          <Image className="" width={'auto'} height={260} contentFit="contain" source={{ uri: data?.poster }}></Image>
          <LinearGradient
            colors={['transparent', 'rgba(23, 23, 23, 0.7)', 'rgba(23, 23, 23, 1)']}
            style={{
              width,
              height: height * 0.1,
            }}
            start={{
              x: 0.5,
              y: 0,
            }}
            end={{
              x: 0.5,
              y: 1,
            }}
            className="absolute -bottom-0"
          ></LinearGradient>
        </View>
        <View className="w-screen">
          <Text style={{ color: 'white' }} className="p-3 -mt-4 text-base">
            <Text className="font-bold text-2xl">{data?.id}</Text> {'\n'}
            {data?.title}
          </Text>
        </View>
        <View className="flex-row mt-5 h-auto">
          <View className="h-fit p-2 flex justify-center items-center" width={width * 0.43}>
            <Image
              className="rounded-xl"
              width={120}
              height={160}
              contentFit="cover"
              source={{ uri: data?.poster_thumb ? data?.poster_thumb : '../assets/nores-removebg-preview.png' }}
            ></Image>
          </View>
          <View className="p-4 flex-col justify-center gap-2" width={width * 0.57}>
            <Text className="text-neutral-300">
              <Text>{'\u2022'} </Text>
              <Text className="font-bold">Release Date</Text> | {data?.details?.release_date}
            </Text>
            <Text className="text-neutral-300">
              <Text>{'\u2022'} </Text>
              <Text className="font-bold">Runtime</Text> | {data?.details?.runtime}
            </Text>
            <Text className="text-neutral-300">
              <Text>{'\u2022'} </Text>
              <Text className="font-bold">Director</Text> | {data?.details?.director}
            </Text>
            <Text className="text-neutral-300">
              <Text>{'\u2022'} </Text>
              <Text className="font-bold">Studio</Text> | {data?.details?.studio}
            </Text>
          </View>
        </View>
        <View className="px-5 mt-4">
          <Pressable className="p-3 bg-yellow-700 rounded-xl" onTouchEnd={()=>setShowPlaylistBox(!showPlaylistBox)}>
            <Text className="text-white text-center">Add to Playlist</Text>
          </Pressable>
        </View>
        <View className="w-full h-fit p-3">
          <View>
            <Text className="text-xl text-neutral-300 p-2">Tags:</Text>
          </View>
          <View className="w-fit h-fit flex flex-row flex-wrap gap-1 p-4">
            {data?.tags?.map((tag, key) => {
              return (
                <Pressable
                  onTouchEnd={() => {
                    router.push({ pathname: `/code/tag/${tag.tag_id}`, params: { tag_name: tag.name } });
                  }}
                  key={tag.tag_id}
                >
                  <Text className="w-fit bg-yellow-700 p-2 h-fit pt-2.5 pb-2.5 text-neutral-200" key={tag.tag_id}>
                    {tag.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        {data?.actress && (
          <View className="w-screen h-fit p-3">
            <Text className="text-neutral-300 text-xl p-2">Actress:</Text>
            <ScrollView horizontal className="w-screen h-auto flex-row gap-6 p-2">
              {data?.actress?.length > 0 &&
                data?.actress?.map((item, key) => (
                  <View key={key} className="w-fit h-full ml-4">
                    <Pressable
                      onTouchEnd={() => {
                        router.push({ pathname: `/code/actress/${item.id}`, params: { image: item.image, name: item.name } });
                      }}
                      className="w-fit h-fit"
                    >
                      <Image
                        borderRadius={40}
                        width={100}
                        height={100}
                        contentFit="cover"
                        source={{uri : item.image}}
                      ></Image>
                    </Pressable>
                    <Text className="text-center text-neutral-200">{item?.name}</Text>
                  </View>
                ))}
            </ScrollView>
          </View>
        )}
        <View className="mb-7 h-fit w-screen">
          <Text className="text-neutral-300 text-xl pl-5">Screenshots:</Text>
          <View className="p-4 w-screen flex-row justify-center flex-wrap gap-1 h-fit">
            {data?.screenshots &&
              data.screenshots.map((item, key) => (
                <Pressable
                  onTouchEnd={() => {
                    setImageIdx(key);
                    setCurrentIndex(key);
                    setVisible(true);
                  }}
                  key={key}
                  className="bg-red-400"
                >
                  <Image width={100} height={100} contentFit="cover" source={{ uri: item }}></Image>
                </Pressable>
              ))}
          </View>
          {data?.screenshots && (
            <ImageView
              images={data.screenshots.map((item) => {
                const url_item = item.includes('jp-') ? item : item.replace('-', 'jp-');
                return {
                  uri: url_item,
                };
              })}
              imageIndex={currentIndex}
              onImageIndexChange={(index) => setImageIdx(index)}
              HeaderComponent={() => {
                return (
                  <View className="h-16 bg-transparent w-full flex-row items-center justify-center">
                    <View className="w-fit mt-1">
                      <Text className="text-white text-center" style={styles.text}>{`${imageIdx + 1} / ${
                        data?.screenshots ? data.screenshots.length : 0
                      }`}</Text>
                    </View>
                  </View>
                );
              }}
              visible={visible}
              onRequestClose={() => setVisible(false)}
            />
          )}
        </View>
        <View className="w-screen h-fit mb-10">
          <Text className="text-neutral-200 text-xl pl-5">Trailer:</Text>
          <View>{data?.preview && <VideoScreen video_url={data?.preview}></VideoScreen>}</View>
        </View>
        </ScrollView>
      </View>
    }
    </SafeAreaView>
    
  );
};



const Playlist_Item = ({ item, code }) => {
  const [check, setCheck] = useState(false);
  console.log(item);
  async function checkData() {
    const result = await Storage.getItem(item);
    let res = result?.split(',') || [];
    // console.log(result);
    if (res.includes(code)) setCheck(true);
    console.log("running for",code,item,check)
  }
  async function addData(item, code) {
    try {
      console.log(' playlsit added scfuly');
      const result = await Storage.getItem(item);
      let res = result?.split(',') || [];
      if (!res.includes(code)) {
        res = [...res, code];
      }
      await Storage.setItem(item, res.join(','));
      Alert.alert('Playlist added successfully');
      ToastAndroid.show('Playlist Updated ✔️', ToastAndroid.SHORT);
      checkData();
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    checkData();
});
  return (
    <Pressable
      onTouchEnd={() => {
        if (!check) {
          addData(item, code);
        } else {
          Alert.alert('Playlist already added');
        }
      }}
      className="w-auto mx-5 p-3 bg-neutral-900 rounded-lg"
    >
      <Text className="text-white">
        {item}
        {'\t'}
        {check && <AntDesign name="checksquare" size={16} color="green" />}
      </Text>
    </Pressable>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});

export default Code;