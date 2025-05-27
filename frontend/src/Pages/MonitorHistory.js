import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { getAllMonitorHistoriesAPI } from "../Services/FormDataService";
import { toast } from "react-toastify";

const MonitorHistory = () => {
  const { t } = useTranslation();
  const [rowData, setRowData] = useState([]);
  const [userId, setUserId] = useState(null);

  const DownloadCellRenderer = (params) => {
    let processProgress = 0;
    processProgress = ((params.data.progress / params.data.records) * 100).toFixed(2);

    return (
      <div style={{ display: "flex", alignItems: "center"}}>
        {params.data.records === params.data.progress ? (
          <>
            {params.data.endDate}
          </>
        ) : (
          <div className="flex w-full" style={{flexDirection: 'column', justifyContent: 'center'}}>
            <div
              className="progress"
              style={{width: '100%', marginTop: '5px'}}
              role="progressbar"
              aria-valuenow="10"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="progress-bar progress-bar-striped"
                style={{ width: processProgress + "%" }}
              ></div>
            </div>
            <span className="text-center" style={{lineHeight: '20px'}}>{params.data.progress}/{params.data.records}: &nbsp;<span style={{fontWeight: '500'}}>{processProgress}%</span></span>
          </div>  
        )}
      </div>
    );
  };

  const columnDefs = [
    {
        headerName: "File Name",
        field: "fileName",
        filter: false,
        sortable: false,
        minWidth: 180,
        flex: 1,
    },
    {
      headerName: "Monitor",
      field: "monitor",
      filter: false,
      sortable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: "New J193",
      field: "j193Count",
      cellDataType: "number",
      filter: false,
      sortable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: "New J187",
      field: "j187Count",
      cellDataType: "number",
      filter: false,
      sortable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: "Created Date",
      field: "dateCreated",
      cellDataType: "string",
      filter: false,
      sortable: false,
      minWidth: 180,
      flex: 1,
    }
  ];

  // const onGridReady = (params) => {
  //   params.api.sizeColumnsToFit();
  // };

  const paginationPageSizeSelector = useMemo(() => {
    return [10, 20, 50];
  }, []);

  useEffect(() => {
    document.title = "Monitor | Monitor History";

    const user = JSON.parse(window.localStorage.getItem("user"));
    if (user) {
      setUserId(user.userId);
    }
  }, []);

  useEffect(() => {
    let intervalId;
    const fetchMonitorsAsync = async () => {
      var response = await getAllMonitorHistoriesAPI();
      var tempMonitorResults = [];

      if (response.length > 0) {
        console.log(response)
        response.forEach((result) => {
          let matchItem = {
            id: result.id,
            monitor: "Monitor " +  result.monitor,
            fileName: result.fileName,
            j193Count: result.j193Count,
            j187Count: result.j187Count,
            dateCreated: result.dateCreated.split("T")[0] + " " + result.dateCreated.split("T")[1].split(".")[0],
          };

          tempMonitorResults.push(matchItem);
        });

        if(response[response.length - 1].endDate === null) {
          if (intervalId) {
            clearInterval(intervalId);
          }

          intervalId = setInterval(fetchMonitorsAsync, 1000);
        } else {
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      }

      if (tempMonitorResults.length > 0) {
        setRowData(tempMonitorResults.sort((a,b) => new Date(b.createdDate) - new Date(a.createdDate)));
      }
    };

    fetchMonitorsAsync();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [userId]);

  return (
    <>
      <div className="container-fluid">
        <div className="row mt-4">
          <div className="col-xl-12">
            <div className="card custom-card">
              <div className="card-header">
                <div className="card-title">Monitor History</div>
              </div>
              <div className="card-body">
                <div className="ag-theme-quartz" style={{ width: "100%" }}>
                  <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    domLayout="autoHeight"
                    pagination={true}
                    suppressPaginationPanel={false}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    paginationPageSize={10}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MonitorHistory;