import React, { useState, useEffect, useCallback } from "react";
import { TablePagination } from "@mui/material";
import { useTranslation } from "react-i18next";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  getForm193RecordsAPI,
  getForm187RecordsAPI,
} from "../Services/FormDataService";
import { createSearchLogAPI } from "../Services/FormDataService";
import RawRecordCellRenderer from "../Components/RawRecordCellRenderer";

const debounce = (func, delay) => {
  let timerId;
  return (...args) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => func(...args), delay);
  };
};

const extractEmail = (text) => {
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = text.match(emailPattern);

  return match ? match[0] : null;
};

function extractFirst13DigitNumber(str) {
  const match = str.match(/\b\d{13}\b/);

  return match ? match[0] : null;
}

const Dashboard = () => {
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

  const form193SearchOptions = [
    {label: 'All', value: ''},
    {label: 'Case Number', value: 'CaseNumber'},
    {label: 'Id Number', value: 'IdNo'},
    {label: 'Name', value: 'Name'},
    {label: 'Particulars', value: 'Particulars'},
  ];

  const form187SearchOptions = [
    {label: 'All', value: ''},
    {label: 'Case Number', value: 'CaseNumber'},
    {label: 'Id Number', value: 'IdNo'},
    {label: 'Name', value: 'Name'},
    {label: 'Particulars', value: 'Particulars'},
    {label: 'Executor Name', value: 'ExecutorName'},
  ]

  //form193 records table
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  // const [sortModel, setSortModel] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchOption, setSearchOption] = useState({label: 'All', value: ''});

  //form187 records table
  const [rowData1, setRowData1] = useState([]);
  const [totalRecords1, setTotalRecords1] = useState(0);
  const [currentPage1, setCurrentPage1] = useState(0);
  const [pageSize1, setPageSize1] = useState(10);
  // const [sortModel1, setSortModel1] = useState([]);
  const [searchText1, setSearchText1] = useState("");
  const [searchOption1, setSearchOption1] = useState({label: 'All', value: ''});

  // const [filterModel, setFilterModel] = useState({});

  // const onSortChanged = (params) => {
  //   var tempSortModel = params.api.getColumnState().filter(item => item.sort !== null);
  //   if(tempSortModel.length !== 0) {
  //     console.log(tempSortModel);
  //     setSortModel(tempSortModel);
  //   }
  // };
  const [user, setUser] = useState(null);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(parseInt(newPage));
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleChangePage1 = (event, newPage) => {
    setCurrentPage1(parseInt(newPage));
  };

  const handleChangeRowsPerPage1 = (event) => {
    setPageSize1(parseInt(event.target.value, 10));
    setCurrentPage1(0);
  };

  // const onPaginationChanged = (params) => {
  //   console.log(params.api.paginationGetCurrentPage() + 1);
  //   setCurrentPage(params.api.paginationGetCurrentPage() + 1);
  // };

  // const onPageSizeChanged = (event) => {
  //   setPageSize(Number(event.target.value));
  //   setCurrentPage(1); // Reset to first page on page size change
  // };

  // const onFilterChanged = (params) => {
  //   Object.entries(params.api.getFilterModel()).map((key, value) => {
  //     setFilterModel(key[1]);
  //   });
  // };

  const onChangeSearchText = (e) => {
    setSearchText(e.target.value);
  };

  const onChangeSearchText1 = (e) => {
    setSearchText1(e.target.value);
  };


  const handleSelectSearchOption = (type, item) => {
    if(type === "form193") {
      console.log(item)
      setSearchOption(item);
    } else {
      setSearchOption1(item);
    }
  }

  const columnDefs = [
    {
      headerName: "Case Number",
      field: "caseNumber",
      filter: false,
      sortable: false,
      cellStyle: { width: "50%" },
    },
    {
      headerName: "Id Number",
      field: "idNumber",
      filter: false,
      sortable: false,
    },
    {
      headerName: "Name",
      field: "name",
      filter: false,
      sortable: false,
      flex: 1,
    },
    {
      headerName: "Particulars",
      field: "particulars",
      filter: false,
      sortable: false,
      width: 350,
    },
    {
      headerName: "Notice Date",
      field: "noticeDate",
      filter: false,
      sortable: false,
    },
    {
      headerName: "Raw Record",
      field: "rawRecord",
      filter: false,
      sortable: false,
      width: 350,
      cellRenderer: RawRecordCellRenderer,
    },
  ];

  const columnDefs1 = [
    {
      headerName: "Case Number",
      field: "caseNumber",
      filter: false,
      sortable: false,
    },
    {
      headerName: "Id Number",
      field: "idNumber",
      filter: false,
      sortable: false,
    },
    { headerName: "Name", field: "name", filter: false, sortable: false },
    {
      headerName: "Particulars",
      field: "particulars",
      filter: false,
      sortable: false,
    },
    {
      headerName: "Notice Date",
      field: "noticeDate",
      filter: false,
      sortable: false,
    },
    {
      headerName: "Description of Account",
      field: "description",
      filter: false,
      sortable: false,
    },
    {
      headerName: "Surviving Spouse Details",
      field: "spousedetails",
      filter: false,
      sortable: false,
    },
    {
      headerName: "Period Of Inspection",
      field: "period",
      filter: false,
      sortable: false,
    },
    {
      headerName: "Executor Name",
      field: "executorName",
      filter: false,
      sortable: false,
    },
    {
      headerName: "Executor Phone Number",
      field: "executorPhone",
      filter: false,
      sortable: false,
    },
    {
      headerName: "Executor Email",
      field: "executorEmail",
      filter: false,
      sortable: false,
    },
    {
      headerName: "Raw Record",
      field: "rawRecord",
      filter: false,
      sortable: false,
      width: 350,
      cellRenderer: RawRecordCellRenderer,
    },
  ];

  const onGridReady = (params) => {
    // params.api.autoSizeAllColumns();
  };

  const extractForm193Data = (response) => {
    if (response) {
      // let tempRowData = [];
      // response.data.forEach((item) => {
      //   var rawRecord = item.rawRecord.replace(/-/g, "");
      //   let [caseNumber, idNumber, name, particulars, noticeDate] = [
      //     "",
      //     "",
      //     "",
      //     "",
      //     "",
      //   ];
      //   if (
      //     rawRecord.includes("(2)") &&
      //     rawRecord.includes("(3)") &&
      //     rawRecord.includes("(4)") &&
      //     rawRecord.includes("(5)") &&
      //     rawRecord.includes("(6)")
      //   ) {
      //     caseNumber = rawRecord.split("(2)")[0].replace(/—/g, "");
      //     particulars = rawRecord.split("(2)")[1].split("(3)")[0];
      //     // idNumber = particulars.split(", ")[3];
      //     idNumber = extractFirst13DigitNumber(rawRecord);
      //     name = particulars.split(", ")[0] + " , " + particulars.split(", ")[1];
      //     noticeDate = item.noticeDate.split("T")[0];
      //   } else {
      //     caseNumber = rawRecord.split(", ")[0];
      //     particulars =
      //       rawRecord.split(", ")[0] +
      //       " " +
      //       rawRecord.split(", ")[1] +
      //       " " +
      //       rawRecord.split(", ")[2] +
      //       " " +
      //       rawRecord.split(", ")[3] +
      //       " " +
      //       rawRecord.split(", ")[4] +
      //       " " +
      //       rawRecord.split(", ")[5] +
      //       " " +
      //       rawRecord.split(", ")[6] +
      //       " " +
      //       rawRecord.split(", ")[7];
      //     name = rawRecord.split(", ")[0].split("—")[1] + " , " + rawRecord.split(", ")[1];
      //     // idNumber = rawRecord.split(", ")[3];
      //     idNumber = extractFirst13DigitNumber(rawRecord);
      //     noticeDate = item.noticeDate.split("T")[0];
      //   }

      //   let itemObject = {
      //     caseNumber: caseNumber,
      //     idNumber: idNumber,
      //     name: name,
      //     particulars: particulars,
      //     noticeDate: noticeDate,
      //     rawRecord: rawRecord,
      //   };

      //   tempRowData.push(itemObject);
      // });

      if(response.data) {
        setRowData(response.data);
      }

      setTotalRecords(response.totalRecords);
    }
  };

  const extractForm187Data = (response) => {
    if (response) {
      // let tempRowData = [];
      // response.data.forEach((item) => {
      //   var rawRecord = item.rawRecord.replace(/-/g, "");
      //   let [
      //     caseNumber,
      //     idNumber,
      //     name,
      //     particulars,
      //     noticeDate,
      //     description,
      //     spousedetails,
      //     period,
      //     executorName,
      //     executorPhone,
      //     executorEmail,
      //     advertiserDetails,
      //   ] = ["", "", "", "", "", "", "", "", "", "", "", ""];
      //   if (
      //     rawRecord.includes("(2)") &&
      //     rawRecord.includes("(3)") &&
      //     rawRecord.includes("(4)") &&
      //     rawRecord.includes("(5)") &&
      //     rawRecord.includes("(6)")
      //   ) {
      //     caseNumber = rawRecord.split("(2)")[0].replace(/—/g, "");
      //     particulars = rawRecord.split("(2)")[1].split("(3)")[0];
      //     idNumber = extractFirst13DigitNumber(rawRecord);
      //     name = particulars.split(", ")[0] + " , " + particulars.split(", ")[1].split(" (")[0];
      //     description = item.rawRecord
      //       .split("(3)")[1]
      //       .split("(4)")[0]
      //       .replace(/;/g, "");
      //     noticeDate = item.noticeDate.split("T")[0];
      //     spousedetails = rawRecord
      //       .split("(4)")[1]
      //       .split("(5)")[0]
      //       .replace(/;/g, "");
      //     period = rawRecord.split("(5)")[1].split("(6)")[0].replace(".", "");
      //     advertiserDetails = item.rawRecord.split("(6)")[1];
      //     executorName = advertiserDetails.split("; ")[0];
      //     if (advertiserDetails.includes("Tel: ")) {
      //       executorPhone = advertiserDetails.split("Tel: ")[1];
      //       executorPhone = executorPhone.trim().replace(/[^0-9\s]/g, "");
      //     }

      //     executorEmail = extractEmail(advertiserDetails)
      //       ?.trim()
      //       .replace(/;/g, "");
      //   } else {
      //     if (rawRecord.includes("(2)")) {
      //       caseNumber = rawRecord.split("(2)")[0].replace(/—/g, "");
      //     }
      //     if (rawRecord.includes("(3)")) {
      //       particulars = rawRecord.split("(2)")[1].split("(3)")[0];
      //       name = particulars.split(", ")[0] + " , " + particulars.split(", ")[1].split(" (")[0];
      //     }
      //     if (rawRecord.includes("(4)" && rawRecord.includes("(3)"))) {
      //       description = item.rawRecord
      //         .split("(3)")[1]
      //         .split("(4)")[0]
      //         .replace(/;/g, "");
      //     }
      //     if (rawRecord.includes("(5)") && rawRecord.includes("(4)")) {
      //       spousedetails = rawRecord
      //         .split("(4)")[1]
      //         .split("(5)")[0]
      //         .replace(/;/g, "");
      //     }
      //     if (rawRecord.includes("(5)") && rawRecord.includes("(6)")) {
      //       period = rawRecord.split("(5)")[1].split("(6)")[0].replace(".", "");
      //       advertiserDetails = item.rawRecord.split("(6)")[1];
      //       executorName = advertiserDetails.split("; ")[0];
      //       if (advertiserDetails.includes("Tel: ")) {
      //         executorPhone = advertiserDetails.split("Tel: ")[1];
      //         executorPhone = executorPhone.trim().replace(/[^0-9\s]/g, "");
      //       }
      //       executorEmail = extractEmail(advertiserDetails)
      //         ?.trim()
      //         .replace(/;/g, "");
      //     }

      //     idNumber = extractFirst13DigitNumber(rawRecord);
      //     noticeDate = item.noticeDate.split("T")[0];
      //   }

      //   let itemObject = {
      //     caseNumber: caseNumber,
      //     idNumber: idNumber,
      //     name: name,
      //     particulars: particulars,
      //     noticeDate: noticeDate,
      //     description,
      //     spousedetails,
      //     period,
      //     executorName,
      //     executorPhone,
      //     executorEmail,
      //     rawRecord: rawRecord,
      //   };

      //   tempRowData.push(itemObject);
      // });

      if(response.data) {
        setRowData1(response.data);
      }

      setTotalRecords1(response.totalRecords);
    }
  };

  const fetch193Data = useCallback(
    debounce(async (searchText) => {
      try {
        const response = await getForm193RecordsAPI(
          currentPage,
          pageSize,
          [],
          searchText,
          searchOption.value
        );

        let searchLog = {
          userId:  user && user.userId,
          type: "J193",
          searchString: searchText
        }

        if(response) {
          extractForm193Data(response);
          await createSearchLogAPI(searchLog);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 1000),
    [currentPage, pageSize, user, searchOption]
  );

  useEffect(() => {
    document.title = "Monitor | Dashboard";

    const user = JSON.parse(window.localStorage.getItem("user"));
    if (user) {
      setUser(user);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (searchText.trim() === "") {
        // Fetch all records
        try {
          const response = await getForm193RecordsAPI(
            currentPage,
            pageSize,
            [],
            ""
          );

          extractForm193Data(response);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        fetch193Data(searchText);
      }
    };

    fetchData();
  }, [searchText, searchOption, currentPage, pageSize, fetch193Data]);

  const fetch187Data = useCallback(
    debounce(async (searchText1) => {
      try {
        const response = await getForm187RecordsAPI(
          currentPage1,
          pageSize1,
          [],
          searchText1,
          searchOption1.value
        );
        
        let searchLog = {
          userId:  user && user.userId,
          type: "J187",
          searchString: searchText1
        }

        if(response) {
          extractForm187Data(response);
          await createSearchLogAPI(searchLog);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 1000),
    [currentPage1, pageSize1, user, searchOption1]
  );

  useEffect(() => {
    const fetchData = async () => {
      if (searchText1.trim() === "") {
        // Fetch all records
        try {
          const response = await getForm187RecordsAPI(
            currentPage1,
            pageSize1,
            [],
            ""
          );

          extractForm187Data(response);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        fetch187Data(searchText1);
      }
    };

    fetchData();
  }, [searchText1, searchOption1, currentPage1, pageSize1, fetch187Data]);

  // const defaultColDef = useMemo(() => {
  //   return {
  //     filter: false,
  //     floatingFilter: true,
  //   };
  // }, []);

  return (
    <div className="container-fluid">
      <div className="my-4 page-header-breadcrumb d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h1 className="page-title fw-medium fs-18 mb-2">{t("dashboard")}</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-12">
          <div className="card custom-card">
            <div className="card-header">
              <div className="card-title">Form193 Records Table</div>
            </div>
            <div className="card-body">
              <div className="gridjs-head flex items-center justify-between mb-2 gap-2">
                <div className="gridjs-search text-right w-full">
                  <input
                    placeholder="Type a keyword..."
                    type="search"
                    onChange={(e) => onChangeSearchText(e)}
                    value={searchText}
                    className="gridjs-input gridjs-search-input w-full"
                    style={{ outline: "0" }}
                  />
                </div>
                <div className="w-[14rem] pl-0 relative">
                    <a
                      href="/#"
                      // onClick={(e) => handleSelectInput(e)}
                      class="btn bg-body header-dashboards-button text-start d-flex align-items-center justify-content-between"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {searchOption?.label || ''}
                    </a>
                    <ul
                      className="dropdown-menu dashboard-dropdown w-[14rem]"
                      role="menu"
                    >
                      {form193SearchOptions &&
                        form193SearchOptions.map((x, index) => (
                          <li key={index} className="dropdown-item dashboards-dropdown-item w-100 cursor-pointer" onClick={() => handleSelectSearchOption('form193', x)}>
                            {x.label}
                          </li>
                        ))}
                    </ul>
                  </div>
              </div>
              <div className={`${theme ==="dark" ? "ag-theme-quartz-dark" : "ag-theme-quartz"}`} style={{ width: "100%" }}>
                <AgGridReact
                  // defaultColDef={defaultColDef}
                  // pagination={true}
                  // paginationPageSize={pageSize}
                  // onSortChanged={onSortChanged}
                  // onPaginationChanged={onPaginationChanged}
                  // onFilterChanged={onFilterChanged}
                  columnDefs={columnDefs}
                  rowData={rowData}
                  onGridReady={onGridReady}
                  domLayout="autoHeight"
                  suppressPaginationPanel={false}
                />
                <div className="gridjs-footer1">
                  <div className="gridjs-pagination d-flex justify-content-between align-items-center">
                    <div className="gridjs-summary pl-4 hidden md:block">
                      Showing <b>{pageSize * currentPage + 1}</b> to{" "}
                      <b>{pageSize * (currentPage + 1)}</b> of{" "}
                      <b>{totalRecords}</b> results
                    </div>
                    <div className="dashboard-data-table">
                      <TablePagination
                        rowsPerPageOptions={[10, 20, 50]}
                        component="div"
                        count={totalRecords}
                        rowsPerPage={pageSize}
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
      <div className="row mt-4">
        <div className="col-xl-12">
          <div className="card custom-card">
            <div className="card-header">
              <div className="card-title">Form187 Records Table</div>
            </div>
            <div className="card-body">
              <div className="gridjs-head flex jutify-between items-center w-full mb-2 gap-2">
                <div className="gridjs-search text-right w-full">
                  <input
                    placeholder="Type a keyword..."
                    type="search"
                    onChange={(e) => onChangeSearchText1(e)}
                    value={searchText1}
                    className="gridjs-input gridjs-search-input w-full"
                    style={{ outline: "0" }}
                  />
                </div>
                <div className="w-[14rem] pl-0 relative">
                    <a
                      href="/#"
                      // onClick={(e) => handleSelectInput(e)}
                      class="btn bg-body header-dashboards-button text-start d-flex align-items-center justify-content-between"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {searchOption1?.label || ''}
                    </a>
                    <ul
                      className="dropdown-menu dashboard-dropdown w-[14rem]"
                      role="menu"
                    >
                      {form187SearchOptions &&
                        form187SearchOptions.map((x, index) => (
                          <li key={index} className="dropdown-item dashboards-dropdown-item w-100 cursor-pointer" onClick={() => handleSelectSearchOption('form187', x)}>
                            {x.label}
                          </li>
                        ))}
                    </ul>
                  </div>
              </div>
              <div className={`${theme ==="dark" ? "ag-theme-quartz-dark" : "ag-theme-quartz"}`} style={{ width: "100%" }}>
                <AgGridReact
                  columnDefs={columnDefs1}
                  rowData={rowData1}
                  domLayout="autoHeight"
                  suppressPaginationPanel={false}
                />
                <div className="gridjs-footer1">
                  <div className="gridjs-pagination d-flex justify-content-between align-items-center">
                    <div className="gridjs-summary pl-4 hidden md:block">
                      Showing <b>{pageSize1 * currentPage1 + 1}</b> to{" "}
                      <b>{pageSize1 * (currentPage1 + 1)}</b> of{" "}
                      <b>{totalRecords1}</b> results
                    </div>
                    <div className="dashboard-data-table">
                      <TablePagination
                        rowsPerPageOptions={[10, 20, 50]}
                        component="div"
                        count={totalRecords1}
                        rowsPerPage={pageSize1}
                        page={currentPage1}
                        onPageChange={handleChangePage1}
                        onRowsPerPageChange={handleChangeRowsPerPage1}
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
      {/* {(user && user.role === "Superadmin") && (
        <div className="d-grid my-4">
          <button
            onClick={() => clickMonitorActionBtn()}
            className="btn btn-lg btn-primary"
          >
            Run Monitor Action
          </button>
        </div>
      )} */}
    </div>
  );
};

export default Dashboard;
