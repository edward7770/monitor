import axios from "axios";

const api = process.env.REACT_APP_BACKEND_API + "/api/";

export const createClientPaymentAPI = async (data) => {
    const res = await axios.post(api + "payment/create", data);
    return res.data;
}