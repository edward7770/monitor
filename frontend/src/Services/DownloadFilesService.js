import axios from "axios";

const api = process.env.REACT_APP_BACKEND_API + "/api/";

export const downloadFilesAPI = async (userId) => {
    const res = await axios.get(api + "download", {
        params: {
            userId: userId || ""
        }
    });
    return res;
}


export const downloadFilesHistoryAPI = async () => {
    const res = await axios.get(api + "download/history");
    return res.data;
}