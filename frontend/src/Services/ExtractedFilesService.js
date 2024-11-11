import axios from "axios";

const api = process.env.REACT_APP_BACKEND_API + "/api/";

export const extractFilesAPI = async (userId) => {
    const res = await axios.get(api + "extract", {
        params: {
            userId: userId || ""
        }
    });
    return res;
}


export const extractedFilesHistoryAPI = async () => {
    const res = await axios.get(api + "extract/history");
    return res.data;
}