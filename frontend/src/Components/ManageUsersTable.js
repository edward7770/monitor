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
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import ToggleButton from "./ToggleButton";
import { useTranslation } from "react-i18next";

const ManageUsersTable = (props) => {
  const { t } = useTranslation();
  const { data, role } = props;
  const [page, setPage] = useState(0);
  // const [role, setRole] = useState(null);
  // const [userId, setUserId] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openId, setOpenId] = useState(null);

  const closeCollapse = (event) => {
    event.preventDefault();
    setOpenId(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const ClickTableRow = (id) => {
    setOpenId(id);
  };

  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem("user"));
    // if (user) {
    //   setRole(user.role);
    //   setUserId(user.userId);
    // }
  }, [openId]);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  return (
    <>
      <div className="relative overflow-x-auto p-5" id="manageusers_table">
        <TableContainer>
          <Table className="w-full rtl:text-right">
            <TableHead className="text-md border-0 opacity-70 bg-gray-50">
              <TableRow>
                <TableCell className="w-1/12"></TableCell>
                {role !== "Supplier" && <TableCell className="w-1/6">{t("supplier_name")}</TableCell>}
                <TableCell className="w-1/12">{t("name")}</TableCell>
                <TableCell className="w-1/12">{t("surname")}</TableCell>
                <TableCell className="w-1/6">{t("email_address")}</TableCell>
                <TableCell className="w-1/8">{t("role")}</TableCell>
                <TableCell className="w-1/6">{t("created_date")}</TableCell>
                <TableCell className="w-1/4"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="opacity-80">
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <React.Fragment key={row.userId}>
                      <TableRow
                        onClick={
                          openId === row.userId
                            ? (event) => closeCollapse(event)
                            : () => ClickTableRow(row.userId)
                        }
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
                              : null
                          }
                          style={{ border: "0px", textAlign: "center" }}
                        >
                          <a
                            className={
                              openId === row.userId
                                ? "relative whitespace-nowrap rounded-full py-1 text-sm text-slate-500 transition no-underline"
                                : "group/edit invisible relative whitespace-nowrap rounded-full py-1 text-sm text-slate-500 no-underline transition group-hover/item:visible"
                            }
                            href="/#"
                          >
                            <i className="fa fa-eye"></i>
                          </a>
                        </TableCell>
                        {role !== "Supplier" && <TableCell style={{ border: "0px" }}>{row.role === "Admin" ? "Admin" : row.role === "Supplier" ? row.supplier.companyName : props.getSupplierNameForClient(row.userId)}</TableCell>}
                        <TableCell style={{ border: "0px", minWidth: '200px' }}>
                          {row.name && row.name.split(" ")[0]}
                        </TableCell>
                        <TableCell style={{ border: "0px" }}>
                          {row.name && row.name.split(" ")[1]}
                        </TableCell>
                        <TableCell style={{ border: "0px" }}>
                          {row.email}
                        </TableCell>
                        <TableCell style={{ border: "0px" }}>
                          {row.role === "" ? "User" : row.role}
                        </TableCell>
                        <TableCell style={{ border: "0px" }}>
                          {row.dateCreated && row.dateCreated.split("T")[0]}
                        </TableCell>
                        <TableCell style={{ border: "0px" }}>
                          <div className="w-full grid lg:grid-cols-1 grid-cols-1 gap-5 pt-2 pb-2">
                            <div className="text-center flex w-full justify-center items-center">
                              <span className="mr-4 text-sm">
                                {t("user_status")}
                              </span>
                              <ToggleButton
                                row={row}
                                type="status"
                                toggleButtonSwitch={
                                  props.toggleUserStatusSwitch
                                }
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                      {openId === row.userId && (
                        <TableRow className="w-full border-t-2">
                          <TableCell
                            colSpan={7}
                            style={{
                              paddingTop: "5px",
                              paddingBottom: "5px",
                              border: "0px"
                            }}
                          >
                            {row.role === "Client" ? (
                              <></>
                            ) : (
                              <div className="pt-0 w-full flex justify-end">
                                <h2 className="mr-4 text-md" style={{marginTop: "12px"}}><b>{t("roles")}: </b></h2>
                                {(row.role === "Supplier" ||
                                  (row.role === "" && row.supplier) || row.role === "") && (
                                  <div className="text-center items-center">
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          onChange={(e) =>
                                            props.toggleUserRoleSwitch(row, e)
                                          }
                                          name="Supplier"
                                          checked={
                                            row.role === "Supplier"
                                              ? true
                                              : false
                                          }
                                        />
                                      }
                                      label={t("supplier")}
                                    />
                                  </div>
                                )}
                                {(row.role === "Admin" ||
                                  (row.role === "" && row.client)) && (
                                  <div className="text-center items-center">
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          onChange={(e) =>
                                            props.toggleUserRoleSwitch(row, e)
                                          }
                                          name="Admin"
                                          checked={
                                            row.role === "Admin" ? true : false
                                          }
                                        />
                                      }
                                      label={t("admin")}
                                    />
                                  </div>
                                )}
                                {row.role !== "" && <div className="text-center items-center">
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        onChange={(e) =>
                                          props.toggleUserRoleSwitch(row, e)
                                        }
                                        checked={row.userManagement}
                                        name="UserManagement"
                                      />
                                    }
                                    label={t("user_management")}
                                  />
                                </div>}
                              </div>
                            )}

                            {/* <div className="pt-0 w-full grid lg:grid-cols-1 grid-cols-1 gap-5">
                              <div className="text-center flex w-full justify-center items-center">
                                <span className="mr-4">User Status</span>
                                <ToggleButton
                                  row={row}
                                  type="status"
                                  toggleButtonSwitch={
                                    props.toggleUserStatusSwitch
                                  }
                                />
                              </div>
                            </div> */}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="grid lg:grid-cols-6 grid-cols-1">
        <div className="col-start-2 col-end-4 content-center lg:block hidden">
          {data
            ?  t("table_pagiation_label", {
                prepage: rowsPerPage * page,
                nextpage: rowsPerPage * (page + 1),
                pages: data.length
              })
            : t("data_not_available_label")}
        </div>
        <div className="col-end-7 col-span-3 col-start-4 xl:col-span-2 home-detail-pagination">
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={t('rows_per_page')}
          />
        </div>
      </div>
    </>
  );
};

export default ManageUsersTable;
