import axios from "axios";

const api = process.env.REACT_APP_BACKEND_API + "/api/";

export const getClientsAPI = async () => {
    try {
        const res = await axios.get(api + 'client/');
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const createClientAPI = async (data) => {
    const res = await axios.post(api + "client/create", data);
    return res.data;
}