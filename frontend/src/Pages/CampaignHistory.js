import React, { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { getAllProspectVouchersAPI } from "../Services/ProspectVoucherService";

const CampaignHistory = () => {
//   const { t } = useTranslation();
  const [rowData, setRowData] = useState([]);

  const columnDefs = [
    {
      headerName: "Subject",
      field: "subject",
      filter: false,
      sortable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: "Voucher Value",
      field: "voucherValue",
      filter: false,
      sortable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: "Emails Count",
      field: "emailsCount",
      filter: false,
      sortable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: "Clicked",
      field: "clickedCount",
      cellDataType: "string",
      filter: false,
      sortable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: "Claimed",
      field: "claimedCount",
      cellDataType: "string",
      filter: false,
      sortable: false,
      minWidth: 180,
      flex: 1,
    },
    {
        headerName: "Date Created",
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
    document.title = "Monitor | Campaign History";
  }, []);

  useEffect(() => {
    const fetchDataAsync = async () => {
      var response = await getAllProspectVouchersAPI();
      var tempVoucherResults = [];

      if (response.length > 0) {
        response.forEach((result) => {
          let matchItem = {
            id: result.id,
            subject: result.subject,
            voucherValue: result.voucherValue,
            bodyText: result.bodyText,
            emailsCount: result.emailsCount,
            clickedCount: `${result.clickedCount || 0}/${result.emailsCount || 0} (${(Number(result.claimedCount)/Number(result.emailsCount)*100).toFixed(2)}%)`,
            claimedCount: `${result.claimedCount || 0}/${result.emailsCount || 0} (${(Number(result.claimedCount)/Number(result.emailsCount)*100).toFixed(2)}%)`,
            dateCreated: result.dateCreated.split("T")[0] + " " + result.dateCreated.split("T")[1].split(".")[0]
          };

          tempVoucherResults.push(matchItem);
        });
      }

      if (tempVoucherResults.length > 0) {
        setRowData(tempVoucherResults);
      }
    };

    fetchDataAsync();
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row mt-4">
          <div className="col-xl-12">
            <div className="card custom-card">
              <div className="card-header">
                <div className="card-title">Campaign History</div>
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

export default CampaignHistory;