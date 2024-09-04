import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
// import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
  Accordion,
  AccordionDetails,
  Checkbox,
  Tooltip,
} from "@mui/material";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import { useAuth } from "../context/useAuth";
import { useTranslation } from "react-i18next";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.8rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  background: "transparent",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  // "& .MuiAccordionSummary-content": {
  //   marginLeft: theme.spacing(2),
  // },
}));

const TablePaginationSort = (props) => {
  const { t } = useTranslation();
  const { data, priceInstall } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const [compareSolutions, setCompareSolutions] = useState([]);

  const { isLoggedIn } = useAuth();
  // const [orderBy, setOrderBy] = useState("id");
  // const [order, setOrder] = useState("asc");

  // const navigate = useNavigate();

  // const handleRequestSort = (property) => {
  //   const isAsc = orderBy === property && order === "asc";
  //   setOrderBy(property);
  //   setOrder(isAsc ? "desc" : "asc");
  // };
  const [openId, setOpenId] = useState(null);
  const [isSetCompareSolutions, setIsSetCompareSolutions] = useState(false);

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

  const onAddCompareSolution = (item, e) => {
    // e.stopPropagation();
    // if (e.target.checked === true) {
    //   if(compareSolutions.length === 3) {
    //     toast.warning(t("set_compare_solutions_warning"));
    //   } else {
    //     compareSolutions.push(item);
    //   }
    // } else {
    //   var findSolutionId = compareSolutions
    //     .map((solution) => solution.id)
    //     .indexOf(item.id);
    //   if (findSolutionId > -1) {
    //     compareSolutions.splice(findSolutionId, 1);
    //   }
    // }
    props.onAddCompareSolution(item, e);
    setIsSetCompareSolutions(!isSetCompareSolutions);
    // setCompareSolutions(compareSolutions);
  };

  // const onClickSolutionDetail = (event, solutionId) => {
  //   event.preventDefault(); // Prevents the default behavior of the click event, such as following a link
  //   navigate(`/solution-detail/${solutionId}`); // Navigates to the URL `/solution-detail/${solutionId}`
  // }

  const formatStorageWattsNumber = (number) => {
    return number.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });
  };

  const formatNumber = (number) => {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatThousandNumber = (number) => {
    return number.toLocaleString("en-US", {
      maximumFractionDigits: 3,
    });
  };

  // const formatOnepointNumber = (number) => {
  //   return number.toLocaleString("en-US", {
  //     minimumFractionDigits: 1,
  //   });
  // };

  const formatTwopointNumber = (number) => {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });
  };

  const ClickTableRow = (id) => {
    // props.onTableRowClick(id);
    setOpenId(id);
  };

  // const sortedData = data.sort((a, b) => {
  //   const isAsc = order === "asc";
  //   if (a[orderBy] < b[orderBy]) {
  //     return isAsc ? -1 : 1;
  //   }
  //   if (a[orderBy] > b[orderBy]) {
  //     return isAsc ? 1 : -1;
  //   }
  //   return 0;
  // });

  const [docPreviewPath, setDocPreviewPath] = useState(null);

  const onInputPreviewDocPath = (path) => {
    setDocPreviewPath(path);
  };

  useEffect(() => {
    // console.log(selectedSort);
    // setOrderBy(selectedSort);
  }, [openId, isSetCompareSolutions]);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  return (
    <>
      <div className="relative overflow-x-auto p-3 md:pt-5 pt-0">
        <TableContainer>
          <Table className="w-full rtl:text-right">
            <TableHead className="text-md border-0 opacity-70 bg-gray-50 dashboard-table-header">
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell
                  className="w-1/6"
                  style={{ minWidth: "200px", paddingLeft: "0px" }}
                >
                  {t("name")}
                </TableCell>
                <TableCell className="w-1/12" style={{ minWidth: "120px" }}>
                  {t("supplier")}
                </TableCell>
                <TableCell className="w-1/6" style={{ minWidth: "120px" }}>
                  {t("inverter")}
                </TableCell>
                <TableCell className="w-1/6" style={{ minWidth: "150px" }}>
                  {t("panel")}
                </TableCell>
                <TableCell className="w-1/6" style={{ minWidth: "120px" }}>
                  {t("storage")}
                </TableCell>
                {(priceInstall === false || priceInstall === null) && (
                  <TableCell
                    style={{ textAlign: "right", minWidth: "150px" }}
                    className="w-1/9"
                  >
                    {t("equipment_price")}
                  </TableCell>
                )}
                {(priceInstall === true || priceInstall === null) && (
                  <TableCell
                    style={{ textAlign: "right", minWidth: "200px" }}
                    className="w-2/9"
                  >
                    {t("price")}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody className="opacity-80 dashboard-table-body">
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      key={row.id}
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
                            : () => ClickTableRow(row.id)
                        }
                        style={{ border: "0px" }}
                      >
                        <a
                          className={
                            openId === row.id
                              ? "relative flex items-center whitespace-nowrap rounded-full py-1 text-sm text-slate-500 transition no-underline"
                              : "group/edit invisible relative flex items-center whitespace-nowrap rounded-full py-1 text-sm text-slate-500 no-underline transition group-hover/item:visible"
                          }
                          href="/#"
                        >
                          <i className="fa fa-eye"></i>
                        </a>
                      </TableCell>

                      <TableCell
                        style={{
                          border: "0px",
                          paddingLeft: "0px",
                        }}
                      >
                        <Tooltip title={t("compare_tooltip_content")}>
                          <Checkbox
                            checked={
                              props.compareSolutions &&
                                props.compareSolutions
                                  .map((item) => item.id)
                                  .indexOf(row.id) > -1
                                ? true
                                : false
                            }
                            onChange={(e) => onAddCompareSolution(row, e)}
                            color="default"
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        onClick={
                          openId === row.id
                            ? (event) => closeCollapse(event)
                            : () => ClickTableRow(row.id)
                        }
                        style={{
                          border: "0px",
                          minWidth: "200px",
                          paddingLeft: "0px",
                        }}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell
                        onClick={
                          openId === row.id
                            ? (event) => closeCollapse(event)
                            : () => ClickTableRow(row.id)
                        }
                        style={{ border: "0px", minWidth: "120px" }}
                      >
                        {row.supplier.companyName}
                      </TableCell>
                      <TableCell
                        onClick={
                          openId === row.id
                            ? (event) => closeCollapse(event)
                            : () => ClickTableRow(row.id)
                        }
                        style={{ border: "0px", minWidth: "120px" }}
                      >{`${row.solutionDetail.inverter.brand
                        } ${formatThousandNumber(
                          row.solutionDetail.inverter.kva
                        )} W`}</TableCell>
                      <TableCell
                        onClick={
                          openId === row.id
                            ? (event) => closeCollapse(event)
                            : () => ClickTableRow(row.id)
                        }
                        style={{ border: "0px", minWidth: "150px" }}
                      >{`${row.solutionDetail.panel.brand
                        } ${formatThousandNumber(
                          row.solutionDetail.panel.watts *
                          row.solutionDetail.stringCount *
                          row.solutionDetail.panelCount
                        )} Wp`}</TableCell>
                      <TableCell
                        onClick={
                          openId === row.id
                            ? (event) => closeCollapse(event)
                            : () => ClickTableRow(row.id)
                        }
                        style={{ border: "0px", minWidth: "120px" }}
                      >{`${row.solutionDetail.storage?.brand
                        } ${formatStorageWattsNumber(
                          row.solutionDetail.storage?.watts ?? 0*
                          row.solutionDetail.storageCount
                        )} Wh`}</TableCell>
                      {(priceInstall === false || priceInstall === null) && (
                        <TableCell
                          onClick={
                            openId === row.id
                              ? (event) => closeCollapse(event)
                              : () => ClickTableRow(row.id)
                          }
                          // className="float-right"
                          style={{
                            border: "0px",
                            textAlign: "right",
                            minWidth: "150px",
                          }}
                        >{`€ ${formatNumber(row.equipmentPrice)}`}</TableCell>
                      )}
                      {(priceInstall === true || priceInstall === null) && (
                        <TableCell
                          onClick={
                            openId === row.id
                              ? (event) => closeCollapse(event)
                              : () => ClickTableRow(row.id)
                          }
                          style={{
                            border: "0px",
                            textAlign: "right",
                            minWidth: "200px",
                          }}
                        >{`€ ${formatNumber(row.price)}`}</TableCell>
                      )}
                    </TableRow>
                    {openId === row.id && (
                      <TableRow className="w-full border-t-2">
                        <TableCell colSpan={9} style={{ padding: "0px" }}>
                          {props.optioncase === "dashboard" ? (
                            <div className="pt-0 mt-4 w-full grid grid-cols-1 gap-5">
                              <div className="sm:mb-0 mb-3">
                                <div className="bg-cyan-100 shadow-md hover:bg-sky-400 hover:text-cyan-50 hover:shadow-xl rounded-2xl p-6 md:w-full sm:w-3/4 w-1/2 transition ease-in-out delay-50 hover:translate-y-1 hover:scale-[1.02] duration-200">
                                  <div className="font-bold text-md border-b-2 p-2.5 pt-1 mb-1 rounded-lg cursor-pointer">
                                    {t("supplier_contact_header")}
                                  </div>
                                  <div className="grid grid-cols-3 gap-3 mt-2 pl-4">
                                    <div className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                      <b>{t("company_name")}: </b>
                                      {row.supplier.companyName}
                                    </div>
                                    <div className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                      <b>{t("company_registeration")}: </b>
                                      {row.supplier.registrationNumber}
                                    </div>
                                    <div className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                      <b>{t("email_address")}: </b>
                                      {row.supplier.contactEmail}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-3 gap-3 pl-4">
                                    <div className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                      <b>{t("contact_mobile")}: </b>
                                      {row.supplier.mobile}
                                    </div>
                                    <div className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                      <b>{t("alternative_phone")}: </b>
                                      {row.supplier.phone}
                                    </div>
                                    <div className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                      <b>{t("address")}: </b>
                                      {row.supplier.addressLine1},{" "}
                                      {row.supplier.addressLine2 &&
                                        `${row.supplier.addressLine2},`}{" "}
                                      {row.supplier.addressLine3},{" "}
                                      {row.supplier.addressLine4},{" "}
                                      {row.supplier.addressPostalCode}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            !isLoggedIn() && (
                              <Alert
                                severity="info"
                                style={{
                                  backgroundColor: "rgb(217 251 254)",
                                  marginTop: "10px",
                                }}
                              >
                                {t("supplier_contact_description")}{" "}
                                <a
                                  className="underline hover:underline"
                                  href="/login"
                                >
                                  {t("login")}
                                </a>{" "}
                                {t("or")}{" "}
                                <a
                                  className="underline hover:underline"
                                  href="/register"
                                >
                                  {t("register")}
                                </a>
                                .
                              </Alert>
                            )
                          )}
                          <div className="pt-0 mt-4 w-full grid lg:grid-cols-3 grid-cols-1 gap-5 dashboard-solution-content">
                            {/* {["inverter", "panel", "storage"].map((type, index) => (
                              <div key={index} className="sm:mb-0 mb-3">
                                <div className="bg-cyan-100 shadow-md hover:bg-sky-400 hover:text-cyan-50 hover:shadow-xl rounded-2xl p-6 lg:min-h-[416px] md:w-full sm:w-3/4 w-1/2 transition ease-in-out delay-50 hover:translate-y-1 hover:scale-105 duration-200">
                                  <div className="font-bold text-md border-b-2 p-2.5 pt-1 mb-1 rounded-lg cursor-pointer">{`${type
                                    .charAt(0)
                                    .toUpperCase()}${type.slice(1)}`}</div>
                                  <ul className="marker:text-green-300 list-disc space-x-3 m-0 p-2 pl-4">
                                    {Object.entries(
                                      row?.solutionDetail[type] || {}
                                    ).map(
                                      ([key, value]) =>
                                        key !== "id" &&
                                        key !== "documentations" &&
                                        key !== "brandId" && (
                                          <li
                                            key={key}
                                            className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1"
                                          >
                                            <b>
                                              {`${key.charAt(0).toUpperCase()}${key
                                                .replace(/([a-z])([A-Z])/g, "$1 $2")
                                                .slice(1)}`}
                                              &nbsp; {key !== "documentations" && "-"}
                                            </b>{" "}
                                            {value}
                                          </li>
                                        )
                                    )}
                                    {row.solutionDetail[type].documentations.length !== 0 && <li
                                      className="text-xs font-medium mb-1 pl-1"
                                    >
                                      <b className="hover:font-extrabold cursor-pointer">Documentations</b>
                                      {row.solutionDetail[type].documentations.slice().sort((a, b) => a.name.localeCompare(b.name)).map(documentation => (
                                        <a key={documentation.id} href={documentation.file} target="_blank" rel="noreferrer"><p className="ml-4"><i className="fa fa-file-pdf-o" />&nbsp;{documentation.name}</p></a>
                                      ))}
                                    </li>}
                                  </ul>
                                </div>
                              </div>
                            ))} */}
                            <div className="sm:mb-0 mb-3">
                              <div
                                className={`bg-cyan-50 shadow-md hover:bg-cyan-100 md:mb-5 mb-0 hover:shadow-lg rounded-xl p-6 transition ease-in-out delay-50 hover:translate-y-1 hover:scale-105 duration-200 ${row.solutionDetail.panel.documentations
                                  .length > 0
                                  ? "lg:min-h-[520px]"
                                  : "lg:min-h-[440px]"
                                  }`}
                              >
                                <div className="font-bold text-md border-b-2 p-2.5 pt-1 mb-1 rounded-lg cursor-pointer">
                                  {t("inverter")}
                                </div>
                                <ul className="marker:text-green-300 list-disc space-x-3 m-0 p-2 pl-4">
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("brand")}:</b>{" "}
                                    {row.solutionDetail.inverter.brand}
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("model_number")}:</b>{" "}
                                    {row.solutionDetail.inverter.modelNumber}
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("phase")}:</b>{" "}
                                    {row.solutionDetail.inverter.phaseCount ===
                                      3 && t("three_phase")}
                                    {row.solutionDetail.inverter.phaseCount ===
                                      1 && t("single_phase")}
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("string_count")}:</b>{" "}
                                    {row.solutionDetail.inverter.strings}
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>Volts:</b>{" "}
                                    {row.solutionDetail.inverter.volts}&nbsp;V
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>Watts:</b>{" "}
                                    {formatThousandNumber(
                                      row.solutionDetail.inverter.kva
                                    )}
                                    &nbsp;W
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>VOC:</b>{" "}
                                    {formatTwopointNumber(
                                      row.solutionDetail.inverter.voc
                                    )}
                                    &nbsp;V
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>Max MPPT Volts:</b>{" "}
                                    {row.solutionDetail.inverter.maxMPPTVolts}
                                    &nbsp;V
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>Max MPPT Watts:</b>{" "}
                                    {formatThousandNumber(
                                      row.solutionDetail.inverter.maxMPPTWatts
                                    )}
                                    &nbsp;W
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>Max MPPT Amps:</b>{" "}
                                    {formatTwopointNumber(
                                      row.solutionDetail.inverter.maxMPPTAmps
                                    )}
                                    &nbsp;A
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>Operating Voltage Range:</b>{" "}
                                    {
                                      row.solutionDetail.inverter
                                        .pvOperatingVoltageRange
                                    }
                                    &nbsp;V
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("efficiency")}:</b>{" "}
                                    {row.solutionDetail.inverter.efficiency}
                                    &nbsp;%
                                  </li>
                                  {row.solutionDetail.inverter.documentations
                                    .length !== 0 && (
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("documentations")}</b>{" "}
                                        {row.solutionDetail.inverter.documentations
                                          .slice()
                                          .sort((a, b) =>
                                            a.name.localeCompare(b.name)
                                          )
                                          .map((documentation, index) => (
                                            <React.Fragment key={index}>
                                              <div
                                                className="flex align-middle justify-between items-center p-1 border-1 border-b-gray-500"
                                                key={index}
                                              >
                                                <div className="flex">
                                                  <i className="fa fa-file-pdf-o"></i>
                                                  <div className="ml-2">
                                                    <h6>{documentation.name}</h6>
                                                  </div>
                                                </div>
                                                <div className="float-right">
                                                  <button
                                                    className="mr-4 text-sm"
                                                    type="button"
                                                    data-toggle="modal"
                                                    data-target="#deviceDocPreviewModal"
                                                    onClick={() =>
                                                      onInputPreviewDocPath(
                                                        documentation.file
                                                      )
                                                    }
                                                  >
                                                    <span className="fa fa-eye" />
                                                  </button>
                                                </div>
                                              </div>
                                              <hr />
                                            </React.Fragment>
                                          ))}
                                      </li>
                                    )}
                                </ul>
                              </div>
                            </div>
                            <div className="sm:mb-0 mb-3">
                              <div
                                className={`bg-cyan-50 shadow-md hover:bg-cyan-100 md:mb-5 mb-0 hover:shadow-lg rounded-xl p-6 transition ease-in-out delay-50 hover:translate-y-1 hover:scale-105 duration-200 ${row.solutionDetail.panel.documentations
                                  .length > 0
                                  ? "lg:min-h-[520px]"
                                  : "lg:min-h-[440px]"
                                  }`}
                              >
                                <div className="font-bold text-md border-b-2 p-2.5 pt-1 mb-1 rounded-lg cursor-pointer">
                                  {t("panel")}
                                </div>
                                <ul className="marker:text-green-300 list-disc space-x-3 m-0 p-2 pl-4">
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("brand")}:</b>{" "}
                                    {row.solutionDetail.panel.brand}
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("model_number")}:</b>{" "}
                                    {row.solutionDetail.panel.modelNumber}
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("qty")}:</b>{" "}
                                    {row.solutionDetail.panelCount}
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>Watts:</b>{" "}
                                    {row.solutionDetail.panel.watts}&nbsp;W
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>VOC:</b> {row.solutionDetail.panel.voc}
                                    &nbsp;V
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>
                                      Amps(I
                                      <span className="text-[8px]">MPP</span>):
                                    </b>{" "}
                                    {formatTwopointNumber(
                                      row.solutionDetail.panel.amps
                                    )}
                                    &nbsp;A
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("width")}:</b>{" "}
                                    {formatThousandNumber(
                                      row.solutionDetail.panel.width
                                    )}
                                    &nbsp;mm
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("height")}:</b>{" "}
                                    {formatThousandNumber(
                                      row.solutionDetail.panel.height
                                    )}
                                    &nbsp;mm
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("depth")}:</b>{" "}
                                    {formatThousandNumber(
                                      row.solutionDetail.panel.depth
                                    )}
                                    &nbsp;mm
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("weight")}:</b>{" "}
                                    {formatTwopointNumber(
                                      row.solutionDetail.panel.weight
                                    )}
                                    &nbsp;kg
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("frame_color")}:</b>{" "}
                                    {row.solutionDetail.panel.frameColor}
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("color")}:</b>{" "}
                                    {row.solutionDetail.panel.color}
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("connectors")}:</b>{" "}
                                    {row.solutionDetail.panel.connectors}
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("type")}:</b>{" "}
                                    {row.solutionDetail.panel.type}
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("technology")}:</b>{" "}
                                    {row.solutionDetail.panel.technology}
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("efficiency")}:</b>{" "}
                                    {row.solutionDetail.panel.efficiency}&nbsp;%
                                  </li>
                                  {row.solutionDetail.panel.documentations
                                    .length !== 0 && (
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("documentations")}</b>{" "}
                                        {row.solutionDetail.panel.documentations
                                          .slice()
                                          .sort((a, b) =>
                                            a.name.localeCompare(b.name)
                                          )
                                          .map((documentation, index) => (
                                            <React.Fragment key={index}>
                                              <div
                                                className="flex align-middle justify-between items-center p-1 border-1 border-b-gray-500"
                                                key={index}
                                              >
                                                <div className="flex">
                                                  <i className="fa fa-file-pdf-o"></i>
                                                  <div className="ml-2">
                                                    <h6>{documentation.name}</h6>
                                                  </div>
                                                </div>
                                                <div className="float-right">
                                                  <button
                                                    className="mr-4 text-sm"
                                                    type="button"
                                                    data-toggle="modal"
                                                    data-target="#deviceDocPreviewModal"
                                                    onClick={() =>
                                                      onInputPreviewDocPath(
                                                        documentation.file
                                                      )
                                                    }
                                                  >
                                                    <span className="fa fa-eye" />
                                                  </button>
                                                </div>
                                              </div>
                                              <hr />
                                            </React.Fragment>
                                          ))}
                                      </li>
                                    )}
                                </ul>
                              </div>
                            </div>
                            {row.solutionDetail.storage && <div className="sm:mb-0 mb-3">
                              <div
                                className={`bg-cyan-50 shadow-md hover:bg-cyan-100 md:mb-5 mb-0 hover:shadow-lg rounded-xl p-6 transition ease-in-out delay-50 hover:translate-y-1 hover:scale-105 duration-200 ${row.solutionDetail.panel.documentations
                                  .length > 0
                                  ? "lg:min-h-[520px]"
                                  : "lg:min-h-[440px]"
                                  }`}
                              >
                                <div className="font-bold text-md border-b-2 p-2.5 pt-1 mb-1 rounded-lg cursor-pointer">
                                  {t("storage")}
                                </div>
                                <ul className="marker:text-green-300 list-disc space-x-3 m-0 p-2 pl-4">
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("brand")}:</b>{" "}
                                    {row.solutionDetail.storage.brand}
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("model_number")}:</b>{" "}
                                    {row.solutionDetail.storage.modelNumber}
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("qty")}:</b>{" "}
                                    {row.solutionDetail.storageCount}
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>Watts:</b>{" "}
                                    {formatThousandNumber(
                                      row.solutionDetail.storage.watts
                                    )}
                                    &nbsp;Wh
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>Volts:</b>{" "}
                                    {row.solutionDetail.storage.volts}&nbsp;V
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>Amps:</b>{" "}
                                    {row.solutionDetail.storage.amps}&nbsp;A
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>Max Charging Voltage:</b>{" "}
                                    {formatTwopointNumber(
                                      row.solutionDetail.storage
                                        .maxChargingVoltage
                                    )}
                                    &nbsp;V
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>Float Charging Voltage:</b>{" "}
                                    {formatTwopointNumber(
                                      row.solutionDetail.storage
                                        .floatChargingVoltage
                                    )}
                                    &nbsp;V
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>Max Charge Amps:</b>{" "}
                                    {row.solutionDetail.storage.maxChargeAmps}
                                    &nbsp;A
                                  </li>
                                  <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                    <b>{t("weight")}:</b>{" "}
                                    {row.solutionDetail.storage.weight}&nbsp;kg
                                  </li>
                                  {row.solutionDetail.storage.documentations
                                    .length !== 0 && (
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("documentations")}</b>{" "}
                                        {row.solutionDetail.storage.documentations
                                          .slice()
                                          .sort((a, b) =>
                                            a.name.localeCompare(b.name)
                                          )
                                          .map((documentation, index) => (
                                            <React.Fragment key={index}>
                                              <div
                                                className="flex align-middle justify-between items-center p-1 border-1 border-b-gray-500"
                                                key={index}
                                              >
                                                <div className="flex">
                                                  <i className="fa fa-file-pdf-o"></i>
                                                  <div className="ml-2">
                                                    <h6>{documentation.name}</h6>
                                                  </div>
                                                </div>
                                                <div className="float-right">
                                                  <button
                                                    className="mr-4 text-sm"
                                                    type="button"
                                                    data-toggle="modal"
                                                    data-target="#deviceDocPreviewModal"
                                                    onClick={() =>
                                                      onInputPreviewDocPath(
                                                        documentation.file
                                                      )
                                                    }
                                                  >
                                                    <span className="fa fa-eye" />
                                                  </button>
                                                </div>
                                              </div>
                                              <hr />
                                            </React.Fragment>
                                          ))}
                                      </li>
                                    )}
                                </ul>
                              </div>
                            </div>}

                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
            <TableBody className="opacity-80 dashboard-table-body-mobile">
              {/* <TableRow className="w-full" style={{ display: "block" }}>
                <TableCell
                  colSpan={9}
                  className="w-full"
                  style={{ display: "block", borderBottom: "0px" }}
                ></TableCell>
              </TableRow> */}
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow className="w-full" style={{ display: "block" }}>
                      <TableCell
                        colSpan={9}
                        className="w-full"
                        style={{
                          display: "block",
                          borderBottom: "0px",
                          padding: "0px",
                        }}
                      >
                        <div className="pt-0 mt-4 w-full grid lg:grid-cols-3 grid-cols-1 gap-5 dashboard-solution-content">
                          <div className="sm:mb-0 mb-3">
                            <div className="shadow-lg md:mb-5 mb-0 hover:shadow-lg rounded-xl p-6 transition ease-in-out border border-slate-400">
                              <div className="font-bold text-md border-b-2 p-2.5 pt-1 mb-1 rounded-lg cursor-pointer border-slate-600">
                                {row.name}
                                <Tooltip
                                  title={t("compare_tooltip_content")}
                                  style={{ padding: "0px", float: "right" }}
                                >
                                  <Checkbox
                                    checked={
                                      props.compareSolutions &&
                                        props.compareSolutions
                                          .map((item) => item.id)
                                          .indexOf(row.id) > -1
                                        ? true
                                        : false
                                    }
                                    onChange={(e) =>
                                      onAddCompareSolution(row, e)
                                    }
                                    color="default"
                                    inputProps={{
                                      "aria-label": "controlled",
                                    }}
                                  />
                                </Tooltip>
                              </div>
                              <div className="mt-4">
                                <p className="pl-4">
                                  <i
                                    className="fa fa-building-o"
                                    style={{ fontSize: "18px" }}
                                  ></i>
                                  <span className="pl-4 text-sm">
                                    {row.supplier.companyName}
                                  </span>
                                </p>
                              </div>
                              <div className="dashboard-table-card-accordion mt-1">
                                {props.optioncase === "dashboard" ? (
                                  <Accordion>
                                    <AccordionSummary
                                      aria-controls="panel1d-content"
                                      id="panel1d-header"
                                    >
                                      <p className="text-sm pl-2">
                                        {t("supplier_details")}
                                      </p>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <ul className="marker:text-green-300 list-disc space-x-3 m-0 p-2 pl-8">
                                        <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                          <b>{t("company_name")}:</b>{" "}
                                          {row.supplier.companyName}
                                        </li>
                                        <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                          <b>{t("company_registeration")}:</b>{" "}
                                          {row.supplier.registrationNumber}
                                        </li>
                                        <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                          <b>{t("email_address")}:</b>{" "}
                                          {row.supplier.contactEmail}
                                        </li>
                                        <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                          <b>{t("contact_mobile")}:</b>{" "}
                                          {row.supplier.mobile}
                                        </li>
                                        <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                          <b>{t("alternative_phone")}:</b>{" "}
                                          {row.supplier.phone}
                                        </li>
                                        <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                          <b>{t("address")}:</b>{" "}
                                          {row.supplier.addressLine1},{" "}
                                          {row.supplier.addressLine2 &&
                                            `${row.supplier.addressLine2},`}{" "}
                                          {row.supplier.addressLine3},{" "}
                                          {row.supplier.addressLine4},{" "}
                                          {row.supplier.addressPostalCode}
                                        </li>
                                      </ul>
                                    </AccordionDetails>
                                  </Accordion>
                                ) : (
                                  !isLoggedIn() && (
                                    <Alert
                                      severity="info"
                                      style={{
                                        backgroundColor: "rgb(217 251 254)",
                                        marginLeft: "12px",
                                      }}
                                    >
                                      {t("supplier_contact_description")}{" "}
                                      <a
                                        className="underline hover:underline"
                                        href="/login"
                                      >
                                        {t("login")}
                                      </a>{" "}
                                      {t("or")}{" "}
                                      <a
                                        className="underline hover:underline"
                                        href="/register"
                                      >
                                        {t("register")}
                                      </a>
                                      .
                                    </Alert>
                                  )
                                )}
                              </div>
                              <ul className="m-0 p-2 pl-4">
                                <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 mt-1">
                                  <i
                                    className="fa fa-check text-blue-500"
                                    style={{ fontSize: "14px" }}
                                  ></i>
                                  <b className="pl-2">{t("inverter")}:</b>{" "}
                                  {`${row.solutionDetail.inverter.brand
                                    } ${formatThousandNumber(
                                      row.solutionDetail.inverter.kva
                                    )} W`}
                                </li>
                                <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 mt-2">
                                  <i
                                    className="fa fa-check text-blue-500"
                                    style={{ fontSize: "14px" }}
                                  ></i>
                                  <b className="pl-2">{t("panel")}:</b>{" "}
                                  {`${row.solutionDetail.panel.brand
                                    } ${formatThousandNumber(
                                      row.solutionDetail.panel.watts *
                                      row.solutionDetail.stringCount *
                                      row.solutionDetail.panelCount
                                    )} Wp`}
                                </li>
                                <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 mt-2">
                                  <i
                                    className="fa fa-check text-blue-500"
                                    style={{ fontSize: "14px" }}
                                  ></i>
                                  <b className="pl-2">{t("storage")}:</b>{" "}
                                  {`${row.solutionDetail.storage?.brand
                                    } ${formatStorageWattsNumber(
                                      row.solutionDetail.storage?.watts ?? 0 *
                                      row.solutionDetail.storageCount
                                    )} Wh`}
                                </li>
                              </ul>
                              <div className="dashboard-table-card-accordion mt-0">
                                <Accordion>
                                  <AccordionSummary
                                    aria-controls="panel1d-content"
                                    id="panel1d-header"
                                  >
                                    <p className="text-sm pl-2">
                                      {t("inverter_details")}
                                    </p>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <ul className="marker:text-green-300 list-disc space-x-3 m-0 p-2 pl-8">
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("brand")}:</b>{" "}
                                        {row.solutionDetail.inverter.brand}
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("model_number")}:</b>{" "}
                                        {
                                          row.solutionDetail.inverter
                                            .modelNumber
                                        }
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("phase")}:</b>{" "}
                                        {row.solutionDetail.inverter
                                          .phaseCount === 3 && t("three_phase")}
                                        {row.solutionDetail.inverter
                                          .phaseCount === 1 &&
                                          t("single_phase")}
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("string_count")}:</b>{" "}
                                        {row.solutionDetail.inverter.strings}
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>Volts:</b>{" "}
                                        {row.solutionDetail.inverter.volts}
                                        &nbsp;V
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>Watts:</b>{" "}
                                        {formatThousandNumber(
                                          row.solutionDetail.inverter.kva
                                        )}
                                        &nbsp;W
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>VOC:</b>{" "}
                                        {formatTwopointNumber(
                                          row.solutionDetail.inverter.voc
                                        )}
                                        &nbsp;V
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>Max MPPT Volts:</b>{" "}
                                        {
                                          row.solutionDetail.inverter
                                            .maxMPPTVolts
                                        }
                                        &nbsp;V
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>Max MPPT Watts:</b>{" "}
                                        {formatThousandNumber(
                                          row.solutionDetail.inverter
                                            .maxMPPTWatts
                                        )}
                                        &nbsp;W
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>Max MPPT Amps:</b>{" "}
                                        {formatTwopointNumber(
                                          row.solutionDetail.inverter
                                            .maxMPPTAmps
                                        )}
                                        &nbsp;A
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>Operating Voltage Range:</b>{" "}
                                        {
                                          row.solutionDetail.inverter
                                            .pvOperatingVoltageRange
                                        }
                                        &nbsp;V
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("efficiency")}:</b>{" "}
                                        {row.solutionDetail.inverter.efficiency}
                                        &nbsp;%
                                      </li>
                                      {row.solutionDetail.inverter
                                        .documentations.length !== 0 && (
                                          <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                            <b>{t("documentations")}</b>{" "}
                                            {row.solutionDetail.inverter.documentations
                                              .slice()
                                              .sort((a, b) =>
                                                a.name.localeCompare(b.name)
                                              )
                                              .map((documentation, index) => (
                                                <React.Fragment key={index}>
                                                  <div
                                                    className="flex align-middle justify-between items-center p-1 border-1 border-b-gray-500"
                                                    key={index}
                                                  >
                                                    <div className="flex">
                                                      <i className="fa fa-file-pdf-o"></i>
                                                      <div className="ml-2">
                                                        <h6>
                                                          {documentation.name}
                                                        </h6>
                                                      </div>
                                                    </div>
                                                    <div className="float-right">
                                                      <button
                                                        className="mr-4 text-sm"
                                                        type="button"
                                                        data-toggle="modal"
                                                        data-target="#deviceDocPreviewModal"
                                                        onClick={() =>
                                                          onInputPreviewDocPath(
                                                            documentation.file
                                                          )
                                                        }
                                                      >
                                                        <span className="fa fa-eye" />
                                                      </button>
                                                    </div>
                                                  </div>
                                                  <hr />
                                                </React.Fragment>
                                              ))}
                                          </li>
                                        )}
                                    </ul>
                                  </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                  <AccordionSummary
                                    aria-controls="panel1d-content"
                                    id="panel1d-header"
                                  >
                                    <p className="text-sm pl-2">
                                      {t("panel_details")}
                                    </p>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <ul className="marker:text-green-300 list-disc space-x-3 m-0 p-2 pl-8">
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("brand")}:</b>{" "}
                                        {row.solutionDetail.panel.brand}
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("model_number")}:</b>{" "}
                                        {row.solutionDetail.panel.modelNumber}
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("qty")}:</b>{" "}
                                        {row.solutionDetail.panelCount}
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>Watts:</b>{" "}
                                        {row.solutionDetail.panel.watts}&nbsp;W
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>VOC:</b>{" "}
                                        {row.solutionDetail.panel.voc}
                                        &nbsp;V
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>
                                          Amps(I
                                          <span className="text-[8px]">
                                            MPP
                                          </span>
                                          ):
                                        </b>{" "}
                                        {formatTwopointNumber(
                                          row.solutionDetail.panel.amps
                                        )}
                                        &nbsp;A
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("width")}:</b>{" "}
                                        {formatThousandNumber(
                                          row.solutionDetail.panel.width
                                        )}
                                        &nbsp;mm
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("height")}:</b>{" "}
                                        {formatThousandNumber(
                                          row.solutionDetail.panel.height
                                        )}
                                        &nbsp;mm
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("depth")}:</b>{" "}
                                        {formatThousandNumber(
                                          row.solutionDetail.panel.depth
                                        )}
                                        &nbsp;mm
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("weight")}:</b>{" "}
                                        {formatTwopointNumber(
                                          row.solutionDetail.panel.weight
                                        )}
                                        &nbsp;kg
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("frame_color")}:</b>{" "}
                                        {row.solutionDetail.panel.frameColor}
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("color")}:</b>{" "}
                                        {row.solutionDetail.panel.color}
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("connectors")}:</b>{" "}
                                        {row.solutionDetail.panel.connectors}
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("type")}:</b>{" "}
                                        {row.solutionDetail.panel.type}
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("technology")}:</b>{" "}
                                        {row.solutionDetail.panel.technology}
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("efficiency")}:</b>{" "}
                                        {row.solutionDetail.panel.efficiency}
                                        &nbsp;%
                                      </li>
                                      {row.solutionDetail.panel.documentations
                                        .length !== 0 && (
                                          <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                            <b>{t("documentations")}</b>{" "}
                                            {row.solutionDetail.panel.documentations
                                              .slice()
                                              .sort((a, b) =>
                                                a.name.localeCompare(b.name)
                                              )
                                              .map((documentation, index) => (
                                                <React.Fragment key={index}>
                                                  <div
                                                    className="flex align-middle justify-between items-center p-1 border-1 border-b-gray-500"
                                                    key={index}
                                                  >
                                                    <div className="flex">
                                                      <i className="fa fa-file-pdf-o"></i>
                                                      <div className="ml-2">
                                                        <h6>
                                                          {documentation.name}
                                                        </h6>
                                                      </div>
                                                    </div>
                                                    <div className="float-right">
                                                      <button
                                                        className="mr-4 text-sm"
                                                        type="button"
                                                        data-toggle="modal"
                                                        data-target="#deviceDocPreviewModal"
                                                        onClick={() =>
                                                          onInputPreviewDocPath(
                                                            documentation.file
                                                          )
                                                        }
                                                      >
                                                        <span className="fa fa-eye" />
                                                      </button>
                                                    </div>
                                                  </div>
                                                  <hr />
                                                </React.Fragment>
                                              ))}
                                          </li>
                                        )}
                                    </ul>
                                  </AccordionDetails>
                                </Accordion>
                                {row.solutionDetail.storage && <Accordion>
                                  <AccordionSummary
                                    aria-controls="panel1d-content"
                                    id="panel1d-header"
                                  >
                                    <p className="text-sm pl-2">
                                      {t("storage_details")}
                                    </p>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <ul className="marker:text-green-300 list-disc space-x-3 m-0 p-2 pl-4">
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("brand")}:</b>{" "}
                                        {row.solutionDetail.storage.brand}
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("model_number")}:</b>{" "}
                                        {row.solutionDetail.storage.modelNumber}
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("qty")}:</b>{" "}
                                        {row.solutionDetail.storageCount}
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>Watts:</b>{" "}
                                        {formatThousandNumber(
                                          row.solutionDetail.storage.watts
                                        )}
                                        &nbsp;Wh
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>Volts:</b>{" "}
                                        {row.solutionDetail.storage.volts}
                                        &nbsp;V
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>Amps:</b>{" "}
                                        {row.solutionDetail.storage.amps}&nbsp;A
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>Max Charging Voltage:</b>{" "}
                                        {formatTwopointNumber(
                                          row.solutionDetail.storage
                                            .maxChargingVoltage
                                        )}
                                        &nbsp;V
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>Float Charging Voltage:</b>{" "}
                                        {formatTwopointNumber(
                                          row.solutionDetail.storage
                                            .floatChargingVoltage
                                        )}
                                        &nbsp;V
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>Max Charge Amps:</b>{" "}
                                        {
                                          row.solutionDetail.storage
                                            .maxChargeAmps
                                        }
                                        &nbsp;A
                                      </li>
                                      <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                        <b>{t("weight")}:</b>{" "}
                                        {row.solutionDetail.storage.weight}
                                        &nbsp;kg
                                      </li>
                                      {row.solutionDetail.storage.documentations
                                        .length !== 0 && (
                                          <li className="text-xs font-medium hover:font-bold cursor-pointer mb-1 pl-1">
                                            <b>{t("documentations")}</b>{" "}
                                            {row.solutionDetail.storage.documentations
                                              .slice()
                                              .sort((a, b) =>
                                                a.name.localeCompare(b.name)
                                              )
                                              .map((documentation, index) => (
                                                <React.Fragment key={index}>
                                                  <div
                                                    className="flex align-middle justify-between items-center p-1 border-1 border-b-gray-500"
                                                    key={index}
                                                  >
                                                    <div className="flex">
                                                      <i className="fa fa-file-pdf-o"></i>
                                                      <div className="ml-2">
                                                        <h6>
                                                          {documentation.name}
                                                        </h6>
                                                      </div>
                                                    </div>
                                                    <div className="float-right">
                                                      <button
                                                        className="mr-4 text-sm"
                                                        type="button"
                                                        data-toggle="modal"
                                                        data-target="#deviceDocPreviewModal"
                                                        onClick={() =>
                                                          onInputPreviewDocPath(
                                                            documentation.file
                                                          )
                                                        }
                                                      >
                                                        <span className="fa fa-eye" />
                                                      </button>
                                                    </div>
                                                  </div>
                                                  <hr />
                                                </React.Fragment>
                                              ))}
                                          </li>
                                        )}
                                    </ul>
                                  </AccordionDetails>
                                </Accordion>}
                              </div>
                              {(priceInstall === false ||
                                priceInstall === null) && (
                                  <div className="mt-1 pl-4">
                                    <p>
                                      <span className="text-md text-black">{`€ ${formatNumber(
                                        row.equipmentPrice
                                      )}`}</span>
                                      &nbsp;<span>({t("equipment_price")})</span>
                                    </p>
                                  </div>
                                )}
                              {(priceInstall === true ||
                                priceInstall === null) && (
                                  <div className="mt-3 pl-4">
                                    <p>
                                      <span className="text-md text-black">{`€ ${formatNumber(
                                        row.price
                                      )}`}</span>
                                      &nbsp;
                                      <span>({t("price")})</span>
                                    </p>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="grid lg:grid-cols-6 grid-cols-1">
        <div className="col-start-2 col-end-4 content-center lg:block hidden">
          {data
            ? t("table_pagiation_label", {
              prepage: rowsPerPage * page,
              nextpage: rowsPerPage * (page + 1),
              pages: data.length,
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
            labelRowsPerPage={t("rows_per_page")}
          />
        </div>
      </div>
      <div
        className="modal fade"
        id="deviceDocPreviewModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              {/* <h4 className="modal-title" id="myModalLabel">
                Leave a note for rejected reason
              </h4> */}
            </div>
            <div className="modal-body">
              <iframe
                title="Solution Doc Preview"
                src={
                  docPreviewPath
                    ? `${process.env.REACT_APP_BACKEND_API}/api/uploads/${docPreviewPath}`
                    : ""
                }
                width="100%"
                height="600px"
              ></iframe>
            </div>
            <div className="modal-footer"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TablePaginationSort;
