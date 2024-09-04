import axios from "axios";

const api = process.env.REACT_APP_BACKEND_API + "/api/";

export const addDocAPI = async (data) => {
    const res = await axios.post(api + "upload", data);
    return res;
}

export const previewAPI = async (path) => {
    try {
        const response = await fetch(api + `upload/preview/${path}`);
        if (!response.ok) {
            throw new Error('Failed to fetch document');
        }
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error fetching document:', error);
        throw error; // Re-throw the error to be caught by the caller
    }
}

export const supplierAddDocAPI = async (data) => {
    const res = await axios.post(api + "upload/supplier", data);
    return res;
}

export const deleteDocAPI = async (docId) => {
    const res = await axios.delete(api + `upload/${docId}`);
    return res;
}