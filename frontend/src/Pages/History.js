import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TablePagination } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { getMatchResultsAPI } from "../Services/UploadService";
import {
  getForm187RecordByRecordIdAPI,
  getForm193RecordByRecordIdAPI,
} from "../Services/FormDataService";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { updateDownloadDates } from "../Services/MonitorService";
import { createClientTransactionAPI } from "../Services/ClientTransactionService";
import { getUserAPI } from "../Services/AuthService";
import { toast } from "react-toastify";

const groupByDateMatched = (arr) => {
  const grouped = {};

  arr
    .sort((a, b) => new Date(a.dateMatched) - new Date(b.dateMatched))
    .forEach((item) => {
      const date = item.dateMatched.split(".")[0];
      if (item.downloadDate === "0001-01-01T00:00:00") {
        item.downloadDate = null;
      } else {
        item.downloadDate =
          item.downloadDate?.split("T")[0] +
          " " +
          item.downloadDate?.split("T")[1].split(".")[0];
      }
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });

  return Object.values(grouped);
};

function extractEmail(text) {
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = text.match(emailPattern);

  return match ? match[0] : null;
}

function extractFirst13DigitNumber(str) {
  const match = str.match(/\b\d{13}\b/);

  return match ? match[0] : null;
}

function arrayToCSV(array) {
  if (array.length === 0) return "";

  const headers = Object.keys(array[0]);
  const csvRows = [
    headers.join(","),
    ...array.map((row) =>
      headers
        .map((header) =>
          JSON.stringify(row[header], (key, value) =>
            value === null ? "" : value
          )
        )
        .join(",")
    ),
  ];

  return csvRows.join("\n");
}

function downloadCSV(array, filename = "data.csv") {
  const csvData = arrayToCSV(array);
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const link = window.document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
}

