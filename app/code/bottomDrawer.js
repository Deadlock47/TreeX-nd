import { View, Text, ToastAndroid, TextInput, Pressable, Alert } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Storage } from 'expo-sqlite/kv-store';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useLocalSearchParams } from 'expo-router';

const BottomPlaylistDrawer = ({code,refBottom}) => {

    const [playlists, setPlaylists] = useState([]);

    
    async function set_Playlist(txt) {
        try {
            const arr = await Storage.getItem('playlist');
            console.log('ffgfgfgfdgf', txt);
            let nw = arr.split(',');
            console.log(nw);
            if (!nw.includes(txt)) {
            nw = [...nw, txt];
            }

            await Storage.setItem('playlist', nw.join(','));
            ToastAndroid.show('Playlist Updated ✔️', ToastAndroid.SHORT);
            get_playlist();
        } catch (error) {
            console.log(error);
        }
    }
    
    async function get_playlist() {
        const playlist = await Storage.getItem('playlist');
        setPlaylists(playlist.split(','));
    }
    
    
    const snapPoints = useMemo(() => ['60%'], []);
    const handleSheetChanges = useCallback((index) => {
        if (index === -1) {
          console.log('closing');
        //   setBottomSheetState('closed');
        } else {
          console.log('opening');
        //   setBottomSheetState('opened');
        }
      }, []);
    const handleClosePress = () => refBottom.current?.close();
    const handleOpenPress = () => refBottom.current?.expand();
    useEffect(()=>{
        get_playlist();
    },[]);
return (
    <BottomSheet ref={refBottom} snapPoints={snapPoints} index={-1} enableDynamicSizing={false}
        onChange={handleSheetChanges}
    >
            <BottomSheetScrollView className="bg-neutral-900 p-0 h-full"
                
            >
              <View className="p-3">
                <View className="flex-row justify-end">
                  <Pressable onTouchEnd={handleClosePress} className="rounded-xl mb-3">
                    <Text className="text-center text-white">
                        
                      <Entypo name="cross" size={26} color="white" />
                    </Text>
                  </Pressable>
                </View>
                <PlayList_Add playlistFunc={set_Playlist}></PlayList_Add>
                <View className="flex gap-4">
                  {playlists?.map((item, index) => item !== '' && <Playlist_Item item={item} key={index} code={code}></Playlist_Item>)}
                </View>
              </View>
            </BottomSheetScrollView>
          </BottomSheet>
  )
}

const PlayList_Add = ({ playlistFunc }) => {
  const [searchInput, setSearchInput] = useState('');
  const [txtinput, setTxtinput] = useState('');

  return (
    <View className="mb-3 flex-row justify-between rounded-full mt-3 mr-2 ml-2 items-center border border-neutral-500">
      <TextInput
        value={txtinput}
        onChangeText={setTxtinput}
        placeholder="Add New Playlist"
        placeholderTextColor={'lightgray'}
        className="text-white pb-3 pt-3 pl-6 flex-1 text-base tracking-wider"
      ></TextInput>
      <Pressable
        onPress={() => {
          setSearchInput(txtinput);
          playlistFunc(txtinput);
          setTxtinput('');
          setSearchInput('');
        }}
        className="rounded-full p-3 m-1 bg-neutral-700"
      >
        <Entypo name="add-to-list" size={24} color="white" />
      </Pressable>
    </View>
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
      className="w-auto p-3 bg-neutral-800 rounded-lg"
    >
      <Text className="text-white">
        {item}
        {'\t'}
        {check && <AntDesign name="checksquare" size={16} color="green" />}
      </Text>
    </Pressable>
  );
};



export default BottomPlaylistDrawer