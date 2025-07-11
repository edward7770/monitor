import axios from "axios";

const api = process.env.REACT_APP_BACKEND_API + "/api/";

export const getForm193RecordsAPI = async (
  currentPage,
  pageSize,
  sortModel,
  filterModel,
  searchOption
) => {
  try {
    const response = await axios.get(api + "data/form193", {
      params: {
        page: currentPage,
        pageSize: pageSize,
        sortColumn: sortModel.length > 0 ? sortModel[0].colId : "",
        sortDirection: sortModel.length > 0 ? sortModel[0].sort : "asc",
        search: filterModel || "",
        searchOption: searchOption || "",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getForm187RecordsAPI = async (
  currentPage,
  pageSize,
  sortModel,
  search,
  searchOption
) => {
  try {
    const response = await axios.get(api + "data/form187", {
      params: {
        page: currentPage,
        pageSize: pageSize,
        sortColumn: sortModel.length > 0 ? sortModel[0].colId : "",
        sortDirection: sortModel.length > 0 ? sortModel[0].sort : "asc",
        search: search || "",
        searchOption: searchOption || "",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getForm193RecordByRecordIdAPI = async (recordId) => {
  const res = await axios.get(api + "data/form193/" + recordId);
  return res.data;
};

export const getForm187RecordByRecordIdAPI = async (recordId) => {
  const res = await axios.get(api + "data/form187/" + recordId);
  return res.data;
};

export const createSearchLogAPI = async (data) => {
  const res = await axios.post(api + "data/searchLog", data);
  return res;
};

export const runImport193API = async (data) => {
  const res = await axios.post(api + "data/import193", data);
  return res;
};

export const runImport187API = async (data) => {
  const res = await axios.post(api + "data/import187", data);
  return res;
};

export const getAllImportsAPI = async () => {
  const res = await axios.get(api + "data/import");
  return res.data; 
}

export const getAllMonitorHistoriesAPI = async () => {
  const res = await axios.get(api + "data/monitor");
  return res.data; 
}

export const getSearchLogsAPI = async () => {
  try {
    const res = await axios.get(api + "data/searchLog/");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
