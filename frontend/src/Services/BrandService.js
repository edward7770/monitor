import axios from "axios";

const api = process.env.REACT_APP_BACKEND_API + "/api/";

export const getBrandsAPI = async () => {
    try {
        const res = await axios.get(api + 'brand/');
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const addBrandAPI = async (data) => {
    const res = await axios.post(api + "brand/create", data);
    return res;
}

export const updateBrandStatusAPI = async (brandId, data) => {
    const res = await axios.post(api + `brand/status/${brandId}`, data);
    return res;
}


export const updateDeviceStatusAPI = async (type, deviceId, data) => {
    const res = await axios.post(api + `${type}/status/${deviceId}`, data);
    return res;
}