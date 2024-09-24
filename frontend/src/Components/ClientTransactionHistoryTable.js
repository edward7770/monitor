import React, { useEffect, useState } from "react";
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

function formatNumber(number) {
  if (number !== 0 || number !== null) {
    return (
      "R " +
      number.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })
    );
  } else {
    return "R 0";
  }
}

const ClientsTransactionHistoryTable = (props) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rowData, setRowData] = useState(null);

  // const [page1, setPage1] = useState(0);
  // const [rowsPerPage1, setRowsPerPage1] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(
      rowsPerPage,
      props.rowData && props.rowData.length - page * rowsPerPage
    );

  useEffect(() => {
    setRowData(props.rowData);
  }, [props.rowData, props.searchText]);

  return (
    <>
      <TableContainer
        sx={{ border: 1, borderRadius: 2, borderColor: "grey.300" }}
      >
        <Table className="w-full rtl:text-right">
          <TableHead className="text-md border-0 bg-gray-50 client-table-header">
            <TableRow>
              <TableCell
              // className="w-1/6"
              >
                Date
              </TableCell>
              <TableCell className="w-1/8">File Name</TableCell>
              <TableCell className="w-1/8">Monitor</TableCell>
              <TableCell className="w-1/8">Records Found</TableCell>
              <TableCell className="w-1/8" style={{ textAlign: "right" }}>
                Price(R)
              </TableCell>
              <TableCell className="w-1/8" style={{ textAlign: "right" }}>
                Total(R)
              </TableCell>
              <TableCell
                className="w-1/8"
                style={{ textAlign: "right", paddingRight: "20px" }}
              >
                Balance(R)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="clients-list-table-1">
            {props.currentClientData &&
              props.currentClientData.transactionsWithPayments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) =>
                  transaction.type === "Transaction" ? (
                    <React.Fragment key={transaction.id}>
                      <TableRow className="odd:bg-white group/item border-0 cursor-pointer hover:bg-gray-100 w-full">
                        <TableCell
                          style={{
                            border: "0px",
                            minWidth: "200px",
                          }}
                        >
                          {transaction.dateCreated.split("T")[0]}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "0px",
                            minWidth: "120px",
                          }}
                        >
                          <a
                            className="hover:underline hover:text-[blue]"
                            href={`${process.env.REACT_APP_BACKEND_API}/Uploads/UploadedFiles/${transaction.uniqueFileName}`}
                          >
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
                            textAlign: "right",
                          }}
                        >
                          R 199
                        </TableCell>
                        <TableCell
                          style={{
                            border: "0px",
                            minWidth: "120px",
                            textAlign: "right",
                          }}
                        >
                          {formatNumber(transaction.billValue)}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "0px",
                            minWidth: "120px",
                            textAlign: "right",
                          }}
                        >
                          {formatNumber(transaction.balance)}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ) : (
                    <React.Fragment key={transaction.id}>
                      <TableRow className="group/item bg-slate-50 border-0 cursor-pointer hover:bg-gray-100 w-full">
                        <TableCell
                          style={{
                            border: "0px",
                            minWidth: "200px",
                          }}
                        >
                          {transaction.dateCreated.split("T")[0]}
                        </TableCell>
                        <TableCell
                          colSpan={4}
                          style={{
                            border: "0px",
                            minWidth: "120px",
                          }}
                        >
                          By {transaction.capturedBy}
                          ,&nbsp;&nbsp; Payment Date:{" "}
                          {transaction.paymentDate.split("T")[0]}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "0px",
                            minWidth: "150px",
                            textAlign: "right",
                          }}
                        >
                          {formatNumber(transaction.paymentAmount)}
                        </TableCell>
                        <TableCell
                          style={{
                            border: "0px",
                            minWidth: "120px",
                            textAlign: "right",
                          }}
                        >
                          {formatNumber(transaction.balance)}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  )
                )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="gridjs-footer1">
        <div className="gridjs-pagination d-flex justify-content-between align-items-center">
          <div className="gridjs-summary pl-4 hidden md:block">
            Showing <b>{rowsPerPage * page + 1}</b> to{" "}
            <b>{rowsPerPage * (page + 1)}</b> of{" "}
            <b>{props.currentClientData && props.currentClientData.transactionsWithPayments.length}</b> results
          </div>
          <div className="dashboard-data-table">
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={props.currentClientData && props.currentClientData.transactionsWithPayments.length}
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

export default ClientsTransactionHistoryTable;
