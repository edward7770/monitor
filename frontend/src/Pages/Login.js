import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
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

  useEffect(() => {
    // logout();
    document.title = 'Prosumator | Login';

    const userStatus = localStorage.getItem('userStatus');
    if(userStatus && isShowToast === 0) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isShowToast = 1;
      toast.error(t('account_no_active_msg'));
    }

    if (location.state && location.state.from && isShowToast === 0) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isShowToast = 1;

      toast.error(t('user_no_logged_msg'));
    }

    if (location.state && location.state.successMessage && isShowToast === 0) {
      isShowToast = 1;
      toast.success(t("email_activate_resend_msg") + " " + location.state.changeEmail);
      navigate('/login', { replace: true });
    }
  }, [location.state, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginUser(email, password);
  }

  return (
    <div className="page-login">
      <main className="page-content shadow-none">
        <div className="page-inner">
          <div id="main-wrapper">
            <div className="row mt-28">
              {/* <div className="col-md-3 center"> */}
                <div className="login-box mx-auto w-3/4">
                  <a
                    href="/#"
                    className="logo-name text-lg text-center"
                  >
                    {t("login")}
                  </a>
                  <p className="text-center m-t-md">
                    {t("login_description")}
                  </p>
                  <form className="m-t-md pl-8 pr-8" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control"
                        placeholder={t("email")}
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control"
                        placeholder={t("password")}
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-success btn-block mb-4">
                      {t("login")}
                    </button>
                    {/* <p className="text-center m-t-xs text-sm">
                      Don't have an account?
                    </p> */}
                    <Link
                      to="/register"
                      className="btn btn-default btn-block m-t-md"
                    >
                      {t("register")}
                    </Link>
                    <a
                      href="/forgot"
                      className="display-block text-center m-t-md text-sm"
                    >
                      {t("forgot_password")}
                    </a>
                  </form>
                  {/* <p className="text-center m-t-xs text-sm">
                    2024 &copy; Prosumator.
                  </p> */}
                </div>
              </div>
            {/* </div> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
