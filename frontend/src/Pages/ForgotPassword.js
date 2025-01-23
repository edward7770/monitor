import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const { forgotPassword, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = regex.test(email);

    if (email === "") {
      toast.warning(t("change_email_confirm_msg"));
    } else if (!isValidEmail) {
      console.log(isValidEmail);
      toast.warning(t("check_email_validation_msg"));
    } else {
      await forgotPassword(email);
    }
  };

  useEffect(() => {
    document.title = "Monitor | Forgot Password";
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
                      src="../assets/images/brand-logos/logo.png"
                      alt="logo"
                      className="desktop-logo"
                    />
                    <img
                      src="../assets/images/brand-logos/logo.png"
                      alt="logo"
                      className="desktop-dark"
                    />
                  </a>
                </div>
                <p className="h5 mb-2 text-center">Forgot Password</p>
                <p className="mb-4 text-muted op-7 fw-normal text-center">
                  {t("reset_password_description")}
                </p>
                <form className="m-t-md" onSubmit={handleSubmit}>
                  <div className="row gy-3">
                    <div className="col-xl-12">
                      <label htmlhtmlFor="email" className="form-label text-default">
                        {t("email")}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder={t("email")}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className="d-grid mt-4">
                    <button
                      type="submit"
                      className="btn btn-lg btn-primary"
                      disabled={isLoading}
                    >
                      {t("submit")}
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

export default ForgotPassword;
