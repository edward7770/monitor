import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import { getClientsAPI } from "../Services/ClientService";
import { updateClientCreditLimitAPI } from "../Services/ClientService";
import { toast } from "react-toastify";

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

const CreditLimit = () => {
  const { t } = useTranslation();
  const [rowData, setRowData] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedClientBalanceId, setSelectedClientBalanceId] = useState(null);
  const [formAddPayment, setFormAddPayment] = useState({
    creditLimit: 0
  });
  const [isAddedPayment, setIsAddedPayment] = useState(false);

  const onChangeFormPayment = (e) => {
    setFormAddPayment({ ...formAddPayment, [e.target.name]: e.target.value });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onChangeSearchText = (e) => {
    setSearchText(e.target.value);
  };

  const onClickSetCreditLimitBtn = (balanceId, creditLimit) => {
    setSelectedClientBalanceId(balanceId);
    setFormAddPayment({creditLimit: creditLimit});
  };

  const handleClosePaymentDialog = () => {
    setSelectedClientBalanceId(null);
    setFormAddPayment({
      creditLimit: 0,
    });
  };

  const handleSetCreditLimitPayment = async () => {
    formAddPayment.balanceId = selectedClientBalanceId;
    console.log(formAddPayment);
    await updateClientCreditLimitAPI(formAddPayment)
      .then((res) => {
        if (res) {
          toast.success("Successfully credit limit is set!");
          window.document.getElementById("closeAddFormPaymentModal").click();
          setIsAddedPayment(!isAddedPayment);
        }
      })
      .catch((err) => {
        toast.error("Failed to set credit limit!");
      });
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, rowData && rowData.length - page * rowsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      var clients = await getClientsAPI();
      if (clients) {
        if (searchText !== "") {
          for (let i = clients.length - 1; i >= 0; i--) {
            if (
              !clients[i].name
                .toLowerCase()
                .includes(searchText.toLocaleLowerCase())
            ) {
              clients.splice(i, 1);
            }
          }
        }

        setRowData(clients);
      }
    };

    fetchData();
  }, [searchText, isAddedPayment]);

  useEffect(() => {
    document.title = "Monitor | Credit Limit";
  }, []);

  return (
    <div className="container-fluid">
      <div className="row mt-4">
        <div className="col-xl-12">
          <div className="card custom-card">
            <div className="card-header">
              <div className="card-title">Credit Limit</div>
            </div>
            <div className="card-body">
              <div className="gridjs-head">
                <div className="gridjs-search text-right">
                  <input
                    placeholder="Search for client..."
                    type="search"
                    onChange={(e) => onChangeSearchText(e)}
                    value={searchText}
                    className="gridjs-input gridjs-search-input mb-2 w-full"
                    style={{ outline: "0" }}
                  />
                </div>
              </div>
              <TableContainer
                sx={{ border: 1, borderRadius: 2, borderColor: "grey.300" }}
                className="gridjs-table-border"
              >
                <Table className="w-full rtl:text-right">
                  <TableHead className="text-md border-0 bg-gray-50 client-table-header">
                    <TableRow>
                      <TableCell
                        // className="w-1/6"
                        style={{ minWidth: "200px" }}
                        className="gridjs-th"
                      >
                        Company Name
                      </TableCell>
                      <TableCell className="w-1/7 gridjs-th">Name</TableCell>
                      <TableCell className="w-1/7 gridjs-th">Phone Number</TableCell>
                      <TableCell className="w-1/6 gridjs-th">Email Address</TableCell>
                      <TableCell
                        className="w-1/7 gridjs-th"
                        style={{ textAlign: "right" }}
                      >
                        Balance(R)
                      </TableCell>
                      <TableCell
                        className="w-1/7 gridjs-th"
                        style={{ textAlign: "right" }}
                      >
                        Credit Limit(R)
                      </TableCell>
                      <TableCell className="gridjs-th" style={{ width: "200px" }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="clients-list-table">
                    {rowData &&
                      rowData
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => (
                          <React.Fragment key={row.id}>
                            <TableRow className="odd:bg-white group/item even:bg-slate-50 border-0 cursor-pointer hover:bg-gray-100 w-full">
                              <TableCell
                                style={{
                                  border: "0px",
                                  minWidth: "200px",
                                }}
                                className="gridjs-td"
                              >
                                {row.companyName}
                              </TableCell>
                              <TableCell
                                style={{ border: "0px", minWidth: "120px" }}
                                className="gridjs-td"
                              >
                                {row.name}
                              </TableCell>
                              <TableCell
                                style={{ border: "0px", minWidth: "120px" }}
                                className="gridjs-td"
                              >
                                {row.phone}
                              </TableCell>
                              <TableCell
                                style={{ border: "0px", minWidth: "150px" }}
                                className="gridjs-td"
                              >
                                {row.email}
                              </TableCell>
                              <TableCell
                                style={{
                                  border: "0px",
                                  minWidth: "120px",
                                  textAlign: "right",
                                }}
                                className="gridjs-td"
                              >
                                {formatNumber(row.balanceAmount)}
                              </TableCell>
                              <TableCell
                                style={{
                                  border: "0px",
                                  minWidth: "120px",
                                  textAlign: "right",
                                }}
                                className="gridjs-td"
                              >
                                {formatNumber(row.creditLimit)}
                              </TableCell>
                              <TableCell
                                style={{ border: "0px", width: "200px" }}
                                className="gridjs-td"
                              >
                                <button
                                  onClick={() =>
                                    onClickSetCreditLimitBtn(
                                      row.balanceId,
                                      row.creditLimit
                                    )
                                  }
                                  type="button"
                                  className="btn btn-outline-primary btn-wave"
                                  data-bs-toggle="modal"
                                  data-bs-target="#staticBackdrop"
                                >
                                  <AddIcon
                                    style={{
                                      fontSize: "17px",
                                      marginTop: "-1px",
                                    }}
                                  />
                                  Set Credit Limit
                                </button>
                              </TableCell>
                            </TableRow>
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
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="staticBackdropLabel">
                Set Credit Limit
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row gy-3">
                {" "}
                <div className="col-xl-12">
                  <label
                    htmlFor="creditLimit"
                    className="form-label text-default"
                  >
                    Credit Limit
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    id="creditLimit"
                    name="creditLimit"
                    value={formAddPayment.creditLimit}
                    onChange={(e) => onChangeFormPayment(e)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => handleSetCreditLimitPayment()}
                className="btn btn-primary"
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                id="closeAddFormPaymentModal"
                onClick={() => handleClosePaymentDialog()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditLimit;
