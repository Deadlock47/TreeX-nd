// React and React Native
import { View, Text, Image, ActivityIndicator, Pressable, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';

// Expo Router
import { router } from 'expo-router';

// Expo SQLite
import { Storage } from 'expo-sqlite/kv-store';

// Axios
import axios from 'axios';

const Item = ({code,thumb}) => {
    const code_vid = code;
    // const thumb = thumb;
    let code_final = code_vid;
    // console.log(code_final);
    if(code_final.includes('-') || code_final.includes(' '))
    {
        code_final = code_final.split("-").join("");
        code_final = code_final.split(" ").join("");
    }
    const [loading , setLoading] = useState(true);
    const [data , setData] = useState({});
    const [noresult , setNoresult] = useState(false);

    const lowerCode = code_final.toLowerCase();

async function set_data(tag_code,_code)
{
    const result = await Storage.getItem(tag_code.toString());
    if(!result)
    {
        await Storage.setItem(tag_code.toString(),"");
    }
    const main_arr = result.split(',');
    let arr =  [...main_arr] 
    if(arr.includes(_code)) return;
    arr = [...arr,_code];
    arr = arr.join(',');
    await Storage.setItem(tag_code.toString(),arr);
}
async function store_code_for_tag(newTags,_code){
    newTags.forEach((item)=>{
        set_data(item.tag_id,_code);
    })
}

async function store_each_tag(newTags) {
        try {
            let storedTags = await Storage.getItem('tags_list');
            if (!storedTags) {
                storedTags = "{}";
                await Storage.setItem("tags_list", storedTags);
            }
            let tagMap = JSON.parse(storedTags);
            newTags.forEach(tag => {
                tagMap[tag.tag_id] = tag; 
            });
            await Storage.setItem("tags_list", JSON.stringify(tagMap));
        } catch (error) {
            console.log("Error storing tags:", error);
        }
    }
    
    async function set_studio_data(video_id,studio_name){
        try {
            const result = await Storage.getItem(video_id);
            if(!result)
            {
                await Storage.setItem(video_id,JSON.stringify(studio_name));
            }
            let arr = result.split(',');
            if(!arr.includes(video_id))
            {
                arr = [...arr,video_id];
            }
            await Storage.setItem(video_id,arr.join(','));
        } catch (error) {
            console.log(error);
        }
    }
    
    async function set_actress_data(actress_id , actress_data){
        try {
            
            const result = await Storage.getItem(actress_id);
            if(!result)
            {
                await Storage.setItem(actress_id,JSON.stringify(actress_data));
            }
            } catch (error) {
                console.log(error)   
            }
    }
    async function set_actress_list(actress_id) {
        try {
            const result = await Storage.getItem("actress_list")
            if(!result)
            {
                await Storage.setItem("actress_list","")
            }
            let arr = result?.split(',') || [];
            if(!arr.includes(actress_id))
            {
                arr = [...arr,actress_id];
            }
            let str_arr = arr.join(',');
            await Storage.setItem("actress_list",str_arr);
        } catch (error) {
            console.log(error);
        }
    }
    
    async function set_actress_video_codes(actress_id,video_code){
        try {
            const key_str = actress_id.toString()+"code";
            const result = await Storage.getItem(key_str)
            if(!result)
            {
                await Storage.setItem(key_str,"")
            }
            let arr = result?.split(',') || [];
            if(!arr.includes(video_code))
            {
                arr = [...arr,video_code];
            }
            let str_arr = arr.join(',');

            await Storage.setItem(key_str,str_arr);
            const result_finl = await Storage.getItem(key_str);

        } catch (error) {
            console.log(error);
        }
    }

    async function store_Actress(actress_id , actress_data, video_code){
        
         set_actress_list(actress_id.toString());
         set_actress_data(actress_id.toString(),actress_data);
         set_actress_video_codes(actress_id.toString(),video_code);
    }
    async function remove_code_from_list(code){
        try {
            const result = await Storage.getItem("code_list");
            
            let arr = result.split(',');
            arr = arr.filter(item => item !== code);
            await Storage.setItem("code_list",arr.join(","));
        } catch (error) {
            console.log(error);
        }
    }
    async function get_video_data(lowerCode){
        try {
            const cachedData = await Storage.getItem(code_vid);
            // console.log(code_vid);
            // console.log(cachedData);
            if(cachedData)
            {
                console.log("found cached data");
                // console.log("cached",cachedData)
                let parsed_data = cachedData;
                parsed_data = parsed_data.replace(`,${code}`,``)
                // console.log(parsed_data);
                // console.log(parsed_data);
                return JSON.parse(parsed_data);
            }
            else{
                console.log("Data not Found Calling api..")
                const response = await axios.get(`https://rn-jv.mytyper.workers.dev/code/${lowerCode}`);
                console.log(response.data ? true : false);
                const result = response.data;
                console.log(result)
                const jsonify_result = JSON.stringify(result);
                console.log(jsonify_result)
                if(result.status == '404')
                {
                    setNoresult(true);
                    console.log("No result for ",lowerCode);
                    return "";
                }
                // code list manage
                let code_lists = await Storage.getItem("code_list");
                let jav_codes = code_lists.split(",");
                if(!jav_codes.includes(result.id))
                    jav_codes = [...jav_codes,result.id];
                await Storage.setItem("code_list",jav_codes.join(","));
                
                await Storage.setItem(`${code}`,jsonify_result);
                // console.log(resp)
                return result;
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(()=>{
        setNoresult(false);
        
        const loadAsync = async ()=>{
            try {
                const data = await get_video_data(lowerCode);
                setData(data);
                if(data?.actress)
                {
                    for(let i=0;i<data.actress.length;i++)
                    {
                        store_Actress(data.actress[i].id,data.actress[i],data.id)
                    }
                }
                if(data?.tags)
                {
                    store_each_tag(data.tags);
                    store_code_for_tag(data.tags,data.id);
                }
                if(data?.details?.studio)
                {
                    set_studio_data(data?.id,data?.details?.studio);
                }
                
            } catch (error) {
                console.log(error)
            }
            finally{
                setLoading(false);
            }
        }
        loadAsync();

    },[code])
  return (
    //  loading ? (<Text>Loading...........</Text>)
    //     :
        
        <Pressable className={`${thumb ? 'w-[calc(48%)]' : 'w-full'} rounded-lg overflow-hidden bg-black h-auto mb-4 `} >
            {  

            
              thumb ?
                (
                    <View className="w-fit rounded-t-xl overflow-hidden h-fit p-1">
                    { loading ? 
                        <View>
                            <View className="flex items-center justify-center w-full h-72 bg-gray-800 rounded sm:w-96 dark:bg-gray-700">
                                <ActivityIndicator size="large" color="#d1d5db" />
                            </View>
                        </View> 
                    : noresult ?
                        <View className='flex justify-center items-center' >
                            <Image className=" rounded-t-xl " width={25} height={20} resizeMode='cover' source={require('../assets/nores-removebg-preview.png')} ></Image>
                            <Text style={{'color':'white'}} numberOfLines={2} className="p-1 font-bold ">NA : {code}</Text>
                        </View>
                        : 
                        <View onTouchEnd={()=>{ router.push(`/code/${code}`) }}>
                            <Image className=" rounded-t-xl " width={'auto'} height={248} resizeMode='contain' source={{uri : data?.poster_thumb }} ></Image>
                            <Text style={{'color':'white'}} numberOfLines={2} className="p-1 font-bold ">{data?.id}  {data?.title?.length && data?.title }</Text>
                        </View>
                     }   
                    </View>
                )
                :
                ( loading ? 
                    (
                <View>
                    <View className="flex items-center justify-center w-full p-4 h-64 bg-gray-800 rounded sm:w-96 dark:bg-gray-700">
                        <ActivityIndicator size="large" color="#ffffff" />
                    </View>
                </View> ) : 
                noresult ?
                (
                    <View className='flex justify-center items-center' >
                        <View className='p-1 flex-row justify-between  w-10 h-10 z-10 left-11  ' 
                            
                        >
                            <Text className='text-white bg-yellow-500 p-1 rounded-md ' 
                            onTouchEnd={
                                ()=>{
                                    get_video_data(lowerCode);
                                }
                            }
                            >Reload</Text>
                            <Text className='text-white  bg-yellow-500 p-1 rounded-md ' 
                            onTouchEnd={
                                ()=>{
                                    remove_code_from_list(code);
                                    ToastAndroid.show('Code Removed', ToastAndroid.SHORT);
                                }
                            }
                            >Delete</Text>

                        </View>
                        <Image className=" rounded-t-xl " width={30} height={20} resizeMode='cover' source={require('../assets/nores-removebg-preview.png')} ></Image>
                        <Text style={{'color':'white'}} numberOfLines={2} className="p-1 font-bold ">NA : {code}</Text>
                    </View>
                ):
                (
                    <View onTouchEnd={()=>{ router.push(`/code/${code}`) }} className="w-fit rounded-t-xl overflow-hidden h-fit p-1 " >
                        
                        <Image className=" rounded-t-xl " width={'auto'} height={248} resizeMode='contain' source={{uri : data?.poster}} ></Image>
                        <Text numberOfLines={2} style={{'color':'white'}} className="p-1 font-bold ">{data?.id}  {data?.title?.length && data?.title }</Text>
                    </View>)
                )
            }
            
        </Pressable>
    
    
  )
}

export default Item