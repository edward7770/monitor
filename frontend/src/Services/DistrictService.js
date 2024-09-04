import axios from "axios";

const api = process.env.REACT_APP_BACKEND_API + "/api/";

export const getDistrictsAPI = async (provinceId) => {
    try {
        const res = await axios.get(api + `district/${provinceId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return [];
    }
};