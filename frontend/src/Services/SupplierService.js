import axios from "axios";

const api = process.env.REACT_APP_BACKEND_API + "/api/";

export const getSuppliersAPI = async () => {
    try {
        const res = await axios.get(api + 'client/');
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const createSupplierAPI = async (data) => {
    const res = await axios.post(api + "client/create", data);
    return res.data;
}

export const updateSupplierAPI = async (supplierId, data) => {
    const res = await axios.post(api + `client/update/${supplierId}`, data);
    return res.data;
}

export const createSupplierUserAPI = async (data) => {
    const res = await axios.post(api + "client/add-supplier-user", data);
    return res.data;
}