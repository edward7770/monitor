import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const { forgotPassword, isLoading } = useAuth();
    
  const handleSubmit = async (e) => {
    e.preventDefault();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = regex.test(email);

    if (email === "") {
      toast.warning(t("change_email_confirm_msg"));
    } else if (!isValidEmail) {
      toast.warning(t("check_email_validation_msg")); 
    } else {
      await forgotPassword(email);
    }
  };

  useEffect(() => {
    document.title = 'Prosumator | Forgot Password';
  }, []);

  return (
    <div className="page-forgot">
      <main className="page-content shadow-none">
        <div className="page-inner">
          <div id="main-wrapper">
            <div className="row mt-32">
              <div className="col-md-3 center">
                <div className="login-box">
                  <a
                    href="/"
                    className="logo-name text-lg text-center"
                  >
                    Prosumator
                  </a>
                  <p className="text-center m-t-md">
                    {t("reset_password_description")}
                  </p>
                  <form className="m-t-md" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control"
                        placeholder={t("email")}
                        value={email}
                        onChange={(e) => {setEmail(e.target.value)}}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                      {t("submit")}
                    </button>
                    <Link
                      to="/login"
                      className="btn btn-default btn-block m-t-md"
                    >
                      {t("back")}
                    </Link>
                  </form>
                  {/* <p className="text-center m-t-xs text-sm">
                    2023 &copy; Techumanity.
                  </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
