import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/useAuth";
import {
  updateSupplierAPI,
  getSuppliersAPI,
} from "../Services/SupplierService";
import { useNavigate } from "react-router";
// import { Link } from "react-router-dom";
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
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login", {
              state: {
                successMessage: "change_email_activate_send_msg",
                changeEmail: changeEmail,
              },
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          })
          .catch((err) => {
            if (err.response.data) {
              toast.warning(
                t(err.response.data.message, { email: changeEmail })
              );
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
    document.title = "Monitor | Profile";

    const fetchData = async () => {
      const suppliers = await getSuppliersAPI();
      const defaultUser = JSON.parse(window.localStorage.getItem("user"));
      if (defaultUser) {
        const user = await getUserAPI(defaultUser.userId);
        if (suppliers && user) {
          const supplierId = suppliers
            .map((item) => item.userId)
            .indexOf(user.userId);
          if (supplierId !== -1) {
            setSupplierData(suppliers[supplierId]);
          }

          setChangeEmail(user.email);
          setUserId(user.userId);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div class="container-fluid" id="profile">
      <div class="my-4 page-header-breadcrumb d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h1 class="page-title fw-medium fs-18 mb-2">Profile</h1>
          <div class="">
            <nav>
              <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item">
                  <a href="/#">Pages</a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  Profile
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div class="btn-list">
          {/* <button class="btn btn-primary-light btn-wave me-2">
            <i class="bx bx-crown align-middle"></i> Plan Upgrade
          </button>
          <button class="btn btn-secondary-light btn-wave me-0">
            <i class="ri-upload-cloud-line align-middle"></i> Export Report
          </button> */}
        </div>
      </div>
      <div class="row">
        <div class="col-xl-12">
          <div class="card custom-card">
            <div class="card-body">
              <div class="d-sm-flex flex-wrap align-items-top gap-5 p-2 border-bottom-0">
                <form
                  className="m-t-md w-full"
                  onSubmit={handleChangeEmailSubmit}
                >
                  <div className="row gy-3">
                    <div className="col-xl-12">
                      <label
                        htmlFor="email"
                        className="form-label text-default"
                      >
                        {t("email")}
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        onChange={onChangeEmail}
                        name="change_email"
                        value={changeEmail}
                        placeholder={t("email_address")}
                      />
                    </div>
                    <div className="d-grid mt-4">
                      <button
                        type="submit"
                        className="btn btn-lg btn-primary w-full"
                      >
                        {t("profile_change_email_btn")}{" "}
                        {isChangeSubmitLoading && "..."}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-12">
          <div class="card custom-card">
            <div class="card-body">
              <div class="d-sm-flex flex-wrap align-items-top gap-5 p-2 border-bottom-0">
                <form onSubmit={handleSupplierSubmit}>
                  <div className="row gy-3">
                    <div className="col-xl-6 col-12">
                      <label htmlFor="name" className="form-label text-default">
                        {t("name")}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="name"
                        name="name"
                        placeholder={t("name")}
                        value={supplierData ? supplierData.name : ""}
                        onChange={onChangeSupplierData}
                      />
                      {isError && supplierErrors.indexOf("name") > -1 && (
                        <span className="text-red-500">
                          {t("field_required")}
                        </span>
                      )}
                    </div>
                    <div className="col-xl-6 col-12">
                      <label
                        htmlFor="surname"
                        className="form-label text-default"
                      >
                        {t("surname")}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="surname"
                        id="surname"
                        value={supplierData ? supplierData.surname : ""}
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
                      <label
                        htmlFor="companyName"
                        className="form-label text-default"
                      >
                        {t("company_name")}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
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
                    <div className="col-xl-6 col-12">
                      <label
                        htmlFor="registrationNumber"
                        className="form-label text-default"
                      >
                        {t("company_registeration")}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
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
                    <div className="col-xl-6 col-12">
                      <label
                        htmlFor="mobile"
                        className="form-label text-default"
                      >
                        {t("contact_mobile")}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
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
                    <div className="col-xl-6 col-12">
                      <label
                        htmlFor="phone"
                        className="form-label text-default"
                      >
                        {t("alternative_phone")}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder={t("alternative_phone")}
                        name="phone"
                        id="phone"
                        value={
                          supplierData && supplierData.phone !== "null"
                            ? supplierData.phone
                            : ""
                        }
                        onChange={onChangeSupplierData}
                      />
                    </div>
                    <div className="col-xl-6 col-12">
                      <label
                        htmlFor="addressLine1"
                        className="form-label text-default"
                      >
                        {t("address1")}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
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
                    <div className="col-xl-6 col-12">
                      <label
                        htmlFor="addressLine2"
                        className="form-label text-default"
                      >
                        {t("address2")}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder={t("address2")}
                        name="addressLine2"
                        id="addressLine2"
                        value={
                          supplierData && supplierData.addressLine2 !== "null"
                            ? supplierData.addressLine2
                            : ""
                        }
                        onChange={onChangeSupplierData}
                      />
                    </div>
                    <div className="col-xl-6 col-12">
                      <label
                        htmlFor="addressLine4"
                        className="form-label text-default"
                      >
                        {t("province")}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder={t("province")}
                        name="addressLine4"
                        id="addressLine4"
                        value={
                          supplierData && supplierData.addressLine4
                            ? supplierData.addressLine4
                            : ""
                        }
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
                      <label
                        htmlFor="addressLine3"
                        className="form-label text-default"
                      >
                        {t("city")}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder={t("city")}
                        name="addressLine3"
                        id="addressLine3"
                        value={
                          supplierData && supplierData.addressLine3
                            ? supplierData.addressLine3
                            : ""
                        }
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
                      <label
                        htmlFor="addressPostalCode"
                        className="form-label text-default"
                      >
                        {t("postal_code")}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
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
                    <div className="d-grid mt-4">
                      <button className="btn btn-lg btn-primary" type="submit">
                        {t("submit")} {isSubmitLoading && "..."}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
