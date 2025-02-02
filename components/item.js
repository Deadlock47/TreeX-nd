import { View, Text, Image,ActivityIndicator, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { router } from 'expo-router';
import { SQLiteStorage, Storage } from 'expo-sqlite/kv-store';
import * as SQLite from 'expo-sqlite';


const Item = (props) => {
    let code_tmp = props.code;
    const thumb = props.thumb;
    var code_final = code_tmp;
    if(code_tmp.includes('-') || code_tmp.includes(' '))
    {
        code_final = code_tmp.split("-").join("");
        code_final = code_final.split(" ").join("");
    }
    const [loading , setLoading] = useState(true);
    const [data , setData] = useState(null);
    const [noresult , setNoresult] = useState(false);

    const lowerCode = code_final.toLowerCase();

async function set_data(tag_code,code)
{
    const result = await Storage.getItem(tag_code.toString());
    if(!result)
    {
        await Storage.setItem(tag_code.toString(),"");
    }
    const main_arr = result.split(',');
    let arr =  [...main_arr] 
    if(arr.includes(code)) return;
    arr = [...arr,code];
    arr = arr.join(',');
    await Storage.setItem(tag_code.toString(),arr);
}
async function store_code_for_tag(newTags,code){
    newTags.forEach((item)=>{
        console.log(item)
        set_data(item.tag_id,code);
    })
}

async function store_each_tag(newTags) {
    try {
        // Retrieve existing tags (stored as an object)
        let storedTags = await Storage.getItem('tags_list');

        // Initialize as an empty object if storage is empty
        if (!storedTags) {
            storedTags = "{}";
            await Storage.setItem("tags_list", storedTags);
        }

        let tagMap = JSON.parse(storedTags);

        // Merge new tags into the tagMap
        newTags.forEach(tag => {
            tagMap[tag.tag_id] = tag; // Overwrites if tag already exists
        });

        // Store back the updated object
        await Storage.setItem("tags_list", JSON.stringify(tagMap));

        // Debugging: Check stored data
        console.log("Updated tags list:", await Storage.getItem("tags_list"));

        } catch (error) {
            console.log("Error storing tags:", error);
        }
    }
    
    
    async function set_actress_data(actress_id , actress_data){
        try {
            
            const result = await Storage.getItem(actress_id);
            // console.log("first",result)
            
            if(!result)
            {
                await Storage.setItem(actress_id,JSON.stringify(actress_data));
            }
            else{
                console.log("actress_already_present")
                return 0;
            }
            const result_finl = await Storage.getItem(actress_id);
            console.log("actress data",result_finl);    
            console.log("actress_added");
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
            console.log("video_added");
            const result_finl = await Storage.getItem("actress_list");
            console.log("lists",result_finl);

        } catch (error) {
            console.log(error);
        }
    }
    
    async function set_actress_video_codes(actress_id,video_code){
        try {
            const key_str = actress_id.toString()+"code";
            console.log(typeof key_str)
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
            console.log("video_added");

            const result_finl = await Storage.getItem(key_str);
            console.log("code ",key_str,result_finl);

        } catch (error) {
            console.log(error);
        }
    }

    async function store_Actress(actress_id , actress_data, video_code){
        
         set_actress_list(actress_id.toString());
         set_actress_data(actress_id.toString(),actress_data);
         set_actress_video_codes(actress_id.toString(),video_code);
         
         console.log("Data Loading Completes... Here!!")
    
    }
    async function get_video_data_(lowerCode){
        try {
            const cachedData = await Storage.getItem(code_tmp);
            if(cachedData)
            {
                console.log("Data Found in local Storage");
                console.log(JSON.parse(cachedData))
                return JSON.parse(cachedData);
            }
            else{
                console.log("Data not Found Calling api..")
                const response = await axios.get(`https://rn-jv.mytyper.workers.dev/code/${lowerCode}`);
                const result = response.data;
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
                await Storage.setItem(result.id,JSON.stringify(result));
                return result;
            }
        } catch (error) {
            console.log(error)
            
        }
    }

    useEffect(()=>{

        const loadAsync = async ()=>{
            try {
                // await Storage.clear();
                const data = await get_video_data_(lowerCode);
                setData(data);
                console.log(data.poster_thumb)
                if(data.actress)
                {
                    for(let i=0;i<data.actress.length;i++)
                    {
                        
                        // console.log(data.actress[i])
                        store_Actress(data.actress[i].id,data.actress[i],data.id)
                    }
                }
                if(data.tags)
                {
                    store_each_tag(data.tags);
                    store_code_for_tag(data.tags,data.id);
                }
                
                // const result = await Storage.getItem("actress_list");
                // console.log(JSON.parse(result));
            } catch (error) {
                console.log(error)
            }
            finally{
                setLoading(false);
            }
        }
        loadAsync();

    },[code_tmp])
  return (
    //  loading ? (<Text>Loading...........</Text>)
    //     :
        
        <Pressable className={`${thumb ? 'w-[calc(48%)]' : 'w-full'} rounded-lg overflow-hidden bg-black h-auto mb-4 `} onTouchEnd={()=>{
                      router.push(`/code/${code_tmp}`)
                  }}>
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
                            <Text style={{'color':'white'}} numberOfLines={2} className="p-1 font-bold ">NA : {code_tmp}</Text>
                        </View>
                        : 
                        <View>
                            <Image className=" rounded-t-xl " width={'auto'} height={248} resizeMode='contain' source={{uri : data?.poster_thumb ? data?.poster_thumb : '../assets/nores-removebg-preview.png'}} ></Image>
                            <Text style={{'color':'white'}} numberOfLines={2} className="p-1 font-bold ">{data?.id}  {data?.title?.length && data?.title }</Text>
                        </View>
                     }   
                    </View>
                    )
                :( loading ? 
                    (
                <View>
                    <View className="flex items-center justify-center w-full p-4 h-64 bg-gray-800 rounded sm:w-96 dark:bg-gray-700">
                        <ActivityIndicator size="large" color="#d1d5db" />
                    </View>
                </View> ) : (
                    <View  className="w-fit rounded-t-xl overflow-hidden h-fit p-1 " >
                        <Image className=" rounded-t-xl " width={'auto'} height={248} resizeMode='contain' source={{uri : data?.poster}} ></Image>
                        <Text numberOfLines={2} style={{'color':'white'}} className="p-1 font-bold ">{data?.id}  {data?.title?.length && data?.title }</Text>
                    </View>))
            }
            
        </Pressable>
    
    
  )
}

export default Item