import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useAuth();
  // const [isShowToast, setIsShowToast] = useState(0);
  const location = useLocation();
  let isShowToast = 0;

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    // logout();
    document.title = "Monitor | Login";

    const userStatus = localStorage.getItem("userStatus");
    if (userStatus && isShowToast === 0) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isShowToast = 1;
      toast.error(t("account_no_active_msg"));
    }

    if (location.state && location.state.from && isShowToast === 0) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isShowToast = 1;

      toast.error(t("user_no_logged_msg"));
    }

    if (location.state && location.state.successMessage && isShowToast === 0) {
      isShowToast = 1;
      toast.success(
        t("email_activate_resend_msg") + " " + location.state.changeEmail
      );
      navigate("/login", { replace: true });
    }
  }, [location.state, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginUser(email, password);
  };

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
                <p className="h5 mb-2 text-center">{t("login")}</p>
                <p className="mb-4 text-muted op-7 fw-normal text-center">
                  Welcome back !
                </p>
                <form className="m-t-md" onSubmit={handleSubmit}>
                  <div className="row gy-3">
                    <div className="col-xl-12">
                      <label htmlFor="email" className="form-label text-default">
                        {t("email")}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="email"
                        placeholder={t("email")}
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-xl-12 mb-2">
                      <label
                        htmlFor="signin-password"
                        className="form-label text-default d-block"
                      >
                        {t("password")}
                        <Link to="/forgot" className="float-end text-danger">
                          {t("forgot_password")}
                        </Link>
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
                  </div>
                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-lg btn-primary">
                      {t("login")}
                    </button>
                  </div>
                </form>
                <div className="text-center">
                  <p className="text-muted mt-3 mb-0">
                    Dont have an account?{" "}
                    <Link
                      to="/register"
                      className="btn btn-default btn-block text-blue-600 hover:text-blue-600"
                    >
                      <b>{t("register")}</b>
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

export default Login;
