import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { getAllImportsAPI } from "../Services/FormDataService";
import { toast } from "react-toastify";

const ImportHistory = () => {
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
      headerName: "Type",
      field: "type",
      filter: false,
      sortable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: "Start Date",
      field: "startDate",
      filter: false,
      sortable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: "End Date",
      field: "endDate",
      filter: false,
      sortable: false,
      minWidth: 180,
      flex: 1,
      cellRenderer: DownloadCellRenderer,
    },
    {
      headerName: "Records",
      field: "records",
      cellDataType: "number",
      filter: false,
      sortable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: "User Name",
      field: "name",
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
    document.title = "Monitor | Import History";

    const user = JSON.parse(window.localStorage.getItem("user"));
    if (user) {
      setUserId(user.userId);
    }
  }, []);

  useEffect(() => {
    let intervalId;
    const fetchImportsAsync = async () => {
      var response = await getAllImportsAPI();
      var tempImportResults = [];

      if (response.length > 0) {
        response.forEach((result) => {
          let matchItem = {
            id: result.id,
            startDate:
              new Date(result.startDate + 'Z').toISOString().split("T").join(" ").split(".")[0],
            endDate:
              result.endDate ? new Date(result.endDate + 'Z').toISOString().split("T").join(" ").split(".")[0] : null,
            type: result.type,
            records: result.records,
            name: result.name,
            progress: result.progress
          };

          tempImportResults.push(matchItem);
        });

        if(response[response.length - 1].endDate === null) {
          if (intervalId) {
            clearInterval(intervalId);
          }

          intervalId = setInterval(fetchImportsAsync, 1000);
        } else {
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      }

      if (tempImportResults.length > 0) {
        setRowData(tempImportResults);
      }
    };

    fetchImportsAsync();

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
                <div className="card-title">Import History</div>
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

export default ImportHistory;