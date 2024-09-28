import axios from "axios";

const api = process.env.REACT_APP_BACKEND_API + "/api/";

export const getPricingListAPI = async (priceListId) => {
  const res = await axios.get(api + "pricing/list", {
    params: {
      priceListId: priceListId,
    },
  });
  return res.data;
};

export const getAllPricingListAPI = async () => {
  const res = await axios.get(api + "pricing");
  return res.data;
};

export const createPricingTierAPI = async (data) => {
  const res = await axios.post(api + "pricing/create", data);
  return res.data;
};

export const updatePricingTierAPI = async (priceId, data) => {
  const res = await axios.post(api + "pricing/update/" + priceId, data);
  return res.data;
};

export const deletePricingTierAPI = async (priceId) => {
  const res = await axios.post(api + "pricing/delete/" + priceId);
  return res.data;
};

export const dupliatePriceListAPI = async (data) => {
    const res = await axios.post(api + "pricing/duplicate", data);
    return res.data;
}
