import { View, Text, ToastAndroid, TextInput, Pressable, Alert } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Storage } from 'expo-sqlite/kv-store';
import Entypo from '@expo/vector-icons/Entypo';


export const PlayList_Add = ({ playlistFunc }) => {
    const [searchInput, setSearchInput] = useState('');
    const [txtinput, setTxtinput] = useState('');
  
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
  
