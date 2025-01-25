import { View, Text, Image,ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { router } from 'expo-router';
import { SQLiteStorage, Storage } from 'expo-sqlite/kv-store';
import * as SQLite from 'expo-sqlite';


const Item = (props) => {
    let code_tmp = props.code;
    var code_final = code_tmp;
    if(code_tmp.includes('-') || code_tmp.includes(' '))
    {
        code_final = code_tmp.split("-").join("");
        code_final = code_final.split(" ").join("");
    }
    const thumb = props.thumb;
    const [video_available,setVideo_available] = useState(false);
    const [loading , setLoading] = useState(true);
    const [data , setData] = useState(null);
    const lowerCode = code_final.toLowerCase();
       
    async function get_video_data_(lowerCode){
        try {
            const cachedData = await Storage.getItem(code_tmp);
            if(cachedData)
            {
                console.log("Data Found in local Storage");
                return JSON.parse(cachedData);
            }
            else{
                console.log("Data not Found Calling api..")
                const response = await axios.get(`https://rn-jv.mytyper.workers.dev/code/${lowerCode}`);
                const result = response.data;

                // code list manage
                let code_lists = await Storage.getItem("code_list");
                let jav_codes = code_lists.split(",");
                if(!jav_codes.includes(result.id))
                    jav_codes = [...jav_codes,result.id];
                await Storage.setItem("code_list",jav_codes.join(","));

                // result return
                await Storage.setItem(result.id,JSON.stringify(result));
                return result;
            }
        } catch (error) {
            console.log(error)
            
        }
    }


   
    	
    // async function checkprac()
    // {
    //     await Storage.removeItem(code_tmp);
    // }

    useEffect(()=>{

        const loadAsync = async ()=>{
            try {
                const data = await get_video_data_(code_final);
                setData(data);
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
        
        <View className={`${thumb ? 'w-[calc(48%)]' : 'w-full'} rounded-lg overflow-hidden bg-black h-auto mb-4 `} onTouchEnd={()=>{
                      router.push(`/code/${code_tmp}`)
                  }}>
            {    
            
              thumb ?
                (
                    <View className="w-fit rounded-t-xl overflow-hidden h-fit p-1">
                    { loading ? 
                        <View>
                            <View className="flex items-center justify-center w-full h-72 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                                <ActivityIndicator size="large" color="#d1d5db" />
                            </View>
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
                    <View className="flex items-center justify-center w-full p-4 h-64 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                        <ActivityIndicator size="large" color="#d1d5db" />
                    </View>
                </View> ) : (
                    <View  className="w-fit rounded-t-xl overflow-hidden h-fit p-1 " >
                        <Image className=" rounded-t-xl " width={'auto'} height={248} resizeMode='contain' source={{uri : data?.poster}} ></Image>
                        <Text numberOfLines={2} style={{'color':'white'}} className="p-1 font-bold ">{data?.id}  {data?.title?.length && data?.title }</Text>
                    </View>))
            }
            
        </View>
    
    
  )
}

export default Item