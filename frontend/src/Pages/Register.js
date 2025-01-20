import React, { useEffect, useState } from "react";
import { createSupplierAPI } from "../Services/SupplierService";
import { registerAPI, registerWithVoucherAPI } from "../Services/AuthService";
import { updateVoucherClickEventAPI } from "../Services/ProspectVoucherService";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

let isSetUpdateClickEvent = false;

const Register = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const voucherNumber = queryParams.get('voucherNumber') || '';

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const [supplierErrors, setSupplierErrors] = useState([]);
  const [isError, setIsError] = useState(false);

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
  });

  const onChangeSupplierData = async (e) => {
    setSupplierData({ ...supplierData, [e.target.name]: e.target.value });
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
      !supplierData.addressPostalCode
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
      let username = supplierData.name + " " + supplierData.surname;
      let phone = supplierData.phone;

      if(voucherNumber === '') {
        await registerAPI(username, email, password, "client", phone)
          .then((res) => {
            if (res) {
              let formData = new FormData();
              supplierData.contactEmail = email;
              Object.entries(supplierData).forEach(([key, value]) => {
                formData.append(key, value);
              });
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
                });
            }
          })
          .catch((err) => {
            if (typeof err.response.data === "string") {
              if (err.response.data === "That email already exists.") {
                toast.warning(t("email_exists_msg"));
              } else {
                toast.warning(err.response.data);
              }
            } else {
              if (!Array.isArray(err.response.data)) {
                // Object.entries(err.response.data.errors).forEach(
                //   ([key, value]) => {
                //     toast.warning(value[0]);
                //   }
                // );
                toast.warning("Register was failed!");
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
      } else {
        await registerWithVoucherAPI(username, email, password, "client", phone, voucherNumber)
          .then((res) => {
            if (res) {
              let formData = new FormData();
              supplierData.contactEmail = email;
              Object.entries(supplierData).forEach(([key, value]) => {
                formData.append(key, value);
              });
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
                });
            }
          })
          .catch((err) => {
            if (typeof err.response.data === "string") {
              if (err.response.data === "That email already exists.") {
                toast.warning(t("email_exists_msg"));
              } else {
                toast.warning(err.response.data);
              }
            } else {
              if (!Array.isArray(err.response.data)) {
                toast.warning("Register was failed!");
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
    }
  };

  useEffect(() => {
    document.title = "Moniter | Register";

    const updateVoucherClickEvent = async () => {
      if(voucherNumber !== '' && !isSetUpdateClickEvent) {
        await updateVoucherClickEventAPI(voucherNumber)
          .then(response => {
            isSetUpdateClickEvent = true;
            console.log('Click event updated:', response.data);
          })
          .catch(error => {
            console.error('Error updating click event:', error);
          });
      }
    }

    updateVoucherClickEvent();
  }, [voucherNumber]);

  return (
    <div className="authentication-background">
      <div className="container-lg">
        <div className="row justify-content-center align-items-center authentication authentication-basic h-100">
          <div className="col-xxl-7 col-xl-8 col-lg-8 col-md-8 col-sm-8 col-12">
            <div className="card custom-card my-4">
              <div className="card-body px-5 pt-5 pb-3">
                <div className="mb-3 d-flex justify-content-center">
                  <a href="/#">
                    <img
                      src="../assets/images/brand-logos/desktop-logo.png"
                      alt="logo"
                      className="desktop-logo"
                    />
                    <img
                      src="../assets/images/brand-logos/desktop-dark.png"
                      alt="logo"
                      className="desktop-dark"
                    />
                  </a>
                </div>
                <p className="h5 mb-2 text-center">Sign Up</p>
                <p className="mb-4 text-muted op-7 fw-normal text-center">
                  Welcome & Join us by creating a free account !
                </p>
                <form onSubmit={handleSupplierSubmit}>
                  <div className="row gy-3">
                    <div className="col-xl-12">
                      <label
                        htmlFor="email"
                        className="form-label text-default"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        id="email"
                        name="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="col-xl-12">
                      <label
                        htmlFor="password"
                        className="form-label text-default"
                      >
                        Password *
                      </label>
                      <div className="position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control form-control-lg"
                          id="password"
                          name="password"
                          placeholder="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          className="show-password-button text-muted"
                          onClick={(e) => togglePasswordVisibility(e)}
                          type="button"
                          id="button-addon2"
                        >
                          <i className={showPassword ? "ri-eye-line align-middle" : "ri-eye-off-line align-middle"}></i>
                        </button>
                      </div>
                    </div>
                    <hr className="pt-2 mt-6" />
                    <div className="col-xl-6 col-12">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="name"
                        name="name"
                        placeholder={t("name")}
                        value={supplierData.name}
                        onChange={onChangeSupplierData}
                      />
                      {isError && supplierErrors.indexOf("name") > -1 && (
                        <span className="text-red-500">
                          {t("field_required")}
                        </span>
                      )}
                    </div>
                    <div className="col-xl-6 col-12">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="surname"
                        id="surname"
                        value={supplierData.surname}
                        onChange={onChangeSupplierData}
                        placeholder={t("surname")}
                      />
                      {isError && supplierErrors.indexOf("surname") > -1 && (
                        <span className="text-red-500">
                          {t("field_required")}
                        </span>
                      )}
                    </div>
                    <div className="col-xl-6 col-12">
                      <input
                        type="text"
                        className="form-control form-control-lg"
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
                    <div className="col-xl-6 col-12">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder={t("company_registeration")}
                        name="registrationNumber"
                        id="registrationNumber"
                        value={supplierData.registrationNumber}
                        onChange={onChangeSupplierData}
                      />
                      {isError &&
                        supplierErrors.indexOf("registrationNumber") > -1 && (
                          <span className="text-red-500">
                            {t("field_required")}
                          </span>
                        )}
                    </div>
                    <div className="col-xl-6 col-12">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder={t("contact_mobile")}
                        name="mobile"
                        id="mobile"
                        value={supplierData.mobile}
                        onChange={onChangeSupplierData}
                      />
                      {isError && supplierErrors.indexOf("mobile") > -1 && (
                        <span className="text-red-500">
                          {t("field_required")}
                        </span>
                      )}
                    </div>
                    <div className="col-xl-6 col-12">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder={t("alternative_phone")}
                        name="phone"
                        id="phone"
                        value={supplierData.phone}
                        onChange={onChangeSupplierData}
                      />
                    </div>
                    <div className="col-xl-6 col-12">
                      <input
                        type="text"
                        className="form-control form-control-lg"
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
                    <div className="col-xl-6 col-12">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder={t("address2")}
                        name="addressLine2"
                        id="addressLine2"
                        value={supplierData.addressLine2}
                        onChange={onChangeSupplierData}
                      />
                    </div>
                    <div className="col-xl-6 col-12">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder={t("province")}
                        name="addressLine4"
                        id="addressLine4"
                        value={supplierData.addressLine4}
                        onChange={onChangeSupplierData}
                      />
                      {isError &&
                        supplierErrors.indexOf("addressLine4") > -1 && (
                          <span className="text-red-500">
                            {t("field_required")}
                          </span>
                        )}
                    </div>
                    <div className="col-xl-6 col-12">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder={t("city")}
                        name="addressLine3"
                        id="addressLine3"
                        value={supplierData.addressLine3}
                        onChange={onChangeSupplierData}
                      />
                      {isError &&
                        supplierErrors.indexOf("addressLine3") > -1 && (
                          <span className="text-red-500">
                            {t("field_required")}
                          </span>
                        )}
                    </div>
                    <div className="col-xl-12 col-12">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder={t("postal_code")}
                        name="addressPostalCode"
                        id="addressPostalCode"
                        value={supplierData.addressPostalCode}
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
                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-lg btn-primary">
                      Create Account
                    </button>
                  </div>
                </form>
                <div className="text-center">
                  <p className="text-muted mt-3 mb-0">
                    Already have an account?{" "}
                    <Link to="/login">
                      <button className="btn btn-default btn-block text-blue-600 hover:text-blue-600">
                        {t("login")}
                      </button>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
