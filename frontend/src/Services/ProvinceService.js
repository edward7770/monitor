import axios from "axios";

const api = process.env.REACT_APP_BACKEND_API + "/api/";

export const getProvincesAPI = async () => {
    try {
        const res = await axios.get(api + 'province/');
        return res.data;
    } catch (error) {
        console.log(error);
        return [];
    }
};