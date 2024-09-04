import React, { useEffect, useState, useRef } from "react";
// import { useAuth } from "../context/useAuth";
import {
  updateSupplierAPI,
  getSuppliersAPI,
} from "../Services/SupplierService";
import { supplierAddDocAPI } from "../Services/UploadService";
// import { previewAPI } from "../Services/UploadService";
// import CityDropDown from "../Components/CityDropdown";
// import ProvinceDropdown from "../Components/ProvinceDropdown";
import { useNavigate } from 'react-router';
import { Link } from "react-router-dom";
import SearchInputListDropdown from "../Components/SearchInputListDropdown";
import { getProvincesAPI } from "../Services/ProvinceService";
import { getDistrictsAPI } from "../Services/DistrictService";
import { resendEmailAPI } from "../Services/AuthService";
import { getUserAPI } from "../Services/AuthService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [supplierErrors, setSupplierErrors] = useState([]);
  const [isError, setIsError] = useState(false);

  const [supplierData, setSupplierData] = useState(null);

  const fileInputRef1 = useRef();
  const fileInputRef2 = useRef();
  const fileInputRef3 = useRef();

  const [docPreviewPath, setDocPreviewPath] = useState(null);

  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [searchProvinceInputVal, setSearchProvinceInputVal] = useState("");
  const [searchDistrictInputVal, setSearchDistrictInputVal] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [userId, setUserId] = useState(null);
  const [changeEmail, setChangeEmail] = useState("");
  const [isChangeSubmitLoading, setIsChangeSubmitLoading] = useState(false);

  const onChangeEmail = (e) => {
    setChangeEmail(e.target.value);
  };

  const handleChangeEmailSubmit = async (e) => {
    e.preventDefault();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = regex.test(changeEmail);

    if (changeEmail === "") {
      toast.warning(t("change_email_confirm_msg"));
    } else if (!isValidEmail) {
      toast.warning(t("email_validation_msg")); 
    } else {
      setIsChangeSubmitLoading(true);
      const queryParams = new URLSearchParams(window.location.search);
      if (queryParams) {
        await resendEmailAPI(userId, changeEmail)
          .then((res) => {
            // toast.success(t("email_activate_resend_msg") + " " + changeEmail);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', { state: { successMessage: 'email_activate_resend_msg', changeEmail: changeEmail } });
            if (res.data.status === 200) {
            }
          })
          .catch((err) => {
            if (err.response.data) {
              toast.warning(t(err.response.data.message, {email: changeEmail}));
            } else {
              toast.warning(t("email_activate_fail_msg"));
            }
          })
          .finally(() => {
            setIsChangeSubmitLoading(false);
          });
      }
    }
  };

  const onChangeSupplierData = async (e) => {
    setSupplierData({ ...supplierData, [e.target.name]: e.target.value });
  };

  const onChooseFile = (inputRef) => {
    inputRef.current.click();
  };

  const onInputPreviewDocPath = (path) => {
    setDocPreviewPath(path);
  };

  const onChangeSupplierProvinceName = (e) => {
    setSupplierData({ ...supplierData, addressLine4: e.target.value });
    setSearchProvinceInputVal(e.target.value);
  };

  const onSelectSupplierProvinceName = (option) => {
    setSupplierData({
      ...supplierData,
      addressLine4: option.name,
      addressLine3: "",
    });
    setSelectedProvinceId(option.id);
    setSearchProvinceInputVal("");

    // setSupplierData({ ...supplierData, addressLine3: ''});
    setSearchDistrictInputVal("");
  };

  const onChangeSupplierDistrictName = (e) => {
    setSupplierData({ ...supplierData, addressLine3: e.target.value });
    setSearchDistrictInputVal(e.target.value);
  };

  const onSelectSupplierDistrictName = (option) => {
    setSupplierData({ ...supplierData, addressLine3: option.name });
    setSearchDistrictInputVal("");
  };

  const handleFileChange = async (event, fileType) => {
    if (event.target.files && event.target.files.length > 0) {
      let docType = fileType.charAt(0).toLowerCase() + fileType.slice(1);
      const fileData = new FormData();
      fileData.append("file", event.target.files[0]);
      fileData.append("fileType", fileType);
      await supplierAddDocAPI(fileData)
        .then((res) => {
          toast.success(t("upload_doc_success_msg"));
          setSupplierData({
            ...supplierData,
            [docType]: res.data,
          });
        })
        .catch((err) => {
          toast.error(t(err.response.data));
        });
    }
  };

  const handleSupplierSubmit = async (e) => {
    e.preventDefault();
    if (
      !supplierData.name ||
      !supplierData.surname ||
      // !supplierData.phone ||
      !supplierData.mobile ||
      !supplierData.registrationNumber ||
      !supplierData.addressLine1 ||
      !supplierData.addressLine3 ||
      !supplierData.addressLine4 ||
      !supplierData.addressPostalCode ||
      !supplierData.companyRegistrationDoc ||
      !supplierData.tradeLicenceDoc ||
      !supplierData.governmentLicenceDoc
    ) {
      let tempErrors = [];
      Object.entries(supplierData).forEach(([key, value]) => {
        if (!value) {
          tempErrors.push(key);
        }
      });

      setIsError(true);
      setSupplierErrors(tempErrors);

      toast.error(t("check__required_fields_msg"));
    } else {
      setIsSubmitLoading(true);

      let formData = new FormData();
      Object.entries(supplierData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      let username = supplierData.name + " " + supplierData.surname;
      updateSupplierAPI(supplierData.id, formData)
        .then((res) => {
          setIsError(false);
          setSupplierErrors({});
          toast.success(
            t("supplier_profile_update_success_msg", { username: username })
          );
        })
        .catch((err) => {
          toast.warning(t(err.response.data));
        })
        .finally(() => {
          setIsSubmitLoading(false);
        });
    }
  };

  useEffect(() => {
    document.title = "Prosumator | Profile";

    const fetchData = async () => {
      const suppliers = await getSuppliersAPI();
      const defaultUser = JSON.parse(window.localStorage.getItem("user"));
      if(defaultUser) {
        const user = await getUserAPI(defaultUser.userId);
        if (suppliers && user) {
          const supplierId = suppliers
            .map((item) => item.userId)
            .indexOf(user.userId);
          if (supplierId !== -1) {
            if (!selectedProvinceId) {
              setSupplierData(suppliers[supplierId]);
            }
          }
  
          setChangeEmail(user.email);
          setUserId(user.userId);
        }
      }

      const getProvinces = await getProvincesAPI();
      if (getProvinces.length !== 0) {
        setProvinces(getProvinces);
      }

      if (selectedProvinceId !== null) {
        const getDistricts = await getDistrictsAPI(selectedProvinceId);
        if (getDistricts.length !== 0) {
          setDistricts(getDistricts);
        }
      }
    };

    fetchData();
  }, [selectedProvinceId, searchProvinceInputVal, searchDistrictInputVal]);

  return (
    <div className="page-inner">
      <div className="page-breadcrumb">
        <ol className="breadcrumb container">
          <li>
            <Link to="/dashboard">{t("dashboard")}</Link>
          </li>
        </ol>
      </div>
      <div className="page-title">
        <div className="container">
          <h3>{t("profile")}</h3>
        </div>
      </div>
      <div id="main-wrapper" className="container">
        <div className="grid">
          <div className="">
            <div className="w-full mx-auto">
              <div className="p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-center mb-4 text-lg">
                  {t("edit_profile")}
                </h2>
                <form className="m-t-md" onSubmit={handleChangeEmailSubmit}>
                      <div className="form-group">
                        <input
                          className="form-control"
                          onChange={onChangeEmail}
                          name="change_email"
                          value={changeEmail}
                          placeholder={t("email_address")}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-success btn-block"
                      >
                        {t("profile_change_email_btn")} {isChangeSubmitLoading && "..."}
                      </button>
                    </form>
                <form onSubmit={handleSupplierSubmit}>
                  <div className="row mt-8">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{t("name")}</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("name")}
                          name="name"
                          id="name"
                          value={supplierData ? supplierData.name : ""}
                          onChange={onChangeSupplierData}
                        />
                        {isError && supplierErrors.indexOf("name") > -1 && (
                          <span className="text-red-500">
                            {t("field_required")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{t("surname")}</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("surname")}
                          name="surname"
                          id="surname"
                          value={supplierData ? supplierData.surname : ""}
                          onChange={onChangeSupplierData}
                        />
                        {isError && supplierErrors.indexOf("surname") > -1 && (
                          <span className="text-red-500">
                            {t("field_required")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{t("company_name")}</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("company_name")}
                          name="companyName"
                          id="companyName"
                          value={supplierData ? supplierData.companyName : ""}
                          onChange={onChangeSupplierData}
                        />
                        {isError &&
                          supplierErrors.indexOf("companyName") > -1 && (
                            <span className="text-red-500">
                              {t("field_required")}
                            </span>
                          )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{t("company_registeration")}</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("company_registeration")}
                          name="registrationNumber"
                          id="registrationNumber"
                          value={
                            supplierData ? supplierData.registrationNumber : ""
                          }
                          onChange={onChangeSupplierData}
                        />
                        {isError &&
                          supplierErrors.indexOf("registrationNumber") > -1 && (
                            <span className="text-red-500">
                              {t("field_required")}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{t("contact_mobile")}</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("contact_mobile")}
                          name="mobile"
                          id="mobile"
                          value={supplierData ? supplierData.mobile : ""}
                          onChange={onChangeSupplierData}
                        />
                        {isError && supplierErrors.indexOf("mobile") > -1 && (
                          <span className="text-red-500">
                            {t("field_required")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{t("alternative_phone")}</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("alternative_phone")}
                          name="phone"
                          id="phone"
                          value={supplierData ? supplierData.phone : ""}
                          onChange={onChangeSupplierData}
                        />
                        {isError && supplierErrors.indexOf("phone") > -1 && (
                          <span className="text-red-500">
                            {t("field_required")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{t("address1")}</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("address1")}
                          name="addressLine1"
                          id="addressLine1"
                          value={supplierData ? supplierData.addressLine1 : ""}
                          onChange={onChangeSupplierData}
                        />
                        {isError &&
                          supplierErrors.indexOf("addressLine1") > -1 && (
                            <span className="text-red-500">
                              {t("field_required")}
                            </span>
                          )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>{t("address2")}</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("address2")}
                          name="addressLine2"
                          id="addressLine2"
                          value={
                            supplierData && supplierData.addressLine
                              ? supplierData.addressLine2
                              : ""
                          }
                          onChange={onChangeSupplierData}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row" style={{marginBottom: '15px'}}>
                    <div className="col-md-6">
                      <div className="form-group mb-0">
                        <SearchInputListDropdown
                          label={t("province")}
                          selectedVal={
                            supplierData ? supplierData.addressLine4 : ""
                          }
                          searchInputVal={searchProvinceInputVal}
                          handleChangeName={onChangeSupplierProvinceName}
                          handleOptionClick={onSelectSupplierProvinceName}
                          datas={provinces}
                          placeholder={t("province")}
                          optioncase=""
                        />
                        {isError &&
                          supplierErrors.indexOf("addressLine4") > -1 && (
                            <span className="text-red-500">
                              {t("field_required")}
                            </span>
                          )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-0">
                        <SearchInputListDropdown
                          label={t("city")}
                          selectedVal={
                            supplierData ? supplierData.addressLine3 : ""
                          }
                          searchInputVal={searchDistrictInputVal}
                          handleChangeName={onChangeSupplierDistrictName}
                          handleOptionClick={onSelectSupplierDistrictName}
                          datas={districts}
                          placeholder={t("city")}
                          optioncase=""
                        />
                        {isError &&
                          supplierErrors.indexOf("addressLine3") > -1 && (
                            <span className="text-red-500">
                              {t("field_required")}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>{t("postal_code")}</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("postal_code")}
                          name="addressPostalCode"
                          id="addressPostalCode"
                          value={
                            supplierData ? supplierData.addressPostalCode : ""
                          }
                          onChange={onChangeSupplierData}
                        />
                        {isError &&
                          supplierErrors.indexOf("addressPostalCode") > -1 && (
                            <span className="text-red-500">
                              {t("field_required")}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                  <hr />

                  <div className="flex align-middle justify-between bg-slate-100 p-2 shadow-md mb-2 hover:shadow-lg mt-8">
                    <div className="flex">
                      <i className="fa fa-file-pdf-o text-2xl"></i>
                      <div className="ml-4 mt-2">
                        <h6>{t("registered_company_doc_description")}</h6>
                      </div>
                    </div>
                    <div className="float-right">
                      {/* <i className="fa fa-close"></i> */}
                      <button
                        className="mt-2 mr-4"
                        type="button"
                        data-toggle="modal"
                        data-target="#supplierDocPreviewModal"
                        onClick={() =>
                          onInputPreviewDocPath(
                            supplierData.companyRegistrationDoc
                          )
                        }
                      >
                        <span className="fa fa-eye" />
                      </button>
                      <input
                        ref={fileInputRef1}
                        type="file"
                        name="companyRegistrationDoc"
                        onChange={(e) =>
                          handleFileChange(e, "CompanyRegistrationDoc")
                        }
                        accept=".doc, .docx, .pdf"
                        style={{ display: "none" }}
                      />
                      <button
                        className="mt-2 mr-4"
                        type="button"
                        onClick={() => onChooseFile(fileInputRef1)}
                      >
                        <span className="fa fa-upload" />
                      </button>
                    </div>
                  </div>
                  <div className="flex align-middle justify-between bg-slate-100 p-2 shadow-md mb-2 hover:shadow-lg">
                    <div className="flex">
                      <i className="fa fa-file-pdf-o text-2xl"></i>
                      <div className="ml-4 mt-2">
                        <h6>{t("company_trade_doc_description")}</h6>
                      </div>
                    </div>
                    <div className="float-right">
                      {/* <i className="fa fa-close"></i> */}
                      <button
                        className="mt-2 mr-4"
                        type="button"
                        data-toggle="modal"
                        data-target="#supplierDocPreviewModal"
                        onClick={() =>
                          onInputPreviewDocPath(supplierData.tradeLicenceDoc)
                        }
                      >
                        <span className="fa fa-eye" />
                      </button>
                      <input
                        ref={fileInputRef2}
                        type="file"
                        name="tradeLicenceDoc"
                        onChange={(e) => handleFileChange(e, "TradeLicenceDoc")}
                        accept=".doc, .docx, .pdf"
                        style={{ display: "none" }}
                      />
                      <button
                        className="mt-2 mr-4"
                        type="button"
                        onClick={() => onChooseFile(fileInputRef2)}
                      >
                        <span className="fa fa-upload" />
                      </button>
                    </div>
                  </div>
                  <div className="flex align-middle justify-between bg-slate-100 p-2 shadow-md mb-2 hover:shadow-lg">
                    <div className="flex">
                      <i className="fa fa-file-pdf-o text-2xl"></i>
                      <div className="ml-4 mt-2">
                        <h6>{t("company_government_doc_description")}</h6>
                      </div>
                    </div>
                    <div className="float-right">
                      <button
                        className="mt-2 mr-4"
                        type="button"
                        data-toggle="modal"
                        data-target="#supplierDocPreviewModal"
                        onClick={() =>
                          onInputPreviewDocPath(
                            supplierData.governmentLicenceDoc
                          )
                        }
                      >
                        <span className="fa fa-eye" />
                      </button>
                      <input
                        ref={fileInputRef3}
                        type="file"
                        name="governmentLicenceDoc"
                        onChange={(e) =>
                          handleFileChange(e, "GovernmentLicenceDoc")
                        }
                        accept=".doc, .docx, .pdf"
                        style={{ display: "none" }}
                      />
                      <button
                        className="mt-2 mr-4"
                        type="button"
                        onClick={() => onChooseFile(fileInputRef3)}
                      >
                        <span className="fa fa-upload" />
                      </button>
                    </div>
                  </div>
                  {/* <iframe src="http://localhost:5128/uploads/test.pdf" width="500px" height="500px"></iframe> */}
                  <button className="btn btn-success btn-block mt-12">
                    {t("submit")} {isSubmitLoading && "..."}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="supplierDocPreviewModal"
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
                title="Supplier Doc Preview"
                src={
                  docPreviewPath
                    ? `${process.env.REACT_APP_BACKEND_API}/uploads/${docPreviewPath}`
                    : ""
                }
                width="100%"
                height="600px"
              ></iframe>
            </div>
            <div className="modal-footer">
              {/* <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
                id="solution_rejected_modal_close_btn"
              >
                Close
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
