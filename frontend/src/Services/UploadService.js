import axios from "axios";

const api = process.env.REACT_APP_BACKEND_API + "/api/";

export const addMatchAPI = async (data) => {
    const res = await axios.post(api + "match/create", data);
    return res;
}

export const addMatchDataAPI = async (data) => {
    const res = await axios.post(api + "matchdata/create", data);
    return res;
}

export const getMatchResultsAPI = async (clientId) => {
    const res = await axios.get(api + "match/" + clientId);
    return res;
}