const History = (props) => {
  const { t } = useTranslation();
  const [rowData, setRowData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [selectedMatchResult, setSelectedMatchResult] = useState(null);
  const [isSetDownloaded, setIsSetDownloaded] = useState(false);
  //   const [fileDatas, setFileDatas] = useState([]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(parseInt(newPage));
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleDownloadBtn = (resultId) => {
    setOpenDownloadDialog(true);

    var matchedResult = resultId && rowData.filter((x) => x.id === resultId);
    if (matchedResult.length > 0) {
      setSelectedMatchResult(matchedResult[0]);
    }
  };

  const handleDownloadDialogClose = () => {
    setOpenDownloadDialog(false);
    setSelectedMatchResult(null);
  };

  const handleDownloadCSVFile = async (index, downloadDate) => {
    let extractedCSVRecords = [];
    let matchResultsIds = [];
    await Promise.all(
      selectedMatchResult.fileDatas[index].map(async (item) => {
        let formRecord = {};
        let extractedRecord = {};

        matchResultsIds.push({ id: item.id });

        if (item.type === "J193") {
          formRecord = await getForm193RecordByRecordIdAPI(item.recordId);
          extractedRecord = extractForm193Data(formRecord);
        } else {
          formRecord = await getForm187RecordByRecordIdAPI(item.recordId);
          extractedRecord = extractForm187Data(formRecord);
        }

        item.downloadDate =
          new Date().toISOString().split("T")[0] +
          " " +
          new Date().toISOString().split("T")[1].split(".")[0];

        extractedCSVRecords.push(extractedRecord);
      })
    );

    if (downloadDate !== null) {
      downloadCSV(extractedCSVRecords, "Monitor " + parseInt(index + 1));
    } else {
      var balanceAmount = user.balanceAmount - matchResultsIds.length * 199;
      if (balanceAmount > 0) {
        props.handleChangeBalance(balanceAmount);

        await updateDownloadDates(matchResultsIds)
          .then(async (res) => {
            if (res) {
              if (user && user.balanceType === "prepaid") {
                var clientTransactionObj = {
                  clientId: userId,
                  balanceId: user.balanceId,
                  matchId: selectedMatchResult.id,
                  records: matchResultsIds.length,
                  billValue: matchResultsIds.length * 199,
                  dateCreated: new Date(),
                  invoiceNumber: null,
                  invoiceStatus: null,
                };

                var response = await createClientTransactionAPI(
                  clientTransactionObj
                );

                if (response) {
                  setIsSetDownloaded(!isSetDownloaded);
                  downloadCSV(
                    extractedCSVRecords,
                    "Monitor " + parseInt(index + 1)
                  );
                }
              }
            }
          })
          .catch((err) => {
            console.log(err.response);
            toast.error("Failed to download file.");
          });
      } else {
        toast.warning(
          "The cost of the file exceeds your balance of R " + user.balanceAmount
        );
      }
    }
  };

  const DownloadCellRenderer = (params) => {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconButton
          onClick={() => handleDownloadBtn(params.data.id)}
          style={{
            cursor: "pointer",
            color: "#387CFE",
            margin: "auto",
          }}
          title="Download File"
        >
          <DownloadIcon style={{ fontSize: "20px" }} />
        </IconButton>
      </div>
    );
  };

  const extractForm193Data = (response) => {
    if (response.data) {
      var rawRecord = response.data.rawRecord.replace(/-/g, "");
      let [caseNumber, idNumber, name, particulars, noticeDate] = [
        "",
        "",
        "",
        "",
        "",
      ];
      if (
        rawRecord.includes("(2)") &&
        rawRecord.includes("(3)") &&
        rawRecord.includes("(4)") &&
        rawRecord.includes("(5)") &&
        rawRecord.includes("(6)")
      ) {
        caseNumber = rawRecord.split("(2)")[0].replace(/—/g, "");
        particulars = rawRecord.split("(2)")[1].split("(3)")[0];
        idNumber = particulars.split(", ")[3];
        name = particulars.split(", ")[1];
        noticeDate = response.data.noticeDate.split("T")[0];
      } else {
        caseNumber = rawRecord.split(", ")[0];
        particulars =
          rawRecord.split(", ")[1] +
          " " +
          rawRecord.split(", ")[2] +
          " " +
          rawRecord.split(", ")[3] +
          " " +
          rawRecord.split(", ")[4] +
          " " +
          rawRecord.split(", ")[5] +
          " " +
          rawRecord.split(", ")[6] +
          " " +
          rawRecord.split(", ")[7];
        name = rawRecord.split(", ")[1];
        idNumber = rawRecord.split(", ")[3];
        noticeDate = response.data.noticeDate.split("T")[0];
      }

      let itemObject = {
        caseNumber: caseNumber,
        idNumber: idNumber,
        name: name,
        particulars: particulars,
        noticeDate: noticeDate,
        rawRecord: rawRecord,
      };

      return itemObject;
    }
  };

  const extractForm187Data = (response) => {
    if (response.data) {
      var rawRecord = response.data.rawRecord.replace(/-/g, "");
      let [
        caseNumber,
        idNumber,
        name,
        particulars,
        noticeDate,
        description,
        spousedetails,
        period,
        executorName,
        executorPhone,
        executorEmail,
        advertiserDetails,
      ] = ["", "", "", "", "", "", "", "", "", "", "", ""];
      if (
        rawRecord.includes("(2)") &&
        rawRecord.includes("(3)") &&
        rawRecord.includes("(4)") &&
        rawRecord.includes("(5)") &&
        rawRecord.includes("(6)")
      ) {
        caseNumber = rawRecord.split("(2)")[0].replace(/—/g, "");
        particulars = rawRecord.split("(2)")[1].split("(3)")[0];
        idNumber = extractFirst13DigitNumber(rawRecord);
        name = particulars.split(", ")[1].split(" (")[0];
        description = response.data.rawRecord
          .split("(3)")[1]
          .split("(4)")[0]
          .replace(/;/g, "");
        noticeDate = response.data.noticeDate.split("T")[0];
        spousedetails = rawRecord
          .split("(4)")[1]
          .split("(5)")[0]
          .replace(/;/g, "");
        period = rawRecord.split("(5)")[1].split("(6)")[0];
        advertiserDetails = response.data.rawRecord.split("(6)")[1];
        executorName = advertiserDetails.split("; ")[0];
        if (advertiserDetails.includes("Tel: ")) {
          executorPhone = advertiserDetails.split("Tel: ")[1];
          executorPhone = executorPhone.trim();
        }

        executorEmail = extractEmail(advertiserDetails)
          ?.trim()
          .replace(/;/g, "");
      } else {
        if (rawRecord.includes("(2)")) {
          caseNumber = rawRecord.split("(2)")[0].replace(/—/g, "");
        }
        if (rawRecord.includes("(3)")) {
          particulars = rawRecord.split("(2)")[1].split("(3)")[0];
          name = particulars.split(", ")[1].split(" (")[0];
        }
        if (rawRecord.includes("(4)" && rawRecord.includes("(3)"))) {
          description = response.data.rawRecord
            .split("(3)")[1]
            .split("(4)")[0]
            .replace(/;/g, "");
        }
        if (rawRecord.includes("(5)") && rawRecord.includes("(4)")) {
          spousedetails = rawRecord
            .split("(4)")[1]
            .split("(5)")[0]
            .replace(/;/g, "");
        }
        if (rawRecord.includes("(5)") && rawRecord.includes("(6)")) {
          period = rawRecord.split("(5)")[1].split("(6)")[0];
          advertiserDetails = response.data.rawRecord.split("(6)")[1];
          executorName = advertiserDetails.split("; ")[0];
          if (advertiserDetails.includes("Tel: ")) {
            executorPhone = advertiserDetails.split("Tel: ")[1];
            executorPhone = executorPhone.trim();
          }
          executorEmail = extractEmail(advertiserDetails)
            ?.trim()
            .replace(/;/g, "");
        }

        idNumber = extractFirst13DigitNumber(rawRecord);
        noticeDate = response.data.noticeDate.split("T")[0];
      }

      let itemObject = {
        caseNumber: caseNumber,
        idNumber: idNumber,
        name: name,
        particulars: particulars,
        noticeDate: noticeDate,
        description,
        spousedetails,
        period,
        executorName,
        executorPhone,
        executorEmail,
        rawRecord: rawRecord,
      };

      return itemObject;
    }
  };

  const columnDefs = [
    {
      headerName: "Upload Date",
      field: "uploadDate",
      filter: false,
      sortable: false,
      flex: 1,
    },
    {
      headerName: "File Name",
      field: "fileName",
      filter: false,
      sortable: false,
      flex: 1,
    },
    {
      headerName: "Id numbers Count",
      field: "countIdNumbers",
      filter: false,
      sortable: false,
      flex: 1,
    },
    {
      headerName: "J187 Count",
      field: "countJ187",
      filter: false,
      sortable: false,
      flex: 1,
    },
    {
      headerName: "J193 Count",
      field: "countJ193",
      filter: false,
      sortable: false,
      flex: 1,
    },
    {
      headerName: "Download",
      field: "id",
      filter: false,
      sortable: false,
      width: 200,
      headerClass: "header-center",
      cellRenderer: DownloadCellRenderer,
    },
  ];

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  useEffect(() => {
    document.title = "Monitor | History";

    const user = JSON.parse(window.localStorage.getItem("user"));
    if (user) {
      setUserId(user.userId);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        var tempUser = await getUserAPI(userId);
        if (tempUser) {
          setUser(tempUser);
        }
      }
    };

    fetchUserData();
  }, [userId, isSetDownloaded]);

  useEffect(() => {
    const fetchMatchResults = async () => {
      var response = await getMatchResultsAPI(userId);
      var tempMatchResults = [];

      if (response.data.length > 0) {
        response.data.forEach((result) => {
          var fileDatas = groupByDateMatched(result.matchResults);
          var countJ187 =
            result.matchResults.length > 0 &&
            result.matchResults.filter((x) => x.type === "J187").length;
          var countJ193 =
            result.matchResults.length > 0 &&
            result.matchResults.filter((x) => x.type === "J193").length;

          let matchItem = {
            id: result.id,
            uploadDate:
              new Date(result.uploadDate).toISOString().split("T")[0] +
              " " +
              new Date(result.uploadDate)
                .toISOString()
                .split("T")[1]
                .split(".")[0],
            fileName: result.fileName,
            countIdNumbers: result.records,
            countJ187: countJ187,
            countJ193: countJ193,
            fileDatas: fileDatas,
          };

          tempMatchResults.push(matchItem);
        });
      }

      if (tempMatchResults.length > 0) {
        setRowData(tempMatchResults);
      }
    };

    fetchMatchResults();
  }, [userId, isSetDownloaded]);

  return (
    <>
      <div className="container-fluid">
        <div className="row mt-4">
          <div className="col-xl-12">
            <div className="card custom-card">
              <div className="card-header">
                <div className="card-title">History Of Matched Results</div>
              </div>
              <div className="card-body">
                <div className="ag-theme-quartz" style={{ width: "100%" }}>
                  <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    domLayout="autoHeight"
                    suppressPaginationPanel={false}
                  />
                  <div className="gridjs-footer1">
                    <div className="gridjs-pagination d-flex justify-content-between align-items-center">
                      <div className="gridjs-summary pl-4 hidden md:block">
                        Showing <b>{pageSize * currentPage + 1}</b> to{" "}
                        <b>{pageSize * (currentPage + 1)}</b> of{" "}
                        <b>{rowData.length}</b> results
                      </div>
                      <div className="dashboard-data-table">
                        <TablePagination
                          rowsPerPageOptions={[10, 20, 50]}
                          component="div"
                          count={rowData.length}
                          rowsPerPage={pageSize}
                          onGridReady={onGridReady}
                          page={currentPage}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          labelRowsPerPage={t("rows_per_page")}
                          style={{ marginRight: "10px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={openDownloadDialog}
        onClose={handleDownloadDialogClose}
        maxWidth="lg"
        fullWidth={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Download Files of Matched Results
          <hr />
        </DialogTitle>
        <DialogContent>
          <div className="w-100">
            {selectedMatchResult &&
              selectedMatchResult.fileDatas.map((file, index) => (
                <div
                  className={`${
                    !file[0]?.downloadDate
                      ? "shadow-md bg-slate-100"
                      : "bg-slate-50"
                  } flex items-center justify-between p-2 mt-2 rounded-md`}
                  //   shadow-md mb-2 hover:shadow-lg
                  key={index}
                >
                  <div className="flex items-center">
                    <i className="fa fa-file-pdf-o text-2xl"></i>
                    <div className="ml-4">
                      <h5 className="text-md" style={{ fontSize: "16px" }}>
                        Monitor {parseInt(index + 1)}
                      </h5>
                      {file[0]?.downloadDate && (
                        <p className="text-sm" style={{ fontSize: "12px" }}>
                          Last Downloaded Date: {file[0]?.downloadDate}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="float-right">
                    <IconButton
                      onClick={() =>
                        handleDownloadCSVFile(index, file[0]?.downloadDate)
                      }
                      style={{
                        cursor: "pointer",
                        color: "#387CFE",
                        margin: "auto",
                      }}
                      title="Download File"
                    >
                      <DownloadIcon style={{ fontSize: "20px" }} />
                    </IconButton>
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
        <DialogActions>
          <div className="row mr-3">
            <button
              onClick={handleDownloadDialogClose}
              className="btn btn-primary btn-block mr-auto mr-2"
            >
              {t("close")}
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default History;
