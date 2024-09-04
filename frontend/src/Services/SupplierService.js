import axios from "axios";

const api = process.env.REACT_APP_BACKEND_API + "/api/";

export const getSuppliersAPI = async () => {
    try {
        const res = await axios.get(api + 'supplier/');
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const createSupplierAPI = async (data) => {
    const res = await axios.post(api + "supplier/create", data);
    return res.data;
}

export const updateSupplierAPI = async (supplierId, data) => {
    const res = await axios.post(api + `supplier/update/${supplierId}`, data);
    return res.data;
}

export const createSupplierUserAPI = async (data) => {
    const res = await axios.post(api + "supplier/add-supplier-user", data);
    return res.data;
}