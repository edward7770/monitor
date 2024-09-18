import axios from "axios";

const api = process.env.REACT_APP_BACKEND_API + "/api/";

export const createClientTransactionAPI = async (data) => {
    const res = await axios.post(api + "transaction/create", data);
    return res.data;
}