import { Storage } from "expo-sqlite/kv-store";

export async function insert_data_localarr(key,value){
    const result = await Storage.getItem(key);
    let arr = result.split(',');
    arr = [...arr,value];
    arr = arr.join(",")
    await Storage.setItem(key,arr);
    // return arr;
}
export async function delete_data_local(key,value) {
    const result = await Storage.getItem(key);
    let arr = result.split(",");
    let final_arr = arr.filter((item)=>item!==value);
    final_arr = final_arr.join(",");
    await Storage.setItem(key,final_arr)
}
export async function search_data_local(key,value) {
    const result = await Storage.getItem(key);
    const arr = result.join(',');
    for(let i = 0 ; i < arr.length;i++)
        if(arr[i] == value)
            return true;
    return false;
}