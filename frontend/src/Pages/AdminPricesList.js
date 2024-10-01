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
import {
  getAllPricingListAPI,
  createPricingTierAPI,
  updatePricingTierAPI,
  deletePricingTierAPI,
  dupliatePriceListAPI,
} from "../Services/PricingService";
import { getClientsAPI } from "../Services/ClientService";
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

const AdminPricesList = () => {
  const { t } = useTranslation();
  const [rowData, setRowData] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page1, setPage1] = useState(0);
  const [rowsPerPage1, setRowsPerPage1] = useState(5);
  const [selectedPricings, setSelectedPricings] = useState(null);
  const [selectedPriceListId, setSelectedPriceListId] = useState(null);
  const [selectedPriceListName, setSelectedPriceListName] = useState(null);
  const [selectedPricingTier, setSelectedPricingTier] = useState(null);
  const [newPricingTier, setNewPricingTier] = useState({
    list: "",
    listName: "",
    tier: "",
    description: "",
    start: "",
    end: "",
    price: "",
  });
  const [isSelected, setIsSelected] = useState(false);
  const [isUpdatedPricing, setIsUpdatedPricing] = useState(false);
  const [newPriceListName, setNewPriceListName] = useState("");

  const [selectedClients, setSelectedClients] = useState(null);
  const [selectedClientPriceListId, setSelectedClientPriceListId] =
    useState(null);
  const [selectedClientPriceListName, setSelectedClientPriceListName] =
    useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage1 = (event, newPage) => {
    setPage1(newPage);
  };

  const handleChangeRowsPerPage1 = (event) => {
    setRowsPerPage1(parseInt(event.target.value, 10));
    setPage1(0);
  };

  const handleSelectClientPriceList = (e, row) => {
    e.preventDefault();
    setSelectedClientPriceListId(row.list);
    setSelectedClientPriceListName(row.listName);
  };

  const handleSelectInput = (e) => {
    e.preventDefault();
  };

  const handleSearchTextClient = (e) => {
    setSearchText(e.target.value);
    setIsSelected(false);
  };

  const handleSelectPriceList = (e, item) => {
    e.preventDefault();
    setSelectedPriceListId(item.list);
    setSelectedPriceListName(item.listName);
    setSearchText(item.list + " - " + item.listName);
    setIsSelected(true);
  };

  const handleOpenDeleteDialog = (row) => {
    setSelectedPricingTier(row);
  };

  const handleOpenUpdateDialog = (row) => {
    setSelectedPricingTier(row);
  };

  const handleDeletePricingTier = async () => {
    var pricingId = selectedPricingTier && selectedPricingTier.id;
    await deletePricingTierAPI(pricingId)
      .then((res) => {
        if (res) {
          window.document.getElementById("closeDeletePricingTierModal").click();
          toast.success(
            "Successfully Pricing Tier " + res.tier + " was deleted!"
          );
          setSelectedPricingTier(null);
          setIsUpdatedPricing(!isUpdatedPricing);
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(
            "That pricing tier was linked to client. Failed to delete this tier!"
          );
        }
      });
  };

  const onChangeUpdateForm = (e) => {
    setSelectedPricingTier({
      ...selectedPricingTier,
      [e.target.name]: e.target.value,
    });
  };

  const onChangeAddForm = (e) => {
    setNewPricingTier({
      ...newPricingTier,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdatePricingTierPayment = async () => {
    var pricingId = selectedPricingTier && selectedPricingTier.id;

    await updatePricingTierAPI(pricingId, selectedPricingTier)
      .then((res) => {
        if (res) {
          window.document.getElementById("closeUpdatePricingTierModal").click();
          toast.success(
            "Successfully Pricing Tier " + res.tier + " was updated!"
          );
          setSelectedPricingTier(null);
          setIsUpdatedPricing(!isUpdatedPricing);
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error("Failed to update this tier!");
        }
      });
  };

  const handleOpenAddDialog = () => {
    setSelectedPricingTier(null);
  };

  const onChangeNewListName = (e) => {
    setNewPriceListName(e.target.value);
  };

  const handleDuplicatePriceList = async () => {
    if (newPriceListName === "" || newPriceListName === null) {
      toast.error("Please check required fields again");
    } else {
      await dupliatePriceListAPI({ newListName: newPriceListName })
        .then((res) => {
          if (res) {
            window.document
              .getElementById("closeDuplicatePricingTierModal")
              .click();
            toast.success("Successfully new price list has been saved!!");
            setNewPriceListName("");
            setSelectedPriceListId(null);
            setSelectedPriceListName(null);
            setSearchText("");
            setIsSelected(false);
            setIsUpdatedPricing(!isUpdatedPricing);
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.error("Failed to duplicate new list!");
          }
        });
    }
  };

  const handleCloseDialog = () => {
    setSelectedPricingTier(null);
    setNewPricingTier({
      list: "",
      listName: "",
      tier: "",
      description: "",
      start: "",
      end: "",
      price: "",
    });
  };

  const handleAddPricingTierPayment = async () => {
    newPricingTier.list = selectedPriceListId;
    newPricingTier.listName = selectedPriceListName;

    if (
      !newPricingTier.tier ||
      !newPricingTier.start ||
      !newPricingTier.end ||
      !newPricingTier.price
    ) {
      toast.error("Please check required fields again");
    } else {
      await createPricingTierAPI(newPricingTier)
        .then((res) => {
          if (res) {
            window.document.getElementById("closeAddPricingTierModal").click();
            toast.success(
              "Successfully Pricing Tier " + res.tier + " was added!"
            );
            setNewPricingTier({
              list: "",
              listName: "",
              tier: "",
              description: "",
              start: "",
              end: "",
              price: "",
            });
            setIsUpdatedPricing(!isUpdatedPricing);
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.error("Failed to add this tier!");
          }
        });
    }
  };

  //   const emptyRows =
  //     rowsPerPage -
  //     Math.min(rowsPerPage, rowData && rowData.length - page * rowsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      var pricings = await getAllPricingListAPI();

      if (pricings) {
        const tempPricingList = [
          ...new Set(
            pricings.map((item) =>
              JSON.stringify({ list: item.list, listName: item.listName })
            )
          ),
        ].map((item) => JSON.parse(item));

        if (searchText !== "" && !isSelected) {
          for (let i = tempPricingList.length - 1; i >= 0; i--) {
            if (
              !(tempPricingList[i].list + "-" + tempPricingList[i].listName)
                .toLowerCase()
                .includes(searchText.toLocaleLowerCase())
            ) {
              tempPricingList.splice(i, 1);
            }
          }
        }

        if (selectedPriceListId) {
          var tempPricings = pricings.filter(
            (x) => x.list === selectedPriceListId
          );
          setSelectedPricings(tempPricings);
        }

        setRowData(tempPricingList);
      }
    };

    fetchData();
  }, [isSelected, searchText, selectedPriceListId, isUpdatedPricing]);

  useEffect(() => {
    const fetchClientsData = async () => {
      var allClients = await getClientsAPI();
      var tempClients = [];

      if (allClients) {
        tempClients = allClients.filter(
          (x) => x.priceListId === selectedClientPriceListId
        );
        if (tempClients) {
            setSelectedClients(tempClients);
        }
      }
    };

    fetchClientsData();
  }, [selectedClientPriceListId]);

  useEffect(() => {
    document.title = "Monitor | Price List";
  }, []);

  return (
    <div className="container-fluid">
      <div className="row mt-4">
        <div className="col-xl-12">
          <div className="card custom-card">
            <div className="card-header justify-between">
              <div className="card-title">Price List</div>
              <div className="card-btns flex">
                <button
                  className="btn btn-primary-light btn-wave me-2 waves-effect waves-light"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop2"
                  onClick={() => handleOpenAddDialog()}
                  disabled={selectedPriceListId ? false : true}
                >
                  <i className="ri ri-add-line align-middle"></i> Add New Tier
                </button>
                <button
                  className="btn btn-secondary-light btn-wave me-2 waves-effect waves-light"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop3"
                >
                  <i className="bx bx-crown align-middle"></i> Duplicate List
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="gridjs-head mb-3">
                <div className="header-element d-lg-block d-none my-auto">
                  <div className="dropdown my-auto">
                    <div className="w-100">
                      <input
                        value={searchText}
                        onChange={(e) => handleSearchTextClient(e)}
                        placeholder="Search a price list...."
                        className="btn bg-body header-dashboards-button text-start d-flex align-items-center justify-content-between w-100"
                        style={{ color: "rgba(0, 0, 0, 0.87)" }}
                        data-bs-toggle="dropdown"
                        // aria-expanded="false"
                      />
                      <ul
                        className="dropdown-menu dashboard-dropdown w-100"
                        role="menu"
                      >
                        {rowData &&
                          rowData.map((x, index) => (
                            <li key={index}>
                              <a
                                className="dropdown-item dashboards-dropdown-item w-100"
                                href="/#"
                                onClick={(e) => handleSelectPriceList(e, x)}
                              >
                                {x.list} - {x.listName}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {selectedPricings && isSelected && (
                <>
                  <TableContainer
                    sx={{ border: 1, borderRadius: 2, borderColor: "grey.300" }}
                  >
                    <Table className="w-full rtl:text-right">
                      <TableHead className="text-md border-0 bg-gray-50 client-table-header">
                        <TableRow>
                          <TableCell
                            className="w-1/6"
                            style={{ minWidth: "200px" }}
                          >
                            Tier
                          </TableCell>
                          <TableCell className="w-1/6">Description</TableCell>
                          <TableCell className="w-1/6">Start</TableCell>
                          <TableCell className="w-1/6">End</TableCell>
                          <TableCell
                            className="w-1/8"
                            style={{ textAlign: "right" }}
                          >
                            Price
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className="clients-list-table-1">
                        {selectedPricings &&
                          selectedPricings
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row) => (
                              <React.Fragment key={row.id}>
                                <TableRow className="odd:bg-white group/item even:bg-slate-50 border-0 cursor-pointer hover:bg-gray-100 w-full">
                                  <TableCell
                                    style={{ border: "0px", minWidth: "120px" }}
                                  >
                                    {row.tier}
                                  </TableCell>
                                  <TableCell
                                    style={{ border: "0px", minWidth: "120px" }}
                                  >
                                    {row.description}
                                  </TableCell>
                                  <TableCell
                                    style={{ border: "0px", minWidth: "120px" }}
                                  >
                                    {row.start}
                                  </TableCell>
                                  <TableCell
                                    style={{ border: "0px", minWidth: "120px" }}
                                  >
                                    {row.end}
                                  </TableCell>
                                  <TableCell
                                    style={{
                                      border: "0px",
                                      textAlign: "right",
                                    }}
                                  >
                                    {formatNumber(row.price)}
                                  </TableCell>
                                  <TableCell style={{ border: "0px" }}>
                                    <div className="flex justify-center items-center">
                                      <button
                                        className="btn btn-icon btn-sm btn-info mr-3"
                                        type="button"
                                        data-bs-toggle="modal"
                                        data-bs-target="#staticBackdrop1"
                                        onClick={() =>
                                          handleOpenUpdateDialog(row)
                                        }
                                      >
                                        <i className="ri-edit-line"></i>
                                      </button>
                                      <button
                                        className="btn btn-icon btn-sm btn-danger"
                                        type="button"
                                        data-bs-toggle="modal"
                                        data-bs-target="#staticBackdrop"
                                        onClick={() =>
                                          handleOpenDeleteDialog(row)
                                        }
                                      >
                                        <i className="ri-delete-bin-line"></i>
                                      </button>
                                    </div>
                                  </TableCell>
                                </TableRow>
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
                        <b>{selectedPricings && selectedPricings.length}</b>{" "}
                        results
                      </div>
                      <div className="dashboard-data-table">
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 20]}
                          component="div"
                          count={selectedPricings && selectedPricings.length}
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
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-xl-12">
          <div className="card custom-card">
            <div className="card-header justify-between">
              <div className="card-title flex items-center">
                Clients Using Price List &nbsp;&nbsp;
                <div className="dropdown my-auto">
                  <div className="w-100">
                    <a
                      href="/#"
                      onClick={(e) => handleSelectInput(e)}
                      class="btn bg-body header-dashboards-button text-start d-flex align-items-center justify-content-between"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {" "}
                      {selectedClientPriceListName
                        ? selectedClientPriceListName
                        : "Select a price list..."}
                      <i class="ri-arrow-down-s-line align-middle ms-1 d-inline-block"></i>
                    </a>
                    <ul
                      className="dropdown-menu dashboard-dropdown w-100"
                      role="menu"
                    >
                      {rowData &&
                        rowData.map((x, index) => (
                          <li key={index}>
                            <a
                              className="dropdown-item dashboards-dropdown-item w-100"
                              href="/#"
                              onClick={(e) => handleSelectClientPriceList(e, x)}
                            >
                              {x.listName}
                            </a>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              {selectedClients && (
                <>
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
                          <TableCell className="w-1/5">Full Name</TableCell>
                          <TableCell className="w-1/6">Phone Number</TableCell>
                          <TableCell className="w-1/5">Email Address</TableCell>
                          <TableCell className="w-1/6" style={{textAlign: 'right'}}>Balance(R)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className="clients-list-table-1">
                        {selectedClients &&
                          selectedClients
                            .slice(
                              page1 * rowsPerPage1,
                              page1 * rowsPerPage1 + rowsPerPage1
                            )
                            .map((row) => (
                              <React.Fragment key={row.id}>
                                <TableRow className="odd:bg-white group/item even:bg-slate-50 border-0 cursor-pointer hover:bg-gray-100 w-full">
                                  <TableCell
                                    style={{ border: "0px", minWidth: "120px" }}
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
                                    style={{ border: "0px", minWidth: "120px" }}
                                  >
                                    {row.email}
                                  </TableCell>
                                  <TableCell
                                    style={{
                                      border: "0px",
                                      textAlign: "right",
                                    }}
                                  >
                                    {formatNumber(row.balanceAmount)}
                                  </TableCell>
                                </TableRow>
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
                        Showing <b>{rowsPerPage1 * page1 + 1}</b> to{" "}
                        <b>{rowsPerPage1 * (page1 + 1)}</b> of{" "}
                        <b>{selectedClients && selectedClients.length}</b>{" "}
                        results
                      </div>
                      <div className="dashboard-data-table">
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 20]}
                          component="div"
                          count={selectedClients && selectedClients.length}
                          rowsPerPage={rowsPerPage1}
                          page={page1}
                          onPageChange={handleChangePage1}
                          onRowsPerPageChange={handleChangeRowsPerPage1}
                          labelRowsPerPage={t("rows_per_page")}
                          style={{ marginRight: "10px" }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
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
              <h6
                className="modal-title"
                id="staticBackdropLabel"
                style={{ fontSize: "18px" }}
              >
                Are you sure to delete this{" "}
                {selectedPricingTier && selectedPricingTier.listName} tier{" "}
                {selectedPricingTier && selectedPricingTier.tier} ?
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => handleCloseDialog()}
              ></button>
            </div>
            {/* <div className="modal-body"></div> */}
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => handleDeletePricingTier()}
                className="btn btn-primary"
              >
                Sure
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                id="closeDeletePricingTierModal"
                onClick={() => handleCloseDialog()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="staticBackdrop1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h6
                className="modal-title"
                id="staticBackdropLabel"
                style={{ fontSize: "18px" }}
              >
                Update {selectedPricingTier && selectedPricingTier.listName}{" "}
                Tier {selectedPricingTier && selectedPricingTier.tier}
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => handleCloseDialog()}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row gy-3">
                {" "}
                <div className="col-xl-12">
                  <label htmlFor="listName" className="form-label text-default">
                    List Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="listName"
                    name="listName"
                    value={selectedPricingTier && selectedPricingTier.listName}
                    onChange={(e) => onChangeUpdateForm(e)}
                    required
                  />
                  <hr className="mt-4" />
                </div>
                <div className="col-xl-12">
                  <label htmlFor="tier" className="form-label text-default">
                    Tier
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    id="tier"
                    name="tier"
                    value={selectedPricingTier && selectedPricingTier.tier}
                    onChange={(e) => onChangeUpdateForm(e)}
                    required
                  />
                </div>
                <div className="col-xl-12">
                  <label
                    htmlFor="description"
                    className="form-label text-default"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="description"
                    name="description"
                    value={
                      selectedPricingTier && selectedPricingTier.description
                    }
                    onChange={(e) => onChangeUpdateForm(e)}
                    required
                  />
                </div>
                <div className="col-xl-12">
                  <label htmlFor="start" className="form-label text-default">
                    Start
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    id="start"
                    name="start"
                    value={selectedPricingTier && selectedPricingTier.start}
                    onChange={(e) => onChangeUpdateForm(e)}
                    required
                  />
                </div>
                <div className="col-xl-12">
                  <label htmlFor="end" className="form-label text-default">
                    End
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    id="end"
                    name="end"
                    value={selectedPricingTier && selectedPricingTier.end}
                    onChange={(e) => onChangeUpdateForm(e)}
                    required
                  />
                </div>
                <div className="col-xl-12">
                  <label htmlFor="price" className="form-label text-default">
                    Price(R)
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    id="price"
                    name="price"
                    value={selectedPricingTier && selectedPricingTier.price}
                    onChange={(e) => onChangeUpdateForm(e)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => handleUpdatePricingTierPayment()}
                className="btn btn-primary"
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                id="closeUpdatePricingTierModal"
                onClick={() => handleCloseDialog()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="staticBackdrop2"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel2"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h6
                className="modal-title"
                id="staticBackdropLabel2"
                style={{ fontSize: "18px" }}
              >
                Add New Pricing Tier
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => handleCloseDialog()}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row gy-3">
                <div className="col-xl-12">
                  <label htmlFor="tier" className="form-label text-default">
                    Tier*
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    id="tier"
                    name="tier"
                    value={newPricingTier.tier}
                    onChange={(e) => onChangeAddForm(e)}
                    required
                  />
                </div>
                <div className="col-xl-12">
                  <label
                    htmlFor="description"
                    className="form-label text-default"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="description"
                    name="description"
                    value={newPricingTier.description}
                    onChange={(e) => onChangeAddForm(e)}
                    required
                  />
                </div>
                <div className="col-xl-12">
                  <label htmlFor="start" className="form-label text-default">
                    Start*
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    id="start"
                    name="start"
                    value={newPricingTier.start}
                    onChange={(e) => onChangeAddForm(e)}
                    required
                  />
                </div>
                <div className="col-xl-12">
                  <label htmlFor="end" className="form-label text-default">
                    End*
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    id="end"
                    name="end"
                    value={newPricingTier.end}
                    onChange={(e) => onChangeAddForm(e)}
                    required
                  />
                </div>
                <div className="col-xl-12">
                  <label htmlFor="price" className="form-label text-default">
                    Price(R)*
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    id="price"
                    name="price"
                    value={newPricingTier.price}
                    onChange={(e) => onChangeAddForm(e)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => handleAddPricingTierPayment()}
                className="btn btn-primary"
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                id="closeAddPricingTierModal"
                onClick={() => handleCloseDialog()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="staticBackdrop3"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel3"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h6
                className="modal-title"
                id="staticBackdropLabel3"
                style={{ fontSize: "18px" }}
              >
                Duplicate New Price List
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => handleCloseDialog()}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row gy-3">
                {" "}
                <div className="col-xl-12">
                  <label
                    htmlFor="newListName"
                    className="form-label text-default"
                  >
                    New List Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="newListName"
                    name="newListName"
                    value={newPriceListName}
                    onChange={(e) => onChangeNewListName(e)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => handleDuplicatePriceList()}
                className="btn btn-primary"
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                id="closeDuplicatePricingTierModal"
                onClick={() => handleCloseDialog()}
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

export default AdminPricesList;
