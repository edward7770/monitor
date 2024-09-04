import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { registerAPI } from "../../Services/AuthService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const NewAdmin = () => {
  const { t } = useTranslation();
  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    phone: "",
    mobile: "",
  });

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [adminErrors, setAdminErrors] = useState([]);
  const [isError, setIsError] = useState(false);

  const onChangeAdminData = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const onSubmitNewAdmin = async (e) => {
    e.preventDefault();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = regex.test(adminData.email);
    if (!adminData.email) {
      toast.error(t("check_email_msg"));
    } else if (!isValidEmail) {
      toast.error(t("check_email_validation_msg"));
    } else if (!adminData.password) {
      toast.error(t("check_password_msg"));
    } else if (
      !adminData.name ||
      !adminData.surname ||
      !adminData.phone ||
      !adminData.mobile
    ) {
      let tempErrors = [];
      Object.entries(adminData).forEach(([key, value]) => {
        if (!value) {
          tempErrors.push(key);
        }
      });

      setIsError(true);
      setAdminErrors(tempErrors);

      toast.error(t("check__required_fields_msg"));
    } else {
      setIsSubmitLoading(true);
      let username = adminData.name + " " + adminData.surname;
      await registerAPI(
        username,
        adminData.email,
        adminData.password,
        "Admin",
        adminData.phone
      )
        .then((res) => {
          if (res) {
            setIsError(false);
            setAdminErrors({});
            toast.success(t("admin_registeration_success_msg"));
          }
        })
        .catch((err) => {
          setIsSubmitLoading(false);
          if (typeof err.response.data === "string") {
            if(err.response.data === "That email already exists.") {
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
              if(err.response.data[0].description === "Passwords must be at least 8 characters."){
                toast.warning(t("password_valiation_limit_num_msg"));
              } else if(err.response.data[0].description === "Passwords must have at least one non alphanumeric character."){
                toast.warning(t("password_valiation_alpha_msg"));
              } else {
                toast.warning(err.response.data[0].description);
              }
            }
          }
        })
        .finally(() => {
          setIsSubmitLoading(false);
        });
    }
  };

  useEffect(() => {}, []);

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
          <h3>{t("admin_registeration_header")}</h3>
        </div>
      </div>
      <div id="main-wrapper" className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="panel panel-white">
              <div className="panel-heading clearfix">
                <h4 className="panel-title">{t("admin_registeration_label")}</h4>
              </div>
              <div className="panel-body">
                <form onSubmit={onSubmitNewAdmin}>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder={t("email")}
                      name="email"
                      id="email"
                      value={adminData.email}
                      onChange={onChangeAdminData}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control mb-8"
                      placeholder={t("password")}
                      name="password"
                      id="password"
                      value={adminData.password}
                      onChange={onChangeAdminData}
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
                          value={adminData.name}
                          onChange={onChangeAdminData}
                        />
                        {isError && adminErrors.indexOf("name") > -1 && (
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
                          value={adminData.surname}
                          onChange={onChangeAdminData}
                        />
                        {isError && adminErrors.indexOf("surname") > -1 && (
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
                          value={adminData.mobile}
                          onChange={onChangeAdminData}
                        />
                        {isError && adminErrors.indexOf("mobile") > -1 && (
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
                          value={adminData.phone}
                          onChange={onChangeAdminData}
                        />
                        {isError && adminErrors.indexOf("phone") > -1 && (
                          <span className="text-red-500">
                            {t("field_required")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-success btn-block m-t-xs">
                    {t("submit")} {isSubmitLoading && "..."}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAdmin;
