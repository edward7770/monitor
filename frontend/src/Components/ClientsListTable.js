import React, { useState } from "react";
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

const ClientsListTable = (props) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openId, setOpenId] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  // const [page1, setPage1] = useState(0);
  // const [rowsPerPage1, setRowsPerPage1] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const ClickTableRow = (row) => {
    setOpenId(row.id);
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
      props.rowData && props.rowData.length - page * rowsPerPage
    );

  return (
    <>
      <TableContainer
        sx={{ border: 1, borderRadius: 2, borderColor: "grey.300" }}
      >
        <Table className="w-full rtl:text-right">
          <TableHead className="text-md border-0 bg-gray-50 client-table-header">
            <TableRow>
              <TableCell style={{ width: "100px" }}></TableCell>
              <TableCell
                // className="w-1/6"
                style={{ minWidth: "200px", paddingLeft: "0px" }}
              >
                Company Name
              </TableCell>
              <TableCell className="w-1/6">Name</TableCell>
              <TableCell className="w-1/6">Phone Number</TableCell>
              <TableCell className="w-1/4">Email Address</TableCell>
              <TableCell className="w-1/6">Balance(R)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="opacity-80 clients-list-table">
            {props.rowData &&
              props.rowData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      // hover
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
                      >
                        <IconButton style={{ padding: "6px" }}>
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
                      >
                        {row.companyName}
                      </TableCell>
                      <TableCell
                        onClick={
                          openId === row.id
                            ? (event) => closeCollapse(event)
                            : () => ClickTableRow(row)
                        }
                        style={{ border: "0px", minWidth: "120px" }}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell
                        onClick={
                          openId === row.id
                            ? (event) => closeCollapse(event)
                            : () => ClickTableRow(row)
                        }
                        style={{ border: "0px", minWidth: "120px" }}
                      >
                        {row.phone}
                      </TableCell>
                      <TableCell
                        onClick={
                          openId === row.id
                            ? (event) => closeCollapse(event)
                            : () => ClickTableRow(row)
                        }
                        style={{ border: "0px", minWidth: "150px" }}
                      >
                        {row.email}
                      </TableCell>
                      <TableCell
                        onClick={
                          openId === row.id
                            ? (event) => closeCollapse(event)
                            : () => ClickTableRow(row)
                        }
                        style={{ border: "0px", minWidth: "120px" }}
                      >
                        {row.balanceAmount}
                      </TableCell>
                    </TableRow>
                    {openId === row.id && (
                      <TableRow className="w-full border-t-2">
                        <TableCell colSpan={6} style={{ padding: "0px" }}>
                          {selectedClient && selectedClient.transactions && (
                            <TableContainer
                              sx={{
                                border: 1,
                                borderRadius: 2,
                                borderColor: "grey.300",
                              }}
                              style={{width: '90%', marginLeft: 'auto', marginRight: 'auto'}}
                              className="my-3"
                            >
                              <Table className="w-full rtl:text-right">
                                <TableHead className="text-md border-0 bg-gray-50 client-table-header">
                                  <TableRow>
                                    <TableCell
                                      // className="w-1/6"
                                    >
                                      Date
                                    </TableCell>
                                    <TableCell className="w-1/8">
                                      File Name
                                    </TableCell>
                                    <TableCell className="w-1/8">
                                      Monitor
                                    </TableCell>
                                    <TableCell className="w-1/8">
                                      Records Found
                                    </TableCell>
                                    <TableCell className="w-1/8">
                                      Price(R)
                                    </TableCell>
                                    <TableCell className="w-1/8">
                                      Total(R)
                                    </TableCell>
                                    <TableCell className="w-1/8">
                                      Balance(R)
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody className="opacity-80 clients-list-table">
                                  {selectedClient.transactions &&
                                    selectedClient.transactions
                                      .map((transaction) => (
                                        <React.Fragment key={transaction.id}>
                                          <TableRow className="odd:bg-white group/item even:bg-slate-50 border-0 cursor-pointer hover:bg-gray-100 w-full">
                                            <TableCell
                                              style={{
                                                border: "0px",
                                                minWidth: "200px",
                                              }}
                                            >
                                              {transaction.dateCreated.split("T")[0] + " " + transaction.dateCreated.split("T")[1].split(".")[0]}
                                            </TableCell>
                                            <TableCell
                                              style={{
                                                border: "0px",
                                                minWidth: "120px",
                                              }}
                                            >
                                              <a className="hover:underline hover:text-[blue]" href={`${process.env.REACT_APP_BACKEND_API}/Uploads/UploadedFiles/${transaction.uniqueFileName}`}>
                                                {transaction.fileName}
                                              </a>
                                            </TableCell>
                                            <TableCell
                                              style={{
                                                border: "0px",
                                                minWidth: "120px",
                                              }}
                                            >
                                              {transaction.monitor}
                                            </TableCell>
                                            <TableCell
                                              style={{
                                                border: "0px",
                                                minWidth: "150px",
                                              }}
                                            >
                                              {transaction.records}
                                            </TableCell>
                                            <TableCell
                                              style={{
                                                border: "0px",
                                                minWidth: "120px",
                                              }}
                                            >
                                              199
                                            </TableCell>
                                            <TableCell
                                              style={{
                                                border: "0px",
                                                minWidth: "120px",
                                              }}
                                            >
                                              {transaction.billValue}
                                            </TableCell>
                                            <TableCell
                                              style={{
                                                border: "0px",
                                                minWidth: "120px",
                                              }}
                                            >
                                              {transaction.balance}
                                            </TableCell>
                                          </TableRow>
                                        </React.Fragment>
                                      ))}
                                  {/* {emptyRows > 0 && (
                                    <TableRow
                                      style={{ height: 53 * emptyRows }}
                                    >
                                      <TableCell colSpan={8} />
                                    </TableRow>
                                  )} */}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 50 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="gridjs-footer1">
        <div className="gridjs-pagination d-flex justify-content-between align-items-center">
          <div className="gridjs-summary pl-4 hidden md:block">
            Showing <b>{rowsPerPage * page + 1}</b> to{" "}
            <b>{rowsPerPage * (page + 1)}</b> of{" "}
            <b>{props.rowData && props.rowData.length}</b> results
          </div>
          <div className="dashboard-data-table">
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={props.rowData && props.rowData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={t("rows_per_page")}
              style={{ marginRight: "10px" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientsListTable;
