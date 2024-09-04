import React, { useEffect, useState, useRef } from "react";
// import { useAuth } from "../context/useAuth";
import { createSupplierAPI } from "../Services/SupplierService";
import { createClientAPI } from "../Services/ClientService";
import { getProvincesAPI } from "../Services/ProvinceService";
import { getDistrictsAPI } from "../Services/DistrictService";
import { registerAPI } from "../Services/AuthService";
// import CityDropDown from "../Components/CityDropdown";
// import ProvinceDropdown from "../Components/ProvinceDropdown";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import SearchInputListDropdown from "../Components/SearchInputListDropdown";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [username, setUsername] = useState("");
  // const { registerUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState("client");
  const [isOpen, setIsOpen] = useState(true);

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [clientErrors, setClientErrors] = useState([]);
  const [supplierErrors, setSupplierErrors] = useState([]);
  const [isError, setIsError] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [searchProvinceInputVal, setSearchProvinceInputVal] = useState("");
  // const [selectedProvinceName, setSelectedProvinceName] = useState("");
  // const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [searchDistrictInputVal, setSearchDistrictInputVal] = useState("");

  const [supplierData, setSupplierData] = useState({
    name: "",
    surname: "",
    companyName: "",
    registrationNumber: "",
    // contactName: "",
    contactEmail: "",
    phone: "",
    mobile: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    addressLine4: "",
    addressPostalCode: "",
    companyRegistrationDoc: null,
    tradeLicenceDoc: null,
    governmentLicenceDoc: null,
  });

  const [clientData, setClientData] = useState({
    name: "",
    surname: "",
    mobile: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    addressLine4: "",
    addressPostalCode: "",
  });

  const inputRef1 = useRef();
  const inputRef2 = useRef();
  const inputRef3 = useRef();

  const [companydocOpen, setCompanydocOpen] = useState(false);
  const [tradedocOpen, setTradedocOpen] = useState(false);
  const [governmentdocOpen, setGovernmentdocOpen] = useState(false);

  const onCheckUserRole = (role) => {
    // setUsername("");
    // setEmail("");
    // setPassword("");
    setIsOpen(true);
    setSelectedRole(role);
    setSelectedProvinceId(null);
    setSearchProvinceInputVal("");
    setSearchDistrictInputVal("");
  };

  // const onClickCreateButton = () => {
  //   if (!selectedRole) {
  //     toast.warning("Please choose above box");
  //   } else {
  //     setIsOpen(true);
  //   }
  // };

  const onChangeSupplierData = async (e) => {
    setSupplierData({ ...supplierData, [e.target.name]: e.target.value });
  };

  const onChangeClientData = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  //doc upload
  const onChangeCompanydocOpen = (e) => {
    setCompanydocOpen(!companydocOpen);
  };

  const onChangeTradedocOpen = (e) => {
    setTradedocOpen(!tradedocOpen);
  };

  const onChangeGovernmentdocOpen = (e) => {
    setGovernmentdocOpen(!governmentdocOpen);
  };

  // const onSelectSearchedCity = (role, selectedCity) => {
  //   if(role === "supplier") {
  //     setSupplierData({...supplierData, addressLine3: selectedCity.cityName, addressLine4: selectedCity.countryName});
  //   } else {
  //     setClientData({...clientData, addressLine3: selectedCity.cityName, addressLine4: selectedCity.countryName});
  //   }
  // }

  // const onSelectSearchedProvince = (role, selected) => {
  //   if(role === "supplier") {
  //     setSupplierData({...supplierData, addressLine4: selected.countryName});
  //   } else {
  //     setClientData({...clientData, addressLine4: selected.countryName});
  //   }
  // }
  const onChooseFile = (num) => {
    if(num === 1) {
      inputRef1.current.click();
    } else if(num === 2) {
      inputRef2.current.click();
    } else if(num === 3) {
      inputRef3.current.click();
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSupplierData({
        ...supplierData,
        [event.target.name]: event.target.files[0],
      });
    }
  };

  const onChangeClientProvinceName = (e) => {
    // setSelectedProvinceName(e.target.value);
    setClientData({ ...clientData, addressLine4: e.target.value });
    setSearchProvinceInputVal(e.target.value);
  };

  const onSelectClientProvinceName = (option) => {
    // setSelectedProvinceName(option.name);
    setClientData({
      ...clientData,
      addressLine4: option.name,
      addressLine3: "",
    });
    setSelectedProvinceId(option.id);
    setSearchProvinceInputVal("");

    setSearchDistrictInputVal("");
  };

  const onChangeClientDistrictName = (e) => {
    // setSelectedDistrictName(e.target.value);
    setClientData({ ...clientData, addressLine3: e.target.value });
    setSearchDistrictInputVal(e.target.value);
  };

  const onSelectClientDistrictName = (option) => {
    // setSelectedDistrictName(option.name);
    setClientData({ ...clientData, addressLine3: option.name });
    setSearchDistrictInputVal("");
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

  const handleSupplierSubmit = async (e) => {
    e.preventDefault();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = regex.test(email);
    if (!email) {
      toast.error(t("check_email_msg"));
    } else if (!isValidEmail) {
      toast.error(t("check_email_validation_msg"));
    } else if (!password) {
      toast.error(t("check_password_msg"));
    } else if (
      !supplierData.name ||
      !supplierData.surname ||
      // !supplierData.phone ||
      !supplierData.mobile ||
      !supplierData.registrationNumber ||
      !supplierData.addressLine1 ||
      !supplierData.addressLine3 ||
      !supplierData.addressLine4 ||
      !supplierData.addressPostalCode ||
      !companydocOpen ||
      !tradedocOpen ||
      !governmentdocOpen ||
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

      if (!companydocOpen || !supplierData.companyRegistrationDoc) {
        tempErrors.push("companydocOpen");
      }

      if (!tradedocOpen || !supplierData.tradeLicenceDoc) {
        tempErrors.push("tradedocOpen");
      }

      if (!governmentdocOpen || !supplierData.governmentLicenceDoc) {
        tempErrors.push("governmentdocOpen");
      }

      setIsError(true);
      setSupplierErrors(tempErrors);

      toast.error(t("check__required_fields_msg"));
    } else {
      setIsSubmitLoading(true);
      let username = supplierData.name + " " + supplierData.surname;
      let phone = "";
      if (selectedRole === "client") {
        phone = clientData.phone;
      } else {
        phone = supplierData.phone;
      }

      await registerAPI(username, email, password, selectedRole, phone)
        .then((res) => {
          if (res) {
            let formData = new FormData();
            Object.entries(supplierData).forEach(([key, value]) => {
              formData.append(key, value);
            });
            formData.append("contactEmail", email);
            formData.append("userId", res.data.userId);
            createSupplierAPI(formData)
              .then((res) => {
                // console.log("success");
                setIsError(false);
                setSupplierErrors({});
                toast.success(t("register_success_msg"));
              })
              .catch((err) => {
                toast.warning(err.response.data);
              })
              .finally(() => {
                setIsSubmitLoading(false);
              });
          }
        })
        .catch((err) => {
          setIsSubmitLoading(false);
          if (typeof err.response.data === "string") {
            if (err.response.data === "That email already exists.") {
              toast.warning(t("email_exists_msg"));
            } else {
              toast.warning(err.response.data);
            }
          } else {
            if (!Array.isArray(err.response.data)) {
              Object.entries(err.response.data.errors).forEach(
                ([key, value]) => {
                  toast.warning(value[0]);
                }
              );
            } else {
              if (
                err.response.data[0].description ===
                "Passwords must be at least 8 characters."
              ) {
                toast.warning(t("password_valiation_limit_num_msg"));
              } else if (
                err.response.data[0].description ===
                "Passwords must have at least one non alphanumeric character."
              ) {
                toast.warning(t("password_valiation_alpha_msg"));
              } else {
                toast.warning(err.response.data[0].description);
              }
            }
          }
        });
    }
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = regex.test(email);
    if (!isValidEmail) {
      toast.error(t("check_email_msg"));
    } else if (!email) {
      toast.error(t("check_email_validation_msg"));
    } else if (!password) {
      toast.error(t("check_password_msg"));
    } else if (
      !clientData.name ||
      !clientData.surname ||
      !clientData.mobile ||
      // !clientData.phone ||
      !clientData.addressLine1 ||
      !clientData.addressLine3 ||
      !clientData.addressLine4 ||
      !clientData.addressPostalCode
    ) {
      let tempErrors = [];
      Object.entries(clientData).forEach(([key, value]) => {
        if (!value) {
          tempErrors.push(key);
        }
      });
      setIsError(true);
      setClientErrors(tempErrors);

      toast.error(t("check__required_fields_msg"));
    } else {
      setIsSubmitLoading(true);
      let username = clientData.name + " " + clientData.surname;
      await registerAPI(username, email, password, selectedRole)
        .then((res) => {
          if (res) {
            createClientAPI({
              ...clientData,
              Email: email,
              userId: res.data.userId,
            })
              .then((res) => {
                // console.log("success");
                toast.success(t("register_success_msg"));
              })
              .catch((err) => {
                toast.warning(err.response.data);
              })
              .finally(() => {
                setIsSubmitLoading(false);
              });
          }
        })
        .catch((err) => {
          setIsSubmitLoading(false);
          if (typeof err.response.data === "string") {
            if (err.response.data === "That email already exists.") {
              toast.warning(t("email_exists_msg"));
            } else {
              toast.warning(err.response.data);
            }
          } else {
            if (!Array.isArray(err.response.data)) {
              Object.entries(err.response.data.errors).forEach(
                ([key, value]) => {
                  toast.warning(value[0]);
                }
              );
            } else {
              if (
                err.response.data[0].description ===
                "Passwords must be at least 8 characters."
              ) {
                toast.warning(t("password_valiation_limit_num_msg"));
              } else if (
                err.response.data[0].description ===
                "Passwords must have at least one non alphanumeric character."
              ) {
                toast.warning(t("password_valiation_alpha_msg"));
              } else {
                toast.warning(err.response.data[0].description);
              }
            }
          }
        });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
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
    // logout();
    document.title = "Prosumator | Register";
  }, [
    isOpen,
    searchProvinceInputVal,
    selectedProvinceId,
    searchDistrictInputVal,
  ]);

  return (
    <div className="page-register">
      <main className="page-content shadow-none">
        <div className="page-inner">
          <div id="main-wrapper">
            <div className="row">
              <div className="login-box mx-auto w-3/4">
                <h2 className="register-page-header text-center">
                  {t("register")}
                </h2>
                <p className="text-center m-t-md">
                  {t("register_description")}
                </p>
                <div className="p-8 py-4">
                  <div className="row">
                    <div className="col-md-6 mt-4">
                      <div
                        className={`shadow-md hover:shadow-lg rounded-lg py-8 text-center text-sm font-bold cursor-pointer hover: ${
                          selectedRole === "client"
                            ? "bg-[#1DB198] text-white"
                            : "bg-gray-50"
                        }`}
                        onClick={() => onCheckUserRole("client")}
                      >
                        {t("client")}
                      </div>
                    </div>
                    <div className="col-md-6 mt-4">
                      <div
                        className={`shadow-md hover:shadow-lg rounded-lg py-8 text-center text-sm font-bold cursor-pointer ${
                          selectedRole === "supplier"
                            ? "bg-[#1DB198] text-white"
                            : "bg-gray-50"
                        }`}
                        onClick={() => onCheckUserRole("supplier")}
                      >
                        {t("supplier")}
                      </div>
                    </div>
                  </div>
                  {/* {!isOpen && (
                      <div className="mt-8">
                        <button
                          className="btn btn-success btn-block"
                          onClick={onClickCreateButton}
                        >
                          Create an account
                        </button>
                      </div>
                    )} */}
                </div>
                {isOpen && selectedRole === "supplier" && (
                  <div className="p-8 bg-white rounded-lg shadow-lg">
                    <form onSubmit={handleSupplierSubmit}>
                      <h2 className="text-center mb-4 text-lg">
                        {t("register_form_header")}
                      </h2>
                      {/* <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            name="username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div> */}
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control"
                          placeholder={t("email")}
                          name="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          className="form-control mb-8"
                          placeholder={t("password")}
                          name="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <hr />
                      <div className="row mt-8">
                        <div className="col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("name")}
                              name="name"
                              id="name"
                              value={supplierData.name}
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
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("surname")}
                              name="surname"
                              id="surname"
                              value={supplierData.surname}
                              onChange={onChangeSupplierData}
                            />
                            {isError &&
                              supplierErrors.indexOf("surname") > -1 && (
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
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("company_name")}
                              name="companyName"
                              id="companyName"
                              value={supplierData.companyName}
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
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("company_registeration")}
                              name="registrationNumber"
                              id="registrationNumber"
                              value={supplierData.registrationNumber}
                              onChange={onChangeSupplierData}
                            />
                            {isError &&
                              supplierErrors.indexOf("registrationNumber") >
                                -1 && (
                                <span className="text-red-500">
                                  {t("field_required")}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                      {/* <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Contact Name"
                                name="contactName"
                                id="contactName"
                                value={supplierData.contactName}
                                onChange={onChangeSupplierData}
                              />
                              {(isError && supplierErrors.indexOf("contactName") > -1) && <span className="text-red-500">{t("field_required")}</span>}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Contact Email"
                                name="contactEmail"
                                id="contactEmail"
                                value={supplierData.contactEmail}
                                onChange={onChangeSupplierData}
                              />
                              {(isError && supplierErrors.indexOf("contactEmail") > -1) && <span className="text-red-500">{t("field_required")}</span>}
                            </div>
                          </div>
                        </div> */}
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("contact_mobile")}
                              name="mobile"
                              id="mobile"
                              value={supplierData.mobile}
                              onChange={onChangeSupplierData}
                            />
                            {isError &&
                              supplierErrors.indexOf("mobile") > -1 && (
                                <span className="text-red-500">
                                  {t("field_required")}
                                </span>
                              )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("alternative_phone")}
                              name="phone"
                              id="phone"
                              value={supplierData.phone}
                              onChange={onChangeSupplierData}
                            />
                            {/* {isError &&
                                supplierErrors.indexOf("phone") > -1 && (
                                  <span className="text-red-500">
                                    {t("field_required")}
                                  </span>
                                )} */}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("address1")}
                              name="addressLine1"
                              id="addressLine1"
                              value={supplierData.addressLine1}
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
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("address2")}
                              name="addressLine2"
                              id="addressLine2"
                              value={supplierData.addressLine2}
                              onChange={onChangeSupplierData}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div
                          className="col-md-6"
                          style={{ marginTop: "-20px" }}
                        >
                          <div className="form-group mb-[15px]">
                            {/* <input
                                type="text"
                                className="form-control"
                                placeholder={t("province")}
                                name="addressLine4"
                                id="addressLine4"
                                value={supplierData.addressLine4}
                                onChange={onChangeSupplierData}
                              /> */}
                            <SearchInputListDropdown
                              label=""
                              selectedVal={supplierData.addressLine4}
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
                          {/* <ProvinceDropdown role = "supplier" defaultselected = {supplierData.addressLine4} handleOptionClick = {onSelectSearchedProvince}  /> */}
                        </div>
                        <div
                          className="col-md-6"
                          style={{ marginTop: "-20px" }}
                        >
                          <div className="form-group mb-[15px]">
                            {/* <input
                                type="text"
                                className="form-control"
                                placeholder={t("city")}
                                name="addressLine3"
                                id="addressLine3"
                                value={supplierData.addressLine3}
                                onChange={onChangeSupplierData}
                              /> */}
                            <SearchInputListDropdown
                              label=""
                              selectedVal={supplierData.addressLine3}
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

                          {/* <CityDropDown role = "supplier" handleOptionClick = {onSelectSearchedCity}  /> */}
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("postal_code")}
                              name="addressPostalCode"
                              id="addressPostalCode"
                              value={supplierData.addressPostalCode}
                              onChange={onChangeSupplierData}
                            />
                            {isError &&
                              supplierErrors.indexOf("addressPostalCode") >
                                -1 && (
                                <span className="text-red-500">
                                  {t("field_required")}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div className="row mt-4">
                        <div className="col-md-12">
                          <div style={{ marginTop: 0 }}>
                            <label className="mb-0">
                              <input
                                type="checkbox"
                                checked={companydocOpen}
                                onChange={onChangeCompanydocOpen}
                              />{" "}
                              {t("registered_company_doc_header")}
                            </label>
                            {companydocOpen && (
                              <div>
                                <input
                                  ref={inputRef1}
                                  type="file"
                                  name="companyRegistrationDoc"
                                  onChange={handleFileChange}
                                  accept=".doc, .docx, .pdf"
                                  style={{ display: "none" }}
                                />
                                <button
                                  className="file-btn ml-4"
                                  type="button"
                                  onClick={() => onChooseFile(1)}
                                >
                                  <span className="fa fa-upload" />{" "}
                                  {t("registered_company_doc_description")}
                                  {supplierData &&
                                    supplierData.companyRegistrationDoc && (
                                      <>
                                        <span>
                                          &nbsp;-&nbsp;
                                          <b>
                                            {
                                              supplierData
                                                .companyRegistrationDoc.name
                                            }
                                          </b>
                                        </span>
                                      </>
                                    )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {isError &&
                        supplierErrors.indexOf("companydocOpen") > -1 && (
                          <span className="text-red-500">
                            {t("field_required")}
                          </span>
                        )}
                      <div className="row">
                        <div className="col-md-12">
                          <div style={{ marginTop: 0 }}>
                            <label className="mb-0">
                              <input
                                type="checkbox"
                                checked={tradedocOpen}
                                onChange={onChangeTradedocOpen}
                              />{" "}
                              {t("company_trade_doc_header")}
                            </label>
                            {tradedocOpen && (
                              <div>
                                <input
                                  ref={inputRef2}
                                  type="file"
                                  name="tradeLicenceDoc"
                                  onChange={handleFileChange}
                                  accept=".doc, .docx, .pdf"
                                  style={{ display: "none" }}
                                />
                                <button
                                  className="file-btn ml-4"
                                  type="button"
                                  onClick={() => onChooseFile(2)}
                                >
                                  <span className="fa fa-upload" />{" "}
                                  {t("company_trade_doc_description")}
                                  {supplierData &&
                                    supplierData.tradeLicenceDoc && (
                                      <>
                                        <span>
                                          &nbsp;-&nbsp;
                                          <b>
                                            {supplierData.tradeLicenceDoc.name}
                                          </b>
                                        </span>
                                      </>
                                    )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {isError &&
                        supplierErrors.indexOf("tradedocOpen") > -1 && (
                          <span className="text-red-500">
                            {t("field_required")}
                          </span>
                        )}
                      <div className="row">
                        <div className="col-md-12">
                          <div style={{ marginTop: 0 }}>
                            <label className="mb-0">
                              <input
                                type="checkbox"
                                checked={governmentdocOpen}
                                onChange={onChangeGovernmentdocOpen}
                              />{" "}
                              {t("company_government_doc_header")}
                            </label>
                            {governmentdocOpen && (
                              <div>
                                <input
                                  ref={inputRef3}
                                  type="file"
                                  name="governmentLicenceDoc"
                                  onChange={handleFileChange}
                                  accept=".doc, .docx, .pdf"
                                  style={{ display: "none" }}
                                />
                                <button
                                  className="file-btn ml-4"
                                  type="button"
                                  onClick={() => onChooseFile(3)}
                                >
                                  <span className="fa fa-upload" />
                                  {t("company_government_doc_description")}
                                  {supplierData &&
                                    supplierData.governmentLicenceDoc && (
                                      <>
                                        <span>
                                          &nbsp;-&nbsp;
                                          <b>
                                            {
                                              supplierData.governmentLicenceDoc
                                                .name
                                            }
                                          </b>
                                        </span>
                                      </>
                                    )}
                                  {/* <span className="fa fa-check ml-2" style={{color: 'green'}} /> */}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {isError &&
                        supplierErrors.indexOf("governmentdocOpen") > -1 && (
                          <span className="text-red-500">
                            {t("field_required")}
                          </span>
                        )}
                      {/* <label>
                        <input type="checkbox" /> Agree the terms and policy
                      </label> */}
                      <button className="btn btn-success btn-block m-t-xs">
                        {t("submit")} {isSubmitLoading && "..."}
                      </button>
                    </form>
                  </div>
                )}
                {isOpen && selectedRole === "client" && (
                  <div className="p-8 bg-white rounded-lg shadow-lg">
                    <form onSubmit={handleClientSubmit}>
                      <h2 className="text-center mb-4 text-lg">
                        {t("register_form_header")}
                      </h2>
                      {/* <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            name="username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div> */}
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control"
                          placeholder={t("email")}
                          name="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          className="form-control mb-8"
                          placeholder={t("password")}
                          name="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <hr />
                      <div className="row mt-8">
                        <div className="col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("name")}
                              name="name"
                              id="name"
                              value={clientData.name}
                              onChange={onChangeClientData}
                            />
                            {isError && clientErrors.indexOf("name") > -1 && (
                              <span className="text-red-500">
                                {t("field_required")}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("surname")}
                              name="surname"
                              id="surname"
                              value={clientData.surname}
                              onChange={onChangeClientData}
                            />
                            {isError &&
                              clientErrors.indexOf("surname") > -1 && (
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
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("mobile")}
                              name="mobile"
                              id="mobile"
                              value={clientData.mobile}
                              onChange={onChangeClientData}
                            />
                            {isError && clientErrors.indexOf("mobile") > -1 && (
                              <span className="text-red-500">
                                {t("field_required")}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("alternative_phone")}
                              name="phone"
                              id="phone"
                              value={clientData.phone}
                              onChange={onChangeClientData}
                            />
                            {/* {isError &&
                                clientErrors.indexOf("phone") > -1 && (
                                  <span className="text-red-500">
                                    {t("field_required")}
                                  </span>
                                )} */}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("address1")}
                              name="addressLine1"
                              id="addressLine1"
                              value={clientData.addressLine1}
                              onChange={onChangeClientData}
                            />
                            {isError &&
                              clientErrors.indexOf("addressLine1") > -1 && (
                                <span className="text-red-500">
                                  {t("field_required")}
                                </span>
                              )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("address2")}
                              name="addressLine2"
                              id="addressLine2"
                              value={clientData.addressLine2}
                              onChange={onChangeClientData}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div
                          className="col-md-6"
                          style={{ marginTop: "-20px" }}
                        >
                          <div className="form-group mb-[15px]">
                            {/* <input
                                type="text"
                                className="form-control"
                                placeholder={t("province")}
                                name="addressLine4"
                                id="addressLine4"
                                value={clientData.addressLine4}
                                onChange={onChangeClientData}
                              /> */}
                            <SearchInputListDropdown
                              label=""
                              selectedVal={clientData.addressLine4}
                              searchInputVal={searchProvinceInputVal}
                              handleChangeName={onChangeClientProvinceName}
                              handleOptionClick={onSelectClientProvinceName}
                              datas={provinces}
                              placeholder={t("province")}
                              optioncase=""
                            />
                            {isError &&
                              clientErrors.indexOf("addressLine4") > -1 && (
                                <span className="text-red-500">
                                  {t("field_required")}
                                </span>
                              )}
                          </div>
                          {/* <ProvinceDropdown role = "client" defaultselected = {clientData.addressLine4} handleOptionClick = {onSelectSearchedProvince}  /> */}
                        </div>
                        <div
                          className="col-md-6"
                          style={{ marginTop: "-20px" }}
                        >
                          <div className="form-group mb-[15px]">
                            {/* <input
                                type="text"
                                className="form-control"
                                placeholder={t("city")}
                                name="addressLine3"
                                id="addressLine3"
                                value={clientData.addressLine3}
                                onChange={onChangeClientData}
                              /> */}
                            <SearchInputListDropdown
                              label=""
                              selectedVal={clientData.addressLine3}
                              searchInputVal={searchDistrictInputVal}
                              handleChangeName={onChangeClientDistrictName}
                              handleOptionClick={onSelectClientDistrictName}
                              datas={districts}
                              placeholder={t("city")}
                              optioncase=""
                            />
                            {isError &&
                              clientErrors.indexOf("addressLine3") > -1 && (
                                <span className="text-red-500">
                                  {t("field_required")}
                                </span>
                              )}
                          </div>
                          {/* <CityDropDown role = "client" handleOptionClick = {onSelectSearchedCity}  /> */}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={t("postal_code")}
                              name="addressPostalCode"
                              id="addressPostalCode"
                              value={clientData.addressPostalCode}
                              onChange={onChangeClientData}
                            />
                            {isError &&
                              clientErrors.indexOf("addressPostalCode") >
                                -1 && (
                                <span className="text-red-500">
                                  {t("field_required")}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                      {/* <label>
                        <input type="checkbox"/> Agree the terms and policy
                      </label> */}
                      <button className="btn btn-success btn-block m-t-xs">
                        {t("submit")} {isSubmitLoading && "..."}
                      </button>
                    </form>
                  </div>
                )}
                <div className="px-8">
                  {/* <Link
                      to="/login"
                      // className="btn btn-default btn-block m-t-xs"
                      className="hover:underline"
                    >
                      <p className="text-center m-t-xs text-sm">
                        Already have an account?
                      </p>
                    </Link> */}
                  <div className="mt-8">
                    <Link to="/login">
                      <button className="btn btn-default btn-block">
                        {t("login")}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
