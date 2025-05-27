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
import "react-datepicker/dist/react-datepicker.css";
import { getSearchLogsAPI } from "../Services/FormDataService";

const SearchLogs = () => {
  const { t } = useTranslation();
  const [rowData, setRowData] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isSelected, setIsSelected] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchTextClient = (e) => {
    setSearchText(e.target.value);
    setIsSelected(false);
  };

  const handleSelectClient = (e, item) => {
    e.preventDefault();
    setSelectedClient(item);
    setSearchText(item.name);
    setIsSelected(true);
  };

  //   const emptyRows =
  //     rowsPerPage -
  //     Math.min(rowsPerPage, rowData && rowData.length - page * rowsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      var clients = await getSearchLogsAPI();
      if (clients) {
        if (searchText !== "" && !isSelected) {
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
  }, [isSelected, searchText]);

  useEffect(() => {
    document.title = "Monitor | Search Logs";
  }, []);

  return (
    <div className="container-fluid">
      <div className="row mt-4">
        <div className="col-xl-12">
          <div className="card custom-card">
            <div className="card-header">
              <div className="card-title">Search Logs</div>
            </div>
            <div className="card-body">
              <div className="gridjs-head mb-3">
                <div className="header-element d-lg-block d-none my-auto">
                  <div className="dropdown my-auto">
                    <div className="w-100">
                      <input
                        value={searchText}
                        onChange={(e) => handleSearchTextClient(e)}
                        placeholder="Search a client...."
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
                                onClick={(e) => handleSelectClient(e, x)}
                              >
                                {x.name}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {selectedClient && (
                <>
                  <TableContainer
                    sx={{ border: 1, borderRadius: 2, borderColor: "grey.300" }}
                    className="gridjs-table-border"
                  >
                    <Table className="w-full rtl:text-right">
                      <TableHead className="text-md border-0 bg-gray-50 client-table-header">
                        <TableRow>
                          <TableCell
                            className="w-1/3 gridjs-th"
                            style={{ minWidth: "200px" }}
                          >
                            Date
                          </TableCell>
                          <TableCell className="w-1/4 gridjs-th">Type</TableCell>
                          <TableCell className="gridjs-th">Search String</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className="clients-list-table-1">
                        {selectedClient &&
                          selectedClient.searchLogs
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row) => (
                              <React.Fragment key={row.id}>
                                <TableRow className="odd:bg-white group/item even:bg-slate-50 border-0 cursor-pointer hover:bg-gray-100 w-full">
                                  <TableCell
                                    style={{ border: "0px", minWidth: "120px" }}
                                    className="gridjs-td"
                                  >
                                    {row.date &&
                                      row.date.split("T")[0] +
                                        " " +
                                        row.date.split(".")[0].split("T")[1]}
                                  </TableCell>
                                  <TableCell
                                    style={{ border: "0px", minWidth: "120px" }}
                                    className="gridjs-td"
                                  >
                                    {row.type}
                                  </TableCell>
                                  <TableCell
                                    style={{ border: "0px", minWidth: "120px" }}
                                    className="gridjs-td"
                                  >
                                    {row.searchString}
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
                        <b>
                          {selectedClient && selectedClient.searchLogs.length}
                        </b>{" "}
                        results
                      </div>
                      <div className="dashboard-data-table">
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 20]}
                          component="div"
                          count={
                            selectedClient && selectedClient.searchLogs.length
                          }
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchLogs;
