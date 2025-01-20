import axios from "axios";

const api = process.env.REACT_APP_BACKEND_API + "/api/";

export const createProspectAPI = async (data) => {
    const res = await axios.post(api + "prospect/create", data);
    return res.data;
};

export const getAllProspectListAPI = async () => {
    const res = await axios.get(api + "prospect");
    return res.data;
};

export const getProspectsByListIdAPI = async (prospectListId) => {
    const res = await axios.get(api + "prospect/" + prospectListId);
    return res.data;
}

export const createProspectNoteAPI = async (data) => {
    const res = await axios.post(api + "prospect/note", data);
    return res.data;
};
