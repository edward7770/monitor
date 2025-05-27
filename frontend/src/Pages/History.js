import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
// import * as XLSX from "xlsx";
// import { TablePagination } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { getMatchResultsAPI } from "../Services/UploadService";
// import {
//   getForm187RecordByRecordIdAPI,
//   getForm193RecordByRecordIdAPI,
// } from "../Services/FormDataService";
import {
  IconButton,
  Badge,
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

function formatNumber(number) {
  if(number !== 0 || number !== null) {
    return "R " + number.toLocaleString('en-US', {
        maximumFractionDigits: 2
    });
  } else {
    return "R 0";
  }
}

// const groupByMatchedStep = (arr) => {
//   const grouped = {};

//   arr
//     .sort((a, b) => new Date(a.matchedStep) - new Date(b.matchedStep))
//     .forEach((item) => {
//       if (item.downloadDate === "0001-01-01T00:00:00") {
//         item.downloadDate = null;
//       } else {
//         item.downloadDate =
//           item.downloadDate?.split("T")[0] +
//           " " +
//           item.downloadDate?.split("T")[1].split(".")[0];
//       }
//       if (!grouped[item.matchedStep]) {
//         grouped[item.matchedStep] = [];
//       }
//       grouped[item.matchedStep].push(item);
//     });

//   return Object.values(grouped);
// };

// function arrayToCSV(array) {
//   if (array.length === 0) return "";
//   const J187headers = [
//     "Id Number",
//     "Case Number",
//     "Name",
//     "Particulars",
//     "Notice Date",
//     "Description of Account",
//     "Surviving Spouse Details",
//     "Period Of Inspection",
//     "Executor Name",
//     "Executor Phone Number",
//     "Executor Email",
//     "Raw Record",
//   ];
//   const J193headers = [
//     "Id Number",
//     "Case Number",
//     "Name",
//     "Particulars",
//     "Notice Date",
//     "Raw Record",
//   ];

//   const valuesJ187Array = array
//     .filter((x) => Object.values(x).length === 12)
//     .map((obj) => Object.values(obj));
//   const valuesJ193Array = array
//     .filter((x) => Object.values(x).length === 6)
//     .map((obj) => Object.values(obj));

//   const csv187Rows = [J187headers, ...valuesJ187Array];

//   const csv193Rows = [J193headers, ...valuesJ193Array];

//   return { csv187Rows: csv187Rows, csv193Rows: csv193Rows };
// }

// const downloadCSV = (array, filename = "Monitor.xlsx") => {
//   const csvData = arrayToCSV(array);

//   const workbook = XLSX.utils.book_new();

//   const worksheet1 = XLSX.utils.aoa_to_sheet(csvData.csv187Rows);
//   const worksheet2 = XLSX.utils.aoa_to_sheet(csvData.csv193Rows);

//   XLSX.utils.book_append_sheet(workbook, worksheet1, "J187");
//   XLSX.utils.book_append_sheet(workbook, worksheet2, "J193");

//   XLSX.writeFile(workbook, filename + ".xlsx");
// };

// function downloadCSV(array, filename = "Monitor.csv") {
//   const csvData = arrayToCSV(array);
//   const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
//   const link = window.document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.setAttribute("download", filename);
//   window.document.body.appendChild(link);
//   link.click();
//   window.document.body.removeChild(link);
// }

const History = (props) => {
  const { t } = useTranslation();
  const theme = useThemeMode();
  function useThemeMode() {
    const [theme, setTheme] = useState(
      document.documentElement.getAttribute("data-theme-mode") || "light"
    );
  
    useEffect(() => {
      const observer = new MutationObserver(() => {
        const newTheme = document.documentElement.getAttribute("data-theme-mode");
        setTheme(newTheme || "light");
      });
  
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme-mode"],
      });
  
      return () => observer.disconnect();
    }, []);
  
    return theme;
  }

  const [rowData, setRowData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  // const [currentPage, setCurrentPage] = useState(0);
  // const [pageSize, setPageSize] = useState(10);

  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [selectedMatchResult, setSelectedMatchResult] = useState(null);
  const [isSetDownloaded, setIsSetDownloaded] = useState(false);

  // const handleChangePage = (event, newPage) => {
  //   setCurrentPage(parseInt(newPage));
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setPageSize(parseInt(event.target.value, 10));
  //   setCurrentPage(0);
  // };

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

  const downloadMonitorFile = async (fileName, monitorNumber) => {
    try {
      // Fetch the file
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/Uploads/MatchedFiles/${fileName}`);
      
      // Check if the response is okay
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Create a Blob from the response
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', "Monitor" + monitorNumber + ".xlsx"); // Set the desired file name

      // Append to the body
      document.body.appendChild(link);
      // Programmatically click the link to trigger the download
      link.click();
      // Remove the link from the document
      document.body.removeChild(link);
      // Release the Blob URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDownloadCSVFile = async (index, downloadDate) => {
    // let extractedCSVRecords = [];
    // await Promise.all(
    //   selectedMatchResult.fileDatas[index].map(async (item) => {
    //     let extractedRecord = {};

    //     if (item.type === "J193") {
    //       extractedRecord = await getForm193RecordByRecordIdAPI(item.recordId);
    //     } else {
    //       extractedRecord = await getForm187RecordByRecordIdAPI(item.recordId);
    //     }

    //     extractedCSVRecords.push(extractedRecord);
    //   })
    // );

    if (downloadDate !== null) {
      var response = await updateDownloadDates(selectedMatchResult.id, index);

      if (response) { 
        await Promise.all(
          selectedMatchResult.resultMonitorFiles[index].downloadDate = response.data.downloadDate.split("+")[0]
        );

        await downloadMonitorFile(selectedMatchResult.resultMonitorFiles[index].fileName, index+1);
      }

      // downloadCSV(extractedCSVRecords, "Monitor " + parseInt(index + 1));
    } else {
      const selectedMonitorFile = selectedMatchResult.resultMonitorFiles[index];
      var matchedRecordsCount = selectedMonitorFile.count187 + selectedMonitorFile.count193;

      var balanceAmount =
        user.balanceAmount - matchedRecordsCount * user.price;

      var clientTransactionObj = {
        clientId: userId,
        balanceId: user.balanceId,
        balanceType: user.balanceType,
        matchId: selectedMatchResult.id,
        fileName: selectedMatchResult.fileName,
        monitor: index + 1,
        records: matchedRecordsCount,
        billValue: matchedRecordsCount * user.price,
        balance: balanceAmount,
        dateCreated: new Date(),
        invoiceNumber: null,
        invoiceStatus: null,
      };

      await createClientTransactionAPI(clientTransactionObj)
        .then(async (res) => {
          if (res) {
            var response = await updateDownloadDates(selectedMatchResult.id, index);

            if (response) {
              await Promise.all(
                selectedMatchResult.resultMonitorFiles[index].downloadDate = response.data.downloadDate.split("+")[0]
              );
                    
              await downloadMonitorFile(selectedMatchResult.resultMonitorFiles[index].fileName, index+1);

              setIsSetDownloaded(!isSetDownloaded);
              props.handleChangeBalance(balanceAmount);
              // downloadCSV(
              //   extractedCSVRecords,
              //   "Monitor " + parseInt(index + 1)
              // );

            }
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.warning(err.response.data);
          }
        });
    }
  };

  const DownloadCellRenderer = (params) => {
    let processProgress = 0;
    processProgress = ((params.data.processProgressRecords / params.data.countIdNumbers) * 100).toFixed(2);
    let newFilesCount = params.data.newFilesCount;

    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
        {params.data.status === "Processed" ? (
          <div className="relative inline-block">
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
            {newFilesCount > 0 && (
              <span className="absolute top-[10px] right-[6px] transform translate-x-1/2 -translate-y-1/2 bg-[#2db960] text-white text-[10px] leading-none rounded-full px-1 py-1 min-w-[16px] h-[16px] flex items-center justify-center">
                {newFilesCount}
              </span>
            )}
          </div>
        ) : (
          <div className="flex w-full" style={{flexDirection: 'column'}}>
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
            <span className="text-center" style={{lineHeight: '20px'}}>{params.data.processProgressRecords}/{params.data.countIdNumbers}: &nbsp;<span style={{fontWeight: '500'}}>{processProgress}%</span></span>
          </div>  
        )}
      </div>
    );
  };

  // const extractForm193Data = (response) => {
  //   if (response.data) {
  //     var rawRecord = response.data.rawRecord.replace(/-/g, "");
  //     let [caseNumber, idNumber, name, particulars, noticeDate] = [
  //       "",
  //       "",
  //       "",
  //       "",
  //       "",
  //     ];
  //     if (
  //       rawRecord.includes("(2)") &&
  //       rawRecord.includes("(3)") &&
  //       rawRecord.includes("(4)") &&
  //       rawRecord.includes("(5)") &&
  //       rawRecord.includes("(6)")
  //     ) {
  //       caseNumber = rawRecord.split("(2)")[0].replace(/—/g, "");
  //       particulars = rawRecord.split("(2)")[1].split("(3)")[0];
  //       idNumber = particulars.split(", ")[3];
  //       name = particulars.split(", ")[0] + " , " + particulars.split(", ")[1];
  //       noticeDate = response.data.noticeDate.split("T")[0];
  //     } else {
  //       caseNumber = rawRecord.split(", ")[0];
  //       particulars =
  //         rawRecord.split(", ")[0] +
  //         " " +
  //         rawRecord.split(", ")[1] +
  //         " " +
  //         rawRecord.split(", ")[2] +
  //         " " +
  //         rawRecord.split(", ")[3] +
  //         " " +
  //         rawRecord.split(", ")[4] +
  //         " " +
  //         rawRecord.split(", ")[5] +
  //         " " +
  //         rawRecord.split(", ")[6] +
  //         " " +
  //         rawRecord.split(", ")[7];
  //       name = rawRecord.split(", ")[0].split("—")[1] + " , " + rawRecord.split(", ")[1];
  //       idNumber = rawRecord.split(", ")[3];
  //       noticeDate = response.data.noticeDate.split("T")[0];
  //     }

  //     let itemObject = {
  //       caseNumber: caseNumber,
  //       idNumber: idNumber,
  //       name: name,
  //       particulars: particulars,
  //       noticeDate: noticeDate,
  //       rawRecord: rawRecord,
  //     };

  //     return itemObject;
  //   }
  // };

  // const extractForm187Data = (response) => {
  //   if (response.data) {
  //     var rawRecord = response.data.rawRecord.replace(/-/g, "");
  //     let [
  //       caseNumber,
  //       idNumber,
  //       name,
  //       particulars,
  //       noticeDate,
  //       description,
  //       spousedetails,
  //       period,
  //       executorName,
  //       executorPhone,
  //       executorEmail,
  //       advertiserDetails,
  //     ] = ["", "", "", "", "", "", "", "", "", "", "", ""];
  //     if (
  //       rawRecord.includes("(2)") &&
  //       rawRecord.includes("(3)") &&
  //       rawRecord.includes("(4)") &&
  //       rawRecord.includes("(5)") &&
  //       rawRecord.includes("(6)")
  //     ) {
  //       caseNumber = rawRecord.split("(2)")[0].replace(/—/g, "");
  //       particulars = rawRecord.split("(2)")[1].split("(3)")[0];
  //       idNumber = extractFirst13DigitNumber(rawRecord);
  //       name = particulars.split(", ")[0] + " , " + particulars.split(", ")[1].split(" (")[0];
  //       description = response.data.rawRecord
  //         .split("(3)")[1]
  //         .split("(4)")[0]
  //         .replace(/;/g, "");
  //       noticeDate = response.data.noticeDate.split("T")[0];
  //       spousedetails = rawRecord
  //         .split("(4)")[1]
  //         .split("(5)")[0]
  //         .replace(/;/g, "");
  //       period = rawRecord.split("(5)")[1].split("(6)")[0].replace(".", "");
  //       advertiserDetails = response.data.rawRecord.split("(6)")[1];
  //       executorName = advertiserDetails.split("; ")[0];
  //       if (advertiserDetails.includes("Tel: ")) {
  //         executorPhone = advertiserDetails.split("Tel: ")[1];
  //         executorPhone = executorPhone.trim().replace(/[^0-9\s]/g, "");
  //       }

  //       executorEmail = extractEmail(advertiserDetails)
  //         ?.trim()
  //         .replace(/;/g, "");
  //     } else {
  //       if (rawRecord.includes("(2)")) {
  //         caseNumber = rawRecord.split("(2)")[0].replace(/—/g, "");
  //       }
  //       if (rawRecord.includes("(3)")) {
  //         particulars = rawRecord.split("(2)")[1].split("(3)")[0];
  //         name = particulars.split(", ")[0] + " , " + particulars.split(", ")[1].split(" (")[0];
  //       }
  //       if (rawRecord.includes("(4)" && rawRecord.includes("(3)"))) {
  //         description = response.data.rawRecord
  //           .split("(3)")[1]
  //           .split("(4)")[0]
  //           .replace(/;/g, "");
  //       }
  //       if (rawRecord.includes("(5)") && rawRecord.includes("(4)")) {
  //         spousedetails = rawRecord
  //           .split("(4)")[1]
  //           .split("(5)")[0]
  //           .replace(/;/g, "");
  //       }
  //       if (rawRecord.includes("(5)") && rawRecord.includes("(6)")) {
  //         period = rawRecord.split("(5)")[1].split("(6)")[0].replace(".", "");
  //         advertiserDetails = response.data.rawRecord.split("(6)")[1];
  //         executorName = advertiserDetails.split("; ")[0];
  //         if (advertiserDetails.includes("Tel: ")) {
  //           executorPhone = advertiserDetails.split("Tel: ")[1];
  //           executorPhone = executorPhone.trim().replace(/[^0-9\s]/g, "");
  //         }
  //         executorEmail = extractEmail(advertiserDetails)
  //           ?.trim()
  //           .replace(/;/g, "");
  //       }

  //       idNumber = extractFirst13DigitNumber(rawRecord);
  //       noticeDate = response.data.noticeDate.split("T")[0];
  //     }

  //     let itemObject = {
  //       caseNumber: caseNumber,
  //       idNumber: idNumber,
  //       name: name,
  //       particulars: particulars,
  //       noticeDate: noticeDate,
  //       description,
  //       spousedetails,
  //       period,
  //       executorName,
  //       executorPhone,
  //       executorEmail,
  //       rawRecord: rawRecord,
  //     };

  //     return itemObject;
  //   }
  // };

  const columnDefs = [
    {
      headerName: "Upload Date",
      field: "uploadDate",
      filter: false,
      sortable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: "File Name",
      field: "fileName",
      filter: false,
      sortable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: "Id numbers Count",
      field: "countIdNumbers",
      filter: false,
      sortable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: "J187 Count",
      field: "countJ187",
      cellDataType: "number",
      filter: false,
      sortable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: "J193 Count",
      field: "countJ193",
      cellDataType: "number",
      filter: false,
      sortable: false,
      minWidth: 180,
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

  // const onGridReady = (params) => {
  //   params.api.sizeColumnsToFit();
  // };

  const paginationPageSizeSelector = useMemo(() => {
    return [10, 20, 50];
  }, []);

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
    let intervalId;
    const fetchMatchResults = async () => {
      var response = await getMatchResultsAPI(userId);
      var tempMatchResults = [];

      if (response.data.length > 0) {
        response.data.forEach((result) => {
          let newFilesCount = result.resultMonitorFiles.filter(x => !x.downloadDate).length || 0;

          let matchItem = {
            id: result.id,
            uploadDate: new Date(result.uploadDate + 'Z').toISOString().split("T").join(" ").split(".")[0],
            fileName: result.fileName,
            countIdNumbers: result.records,
            countJ187: result.j187MatchedCount,
            countJ193: result.j193MatchedCount,
            resultMonitorFiles: result.resultMonitorFiles,
            newFilesCount: newFilesCount,
            status: result.status,
            processProgressRecords: result.processProgressRecords
          };

          tempMatchResults.push(matchItem);
        });

        if(response[response.length - 1]?.status === 'Processing') {
          if (intervalId) {
            clearInterval(intervalId);
          }

          intervalId = setInterval(fetchMatchResults, 1000);
        } else {
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      }

      if (tempMatchResults.length > 0) {
        setRowData(tempMatchResults);
      }
    };

    fetchMatchResults();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
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
                <div className={`${theme ==="dark" ? "ag-theme-quartz-dark" : "ag-theme-quartz"}`} style={{ width: "100%" }}>
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
              selectedMatchResult.resultMonitorFiles.map((file, index) => (
                <div
                  className={`${
                    !file.downloadDate
                      ? "shadow-md bg-[#f5f5f5]"
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
                      <p className="text-sm" style={{ fontSize: "12px" }}>
                        Last Downloaded Date: {file.downloadDate ? <>
                          {file.downloadDate
                          ? new Date(file.downloadDate + 'Z').toISOString().split("T").join(" ").split(".")[0] 
                          : 'Invalid Date'}
                        </> : <>Never,&nbsp;&nbsp;&nbsp;Cost: {formatNumber((file.count187 + file.count193) * user?.price)}</>}
                      </p>
                    </div>
                  </div>
                  <div className="float-right">
                    <IconButton
                      onClick={() =>
                        handleDownloadCSVFile(index, file.downloadDate)
                      }
                      style={{
                        cursor: "pointer",
                        color: file.downloadDate ? "#147c14" : "#387CFE",
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
