import axios from "axios";

const api = process.env.REACT_APP_BACKEND_API + "/api/";

export const runMonitorActionAPI = async (userId) => {
  const res = await axios.get(api + "matchdata/monitor", {
    params: {
        userId: userId,
    },
  });
  return res;
};

export const updateDownloadDates = async (matchResultIds) => {
    const res = await axios.post(api + "matchdata/update", matchResultIds);
    return res;
}
