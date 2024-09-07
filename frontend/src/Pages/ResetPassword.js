import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { t } = useTranslation();
  const urlParams = new URLSearchParams(window.location.search);
  const forgotParam = urlParams.get("forgot");
  const [password, setPassword] = useState("");
  const [passconfirm, setPassconfirm] = useState("");
  const { resetPassword } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = (e) => {
    e.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passconfirm) {
      console.log("password confirmation error.");
      return;
    }

    if (forgotParam === "") return;
    resetPassword(password, forgotParam);
  };

  useEffect(() => {
    document.title = "Monitor | Reset Password";
  }, []);

  return (
    <div className="authentication-background">
      <div className="container">
        <div className="row justify-content-center align-items-center authentication authentication-basic h-100">
          <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-6 col-sm-8 col-12">
            <div className="card custom-card my-4">
              <div className="card-body p-5">
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
                <p className="h5 mb-2 text-center mb-4">
                  {t("reset_psd_description")}
                </p>
                <form className="m-t-md" onSubmit={handleSubmit}>
                  <div className="row gy-3">
                    <div className="col-xl-12 mb-2">
                      <label
                        htmlFor="signin-password"
                        className="form-label text-default d-block"
                      >
                        {t("password")}
                      </label>
                      <div className="position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control form-control-lg"
                          placeholder={t("password")}
                          id="password"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          className="show-password-button text-muted"
                          onClick={(e) => togglePasswordVisibility(e)}
                          id="button-addon2"
                        >
                          <i className={showPassword ? "ri-eye-line align-middle" : "ri-eye-off-line align-middle"}></i>
                        </button>
                      </div>
                    </div>
                    <div className="col-xl-12 mb-2">
                      <label
                        htmlFor="signin-password"
                        className="form-label text-default d-block"
                      >
                        {t("password_confirm")}
                      </label>
                      <div className="position-relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="form-control form-control-lg"
                          placeholder={t("password_confirm")}
                          id="passconfirm"
                          name="passconfirm"
                          value={passconfirm}
                          onChange={(e) => setPassconfirm(e.target.value)}
                          required
                        />
                        <button
                          className="show-password-button text-muted"
                          onClick={(e) => toggleConfirmPasswordVisibility(e)}
                          id="button-addon2"
                        >
                          <i className={showConfirmPassword ? "ri-eye-line align-middle" : "ri-eye-off-line align-middle"}></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="d-grid mt-4">
                    <button
                      type="submit"
                      className="btn btn-lg btn-primary"
                    >
                      {t("change_password")}
                    </button>
                  </div>
                  <div className="text-center w-full mt-2">
                    <Link
                      to="/login"
                      className="btn btn-default btn-block m-t-md text-center w-full"
                    >
                      {t("back")}
                    </Link>
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

export default ResetPassword;
