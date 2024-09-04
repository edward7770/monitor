import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { t } = useTranslation();
  const urlParams = new URLSearchParams(window.location.search);
  const forgotParam = urlParams.get('forgot');
  const [password, setPassword] = useState('');
  const [passconfirm, setPassconfirm] = useState('');
  const { resetPassword } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(password !== passconfirm) {
      console.log("password confirmation error.");
      return;
    }

    if(forgotParam === "") return;
    resetPassword(password, forgotParam);
  }

  useEffect(() => {
    document.title = 'Prosumator | Reset Password';
  },[]);

  return (
    <div className="page-login">
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
                    {t("reset_psd_description")}
                  </p>
                  <form className="m-t-md" onSubmit={handleSubmit}>
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
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control"
                        placeholder={t("password_confirm")}
                        id="passconfirm"
                        name="passconfirm"
                        value={passconfirm}
                        onChange={(e) => setPassconfirm(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-success btn-block">
                      {t("change_password")}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ResetPassword;