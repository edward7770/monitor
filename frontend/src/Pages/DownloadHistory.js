import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { downloadFilesHistoryAPI } from "../Services/DownloadFilesService";

function formatDateTime(time) {
  if(time !== null) {
    return time.split("T")[0] + " " + time.split("T")[1].split(".")[0];
  } else {
    return "";
  }
}

const DownloadHistory = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openId, setOpenId] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [rowData, setRowData] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const ClickTableRow = (row) => {
    setOpenId(row.id);
    console.log(row);
    setSelectedClient(row);
  };

  const closeCollapse = (event) => {
    event.preventDefault();
    setOpenId(null);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(
      rowsPerPage,
      rowData && rowData.length - page * rowsPerPage
    );

  useEffect(() => {
    document.title = "Monitor | Download History";

    const fetchHistoryData = async () => {
      var tempData = await downloadFilesHistoryAPI();

      setRowData(tempData);
    };

    fetchHistoryData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row mt-4">
        <div className="col-xl-12">
          <div className="card custom-card">
            <div className="card-header">
              <div className="card-title">Download History</div>
            </div>
            <div className="card-body">
            <TableContainer
              sx={{ border: 1, borderRadius: 2, borderColor: "grey.300" }}
              className="gridjs-table-border"
            >
              <Table className="w-full rtl:text-right">
                <TableHead className="text-md border-0 bg-gray-50 client-table-header">
                  <TableRow>
                    <TableCell style={{ width: "100px" }} className="gridjs-th"></TableCell>
                    <TableCell
                      // className="w-1/6"
                      style={{ minWidth: "200px", paddingLeft: "0px" }}
                      className="gridjs-th"
                    >
                      Action
                    </TableCell>
                    <TableCell className="w-1/6 gridjs-th">Files Count</TableCell>
                    <TableCell className="w-1/4 gridjs-th">Start Time</TableCell>
                    <TableCell className="w-1/4 gridjs-th">End Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="clients-list-table">
                  {rowData &&
                    rowData
                      .sort((a,b) => new Date(b.startTime) - new Date(a.startTime))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <React.Fragment key={row.id}>
                          <TableRow
                            className={
                              openId === row.id
                                ? "bg-gray-200 w-full"
                                : "odd:bg-white group/item even:bg-slate-50 border-0 cursor-pointer hover:bg-gray-100 w-full"
                            }
                          >
                            <TableCell
                              onClick={
                                openId === row.id
                                  ? (event) => closeCollapse(event)
                                  : () => ClickTableRow(row)
                              }
                              style={{ border: "0px", width: "100px" }}
                              className="gridjs-td"
                            >
                              <IconButton style={{ padding: "6px" }} className="gridjs-table-button">
                                {openId !== row.id ? (
                                  <KeyboardArrowRightIcon />
                                ) : (
                                  <KeyboardArrowDownIcon />
                                )}
                              </IconButton>
                            </TableCell>
                            <TableCell
                              onClick={
                                openId === row.id
                                  ? (event) => closeCollapse(event)
                                  : () => ClickTableRow(row)
                              }
                              style={{
                                border: "0px",
                                minWidth: "200px",
                                paddingLeft: "0px",
                              }}
                              className="gridjs-td"
                            >
                              {row.byAction}
                            </TableCell>
                            <TableCell
                              onClick={
                                openId === row.id
                                  ? (event) => closeCollapse(event)
                                  : () => ClickTableRow(row)
                              }
                              style={{ border: "0px", minWidth: "120px" }}
                              className="gridjs-td"
                            >
                              {row.filesCount}
                            </TableCell>
                            <TableCell
                              onClick={
                                openId === row.id
                                  ? (event) => closeCollapse(event)
                                  : () => ClickTableRow(row)
                              }
                              style={{ border: "0px", minWidth: "120px" }}
                              className="gridjs-td"
                            >
                              {formatDateTime(row.startTime)}
                            </TableCell>
                            <TableCell
                              onClick={
                                openId === row.id
                                  ? (event) => closeCollapse(event)
                                  : () => ClickTableRow(row)
                              }
                              style={{ border: "0px", minWidth: "150px" }}
                              className="gridjs-td"
                            >
                              {formatDateTime(row.endTime)}
                            </TableCell>
                          </TableRow>
                          {openId === row.id && (
                            <>
                              <TableRow className="w-full ">
                                <TableCell colSpan={6} style={{ padding: "0px", border: 'none' }}>
                                  {selectedClient && selectedClient.downloadFiles && (
                                    <TableContainer
                                      sx={{
                                        border: 1,
                                        borderRadius: 2,
                                        borderColor: "grey.300",
                                      }}
                                      style={{
                                        width: "90%",
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                      }}
                                      className="my-3 gridjs-table-border"
                                    >
                                      <Table className="w-full rtl:text-right">
                                        <TableHead className="text-md border-0 bg-gray-50 client-table-header">
                                          <TableRow>
                                            <TableCell
                                              className="w-2/3 gridjs-th"
                                            >
                                              File Name
                                            </TableCell>
                                            <TableCell className="w-1/3 gridjs-th">
                                              Process Time
                                            </TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody className="clients-list-table">
                                          {selectedClient.downloadFiles &&
                                            selectedClient.downloadFiles.map(
                                              (transaction) => (
                                                <React.Fragment key={transaction.id}>
                                                  <TableRow className="odd:bg-white group/item border-0 cursor-pointer hover:bg-gray-100 w-full">
                                                    <TableCell
                                                      style={{
                                                        border: "0px",
                                                        minWidth: "200px",
                                                      }}
                                                      className="gridjs-td"
                                                    >
                                                      {transaction.fileName}
                                                    </TableCell>
                                                    <TableCell
                                                      style={{
                                                        border: "0px",
                                                        minWidth: "120px",
                                                      }}
                                                      className="gridjs-td"
                                                    >
                                                        {formatDateTime(transaction.processTime)}
                                                    </TableCell>
                                                  </TableRow>
                                                </React.Fragment>
                                              )
                                            )}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  )}
                                </TableCell>
                              </TableRow>
                            </>
                          )}
                        </React.Fragment>
                      ))}
                  {/* {emptyRows > 0 && (
                    <TableRow style={{ height: 50 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )} */}
                </TableBody>
              </Table>
            </TableContainer>
              <div className="gridjs-footer1">
                <div className="gridjs-pagination d-flex justify-content-between align-items-center">
                  <div className="gridjs-summary pl-4 hidden md:block">
                    Showing <b>{rowsPerPage * page + 1}</b> to{" "}
                    <b>{rowsPerPage * (page + 1)}</b> of{" "}
                    <b>{rowData && rowData.length}</b> results
                  </div>
                  <div className="dashboard-data-table">
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 20]}
                      component="div"
                      count={rowData && rowData.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      labelRowsPerPage={t("rows_per_page")}
                      style={{ marginRight: "10px" }}
                      className="gridjs-table-button"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadHistory;

