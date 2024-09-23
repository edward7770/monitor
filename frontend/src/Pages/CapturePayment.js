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
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { getClientsAPI } from "../Services/ClientService";
import { createClientPaymentAPI } from "../Services/ClientPaymentService";
import { toast } from "react-toastify";

const CapturePayment = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedClientBalanceId, setSelectedClientBalanceId] = useState(null);
  const [formAddPayment, setFormAddPayment] = useState({
    paymentAmount: 0,
    paymentDate: new Date(),
    note: "",
  });
  const [isAddedPayment, setIsAddedPayment] = useState(false);

  const onChangeFormPayment = (e) => {
    setFormAddPayment({...formAddPayment, [e.target.name]: e.target.value});
  };

  const onChangeFormPaymentDate = (date) => {
    setFormAddPayment({...formAddPayment, paymentDate: date});
  }

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

  const onClickAddPaymentBtn = (clientId, balanceId) => {
    setSelectedClientId(clientId);
    setSelectedClientBalanceId(balanceId);
  }

  const handleClosePaymentDialog = () => {
    setSelectedClientId(null);
    setSelectedClientBalanceId(null);
    setFormAddPayment({
      paymentAmount: 0,
      paymentDate: new Date(),
      note: "",
    });
  }

  const handleAddClientPayment = async () => {
    formAddPayment.capturedBy = user.userId;
    formAddPayment.clientId = selectedClientId;
    formAddPayment.balanceId = selectedClientBalanceId;

    await createClientPaymentAPI(formAddPayment)
      .then(res => {
        if(res) {
          toast.success("Successfully payment added!");
          window.document.getElementById("closeAddFormPaymentModal").click();
          setIsAddedPayment(!isAddedPayment);
        }
      })
      .catch(err => {
        toast.error("Failed to add payment!");
      })
  }

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
    document.title = "Monitor | Capture Payment";

    const user = JSON.parse(window.localStorage.getItem("user"));
    if (user) {
      setUser(user);
    }
  }, []);

  return (
    <div className="container-fluid">
      <div className="row mt-4">
        <div className="col-xl-12">
          <div className="card custom-card">
            <div className="card-header">
              <div className="card-title">Capture Payment</div>
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
              >
                <Table className="w-full rtl:text-right">
                  <TableHead className="text-md border-0 bg-gray-50 client-table-header">
                    <TableRow>
                      <TableCell
                        // className="w-1/6"
                        style={{ minWidth: "200px" }}
                      >
                        Company Name
                      </TableCell>
                      <TableCell className="w-1/6">Name</TableCell>
                      <TableCell className="w-1/6">Phone Number</TableCell>
                      <TableCell className="w-1/5">Email Address</TableCell>
                      <TableCell className="w-1/6">Balance(R)</TableCell>
                      <TableCell style={{ width: "200px" }}></TableCell>
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
                              >
                                {row.companyName}
                              </TableCell>
                              <TableCell
                                style={{ border: "0px", minWidth: "120px" }}
                              >
                                {row.name}
                              </TableCell>
                              <TableCell
                                style={{ border: "0px", minWidth: "120px" }}
                              >
                                {row.phone}
                              </TableCell>
                              <TableCell
                                style={{ border: "0px", minWidth: "150px" }}
                              >
                                {row.email}
                              </TableCell>
                              <TableCell
                                style={{ border: "0px", minWidth: "120px" }}
                              >
                                {row.balanceAmount}
                              </TableCell>
                              <TableCell
                                style={{ border: "0px", width: "200px" }}
                              >
                                {/* <Button
                                  onClick={() => onClickAddPaymentbtn()}
                                  variant="outlined"
                                  startIcon={<AddIcon />}
                                >
                                  Add Payment
                                </Button> */}
                                <button
                                  onClick={() => onClickAddPaymentBtn(row.userId, row.balanceId)}
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
                                  Add Payment
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
                Add Payment
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
                    htmlFor="paymentAmount"
                    className="form-label text-default"
                  >
                    Payment Amount
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    id="paymentAmount"
                    name="paymentAmount"
                    value={formAddPayment.paymentAmount}
                    onChange={(e) => onChangeFormPayment(e)}
                    required
                  />
                </div>
                <div className="col-xl-12">
                  <label
                    htmlFor="paymentDate"
                    className="form-label text-default"
                  >
                    Payment Date
                  </label>
                  <div className="form-group">
                    <DatePicker selected={formAddPayment.paymentDate} onChange={(date) => onChangeFormPaymentDate(date)} />
                  </div>
                </div>
                <div className="col-xl-12">
                  <label
                    htmlFor="note"
                    className="form-label text-default"
                  >
                    Note
                  </label>
                  <textarea
                    className="form-control form-control-lg"
                    rows={3}
                    placeholder="Please write a note..."
                    id="note"
                    name="note"
                    value={formAddPayment.note}
                    onChange={(e) => onChangeFormPayment(e)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={() => handleAddClientPayment()} className="btn btn-primary">
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

export default CapturePayment;
