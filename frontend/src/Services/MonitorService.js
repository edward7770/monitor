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

export const updateDownloadDates = async (matchId, step) => {
    const res = await axios.post(api + "matchdata/update", { matchId: matchId, step: step });
    return res;
}

export const downloadMonitorFile = async (resultFileName, monitorNumber) => {
  const res = await axios.get(api + "matchdata/download", {
    params: {
      resultFileName: resultFileName,
      monitorNumber: monitorNumber
    },
  });
  return res;
}
