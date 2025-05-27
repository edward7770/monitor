import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { FilePond } from "react-filepond";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";
import { getUserAPI } from "../Services/AuthService";
import {
  createProspectAPI,
  createProspectNoteAPI,
  getAllProspectListAPI,
} from "../Services/ProspectService";

let isSetUploadFile = false;

const Prospects = () => {
  const { t } = useTranslation();
  const filePondRef = useRef(null);
  const [data, setData] = useState([]);
  // const [uploadFile, setUploadFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const [user, setUser] = useState(null);
  const [prospectList, setProspectList] = useState(null);
  const [selectedProspects, setSelectedProspects] = useState(null);
  const [selectedProspectListId, setSelectedProspectListId] = useState(null);

  const [isSelected, setIsSelected] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedProspect, setSelectedProspect] = useState(null);

  const [prospectSearchText, setProspectSearchText] = useState("");
  const [newProspectNote, setnewProspectNote] = useState("");

  const onChangeProspectSearchText = (e) => {
    setProspectSearchText(e.target.value);
  };

  const handleSearchTextClient = (e) => {
    setSearchText(e.target.value);
    setIsSelected(false);
  };

  const handleSelectPriceList = (e, item) => {
    e.preventDefault();
    setSearchText(item.name);
    setSelectedProspectListId(item.id);
    setIsSelected(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAddNoteDialog = (row) => {
    setSelectedProspect(row);
  }

  const handleOpenViewProspectDialog = (row) => {
    setSelectedProspect(row);
  }

  const onChangeProspectNote = (e) => {
    setnewProspectNote(e.target.value);
  }

  const handleAddProspectNote = async () => {
    const formData = {
      prospectId: selectedProspect.id,
      note: newProspectNote,
      createdBy: user.userId,
    };

    await createProspectNoteAPI(formData)
      .then(res => {
        if(res) {
          toast.success("Successfully prospect note added!");
          window.document.getElementById("closeAddProspectNoteModal").click();
        }
      })
      .catch(err => {
        toast.error("Failed to add prospect note!");
      })
  }

  const handleCloseAddProspectNote = () => {
    setnewProspectNote("");
    setSelectedProspect(null);
  }

  const handleCloseViewProspect = () => {
    setSelectedProspect(null);
  }

  const handleUploadCSV = (() => {
    let isProcessing = false;

    return (fileItems) => {
      if (isProcessing || fileItems.length === 0) return;

      isProcessing = true;
      const file = fileItems[0]?.file;
      let tempData = [];

      if (file) {
        const reader = new FileReader();
        const fileNameWithoutExtension =
          file.name.substring(0, file.name.lastIndexOf(".")) || file.name;

        setFileName(fileNameWithoutExtension);

        reader.onload = (e) => {
          try {
            // Parse the XLSX file
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });

            // Assume the data is in the first sheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert sheet to JSON for easier manipulation
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Validate headers
            if (
              rows[0][0]?.trim().toLowerCase() === "name" &&
              rows[0][1]?.trim().toLowerCase() === "contactname" &&
              rows[0][2]?.trim().toLowerCase() === "officenumber" &&
              rows[0][3]?.trim().toLowerCase() === "mobilenumber" &&
              rows[0][4]?.trim().toLowerCase() === "email"
            ) {
              const tempRows = rows.slice(1); // Skip header row
              if (tempRows.length > 0) {
                tempRows.forEach((row) => {
                  let rowObj = {
                    name: row[0]?.trim() || "",
                    contactName: row[1]?.trim() || "",
                    officeNumber: row[2]?.trim() || "",
                    mobileNumber: row[3]?.trim() || "",
                    email: row[4]?.trim() || "",
                  };

                  tempData.push(rowObj);
                });

                if (tempData.length > 0) {
                  setData(tempData);
                }
              } else {
                toast.warning("This file is empty!");
              }
            } else {
              toast.warning("Wrong file format!");
            }
          } catch (error) {
            toast.error("An error occurred while processing the file.");
            console.error(error);
          } finally {
            isProcessing = false;
          }
        };

        reader.readAsBinaryString(file);
      }
    };
  })();

  const handleRemoveFile = () => {
    setData([]);
    setFileName("");
    isSetUploadFile = false;
  };

  const handleSaveProspects = async () => {
    let formDataObj = {
      fileName: fileName,
      prospects: data,
    };

    await createProspectAPI(formDataObj)
      .then((res) => {
        if (res) {
          toast.success(
            "Started to process uploaded file. We will return back soon!"
          );

          setData([]);
          setFileName("");
          isSetUploadFile = false;

          if (filePondRef.current) {
            filePondRef.current.removeFiles();
          }
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data);
        } else {
          toast.error("Failed to save prospects!");
        }
      });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      document.title = "Monitor | Prospects";

      const defaultUser = JSON.parse(window.localStorage.getItem("user"));
      if (defaultUser) {
        var tempUser = await getUserAPI(defaultUser.userId);
        if (tempUser) {
          setUser(tempUser);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchProspectListData = async () => {
      if (user) {
        var tempProspectList = await getAllProspectListAPI();
        if (tempProspectList) {
          if (searchText !== "" && !isSelected) {
            for (let i = tempProspectList.length - 1; i >= 0; i--) {
              if (
                !tempProspectList[i].name
                  .toLowerCase()
                  .includes(searchText.toLocaleLowerCase())
              ) {
                tempProspectList.splice(i, 1);
              }
            }
          }

          if (selectedProspectListId) {
            var tempProspects = tempProspectList.filter(
              (x) => x.id === selectedProspectListId
            );

            if (tempProspects && tempProspects.length > 0) {
              let tempData = tempProspects[0].prospects;
              if (prospectSearchText !== "") {
                for (let i = tempData.length - 1; i >= 0; i--) {
                  const lowerSearchText = prospectSearchText.toLowerCase();

                  if (
                    !tempData[i].name.toLowerCase().includes(lowerSearchText) &&
                    !tempData[i].contactName
                      .toLowerCase()
                      .includes(lowerSearchText) &&
                    !tempData[i].email.toLowerCase().includes(lowerSearchText)
                  ) {
                    tempData.splice(i, 1);
                  }
                }
              }
              setSelectedProspects(tempData);
            }
          }

          setProspectList(tempProspectList);
        }
      }
    };

    fetchProspectListData();
  }, [
    user,
    isSelected,
    searchText,
    selectedProspectListId,
    prospectSearchText,
  ]);

  return (
    <>
      <div className="card custom-card mt-4" id="prospects">
        <div className="card-body">
          <FilePond
            ref={filePondRef}
            type="file"
            onupdatefiles={(fileItems) => handleUploadCSV(fileItems)}
            onremovefile={handleRemoveFile}
            className="multiple-filepond"
            acceptedFileTypes={[".csv"]}
            name="filepond"
            allowReorder="true"
            maxFileSize="100MB"
            labelIdle='<i class="bi bi-cloud-arrow-up" style="font-size: 25px;"></i><br/> <span style="font-size: 16px;">Drag & Drop Your Excel File with Prospects or <span class="filepond--label-action">Browse</span></span>'
          />
          <div className="w-[98%] mx-auto mt-4 block">
            <button
              type="button"
              onClick={() => handleSaveProspects()}
              disabled={data.length > 0 ? false : true}
              className={`btn btn-wave w-full ${
                data.length > 0 ? "btn-primary" : "btn-primary-ghost"
              }`}
            >
              Start Process
            </button>
          </div>
          <div className="card custom-card d-none">
            <div className="card-header">
              <div className="card-title">Dropzone</div>
            </div>
            <div className="card-body">
              <form
                data-single="true"
                method="post"
                action="https://httpbin.org/post"
                className="dropzone"
              ></form>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-4">
        <div className="col-xl-12">
          <div className="card custom-card">
            <div className="card-header justify-between">
              <div className="card-title">Prospect List</div>
            </div>
            <div className="card-body">
              <div className="gridjs-head mb-3">
                <div className="header-element d-lg-block d-none my-auto">
                  <div className="dropdown my-auto">
                    <div className="w-100">
                      <input
                        value={searchText}
                        onChange={(e) => handleSearchTextClient(e)}
                        placeholder="Search prospect list name...."
                        className="btn bg-body header-dashboards-button text-start d-flex align-items-center justify-content-between w-100"
                        style={{ color: "rgba(0, 0, 0, 0.87)" }}
                        data-bs-toggle="dropdown"
                        // aria-expanded="false"
                      />
                      <ul
                        className="dropdown-menu dashboard-dropdown w-100"
                        role="menu"
                      >
                        {prospectList &&
                          prospectList.map((x, index) => (
                            <li key={index}>
                              <a
                                className="dropdown-item dashboards-dropdown-item w-100"
                                href="/#"
                                onClick={(e) => handleSelectPriceList(e, x)}
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
              {selectedProspects && isSelected && (
                <>
                  <div className="gridjs-head mt-8">
                    <div className="gridjs-search text-right">
                      <input
                        placeholder="Search for prospects..."
                        type="search"
                        onChange={(e) => onChangeProspectSearchText(e)}
                        value={prospectSearchText}
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
                            className="w-1/4 gridjs-th"
                            style={{ minWidth: "200px" }}
                          >
                            Name
                          </TableCell>
                          <TableCell className="w-1/8 gridjs-th">Contact Name</TableCell>
                          <TableCell className="w-1/8 gridjs-th">Office Number</TableCell>
                          <TableCell className="w-1/8 gridjs-th">Mobile Number</TableCell>
                          <TableCell className="w-1/6 gridjs-th">Email</TableCell>
                          <TableCell className="w-1/8 gridjs-th">Created Date</TableCell>
                          <TableCell className="gridjs-th" style={{ textAlign: "center" }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className="clients-list-table-1">
                        {selectedProspects &&
                          selectedProspects
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
                                    {row.name}
                                  </TableCell>
                                  <TableCell
                                    style={{ border: "0px", minWidth: "120px" }}
                                    className="gridjs-td"
                                  >
                                    {row.contactName}
                                  </TableCell>
                                  <TableCell
                                    style={{ border: "0px", minWidth: "120px" }}
                                    className="gridjs-td"
                                  >
                                    {row.officeNumber}
                                  </TableCell>
                                  <TableCell
                                    style={{ border: "0px", minWidth: "120px" }}
                                    className="gridjs-td"
                                  >
                                    {row.mobileNumber}
                                  </TableCell>
                                  <TableCell
                                    style={{ border: "0px", minWidth: "120px" }}
                                    className="gridjs-td"
                                  >
                                    {row.email}
                                  </TableCell>
                                  <TableCell
                                    style={{ border: "0px", minWidth: "120px" }}
                                    className="gridjs-td"
                                  >
                                    {row.dateCreated.split("T")[0]}
                                  </TableCell>
                                  <TableCell style={{ border: "0px" }} className="gridjs-td">
                                    <div className="flex justify-center items-center">
                                      <button
                                        className="btn btn-icon btn-sm btn-info mr-3"
                                        type="button"
                                        data-bs-toggle="modal"
                                        data-bs-target="#staticBackdrop1"
                                        onClick={() =>
                                          handleOpenViewProspectDialog(row)
                                        }
                                      >
                                        <i className="ri-eye-line"></i>
                                      </button>
                                      <button
                                        className="btn btn-icon btn-sm btn-success"
                                        type="button"
                                        data-bs-toggle="modal"
                                        data-bs-target="#staticBackdrop"
                                        onClick={() =>
                                          handleOpenAddNoteDialog(row)
                                        }
                                      >
                                        <i className="ri-add-line"></i>
                                      </button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              </React.Fragment>
                            ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <div className="gridjs-footer1">
                    <div className="gridjs-pagination d-flex justify-content-between align-items-center">
                      <div className="gridjs-summary pl-4 hidden md:block">
                        Showing <b>{rowsPerPage * page + 1}</b> to{" "}
                        <b>{rowsPerPage * (page + 1)}</b> of{" "}
                        <b>{selectedProspects && selectedProspects.length}</b>{" "}
                        results
                      </div>
                      <div className="dashboard-data-table">
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 20]}
                          component="div"
                          count={selectedProspects && selectedProspects.length}
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
                Add Note to {selectedProspect?.name}
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row pb-4">
                <div className="col-xl-12">
                  <textarea
                    className="form-control"
                    id="newProspectNote"
                    placeholder="Please add a note here..."
                    rows={5}
                    value={newProspectNote}
                    onChange={(e) => onChangeProspectNote(e)}
                  />
                </div>
                {" "}
              </div>
              <div className="modal-footer pb-0">
                <button
                  type="button"
                  onClick={() => handleAddProspectNote()}
                  className="btn btn-primary"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                  id="closeAddProspectNoteModal"
                  onClick={() => handleCloseAddProspectNote()}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="staticBackdrop1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="staticBackdropLabel1">
                View Prospect
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body max-h-[600px] overflow-y-auto">
              <div className="row pb-4">
                <div className="col-xl-12">
                  <TableContainer
                    sx={{ border: 1, borderRadius: 2, borderColor: "grey.300" }}
                    className="gridjs-table-border"
                  >
                    <Table className="w-full rtl:text-right">
                      <TableHead className="text-md border-0 bg-gray-50 client-table-header">
                        <TableRow>
                          <TableCell
                            className="w-3/4 gridjs-th"
                            style={{ minWidth: "200px" }}
                          >
                            Note
                          </TableCell>
                          <TableCell className="w-1/4">Date Time</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className="clients-list-table-1">
                        {selectedProspect &&
                          selectedProspect.notes
                            .map((row) => (
                              <React.Fragment key={row.id}>
                                <TableRow className="odd:bg-white group/item even:bg-slate-50 border-0 cursor-pointer hover:bg-gray-100 w-full">
                                  <TableCell
                                    style={{ border: "0px"}}
                                    className="gridjs-td"
                                  >
                                    {row.note}
                                  </TableCell>
                                  <TableCell
                                    style={{ border: "0px"}}
                                    className="gridjs-td"
                                  >
                                    {row.dateCreated.split("T")[0] + " " + row.dateCreated.split("T")[1].split(".")[0]}
                                  </TableCell>
                                </TableRow>
                              </React.Fragment>
                            ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                {" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Prospects;
