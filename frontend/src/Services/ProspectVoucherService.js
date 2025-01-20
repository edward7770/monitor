import axios from "axios";

const api = process.env.REACT_APP_BACKEND_API + "/api/";

export const createProspectVoucherAPI = async (data) => {
    const res = await axios.post(api + "prospectVoucher", data);
    return res.data;
};

export const updateVoucherClickEventAPI = async (voucherNumber) => {
    const res = await axios.post(api + "user/update-voucher-click", {voucherNumber: voucherNumber});
    return res.data;
}

export const getAllProspectVouchersAPI = async () => {
    const res = await axios.get(api + "prospectVoucher/all");
    return res.data;
};
