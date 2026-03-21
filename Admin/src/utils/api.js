
import axiosInstance from "./axiosInstance";


export const fetchDataFromApi=async(url)=>{
    try{
        const {data} = await axiosInstance.get(url);
        return data;
    }catch(error){
        console.log(error);
        return error;
    }

}

export const postData = async (url, formData) => {
    try {
        const res = await axiosInstance.post(url, formData);
        return res.data;
    } catch (error) {
        return error.response?.data;
    }
};

export const editData = async(url , updatedData)=>{
    const res = await axiosInstance.put(url, updatedData);
    return res.data;
}

export const deleteData = async (url)=>{
    const res = await axiosInstance.delete(url);
    return res.data;
}