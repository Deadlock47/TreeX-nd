// Expo SQLite
import { Storage } from "expo-sqlite/kv-store";

// Functions
export async function insert_data_localarr(key, value) {
    const result = await Storage.getItem(key);
    let arr = result.split(',');
    arr = [...arr, value];
    arr = arr.join(",");
    await Storage.setItem(key, arr);
}

export async function delete_data_local(key, value) {
    const result = await Storage.getItem(key);
    let arr = result.split(",");
    let final_arr = arr.filter((item) => item !== value);
    final_arr = final_arr.join(",");
    await Storage.setItem(key, final_arr);
}

export async function search_data_local(key, value) {
    const result = await Storage.getItem(key);
    const arr = result.join(',');
    for (let i = 0; i < arr.length; i++)
        if (arr[i] == value)
            return true;
    return false;
}

// ["EBOD-625", "EBOD-682", "EBOD-716", "EBOD-744", "EBVR-057", "EKDV-600", "IPX-169", "IPX-201", "IPX-222", "JUR-182", "OKS-123", "ROE-170", "TKJUR-166", "URE-075", "URE-076", "URE-091", "actress_list", "code_list", "test"]
// EBOD-875,IPX-222,IPX-169,IPX-189,EBOD-798,WAAA-123,JUQ-187,JUQ-189,TKMIMK-197,JUQ-539,MEYD-933,JUL-859,SDMF-012