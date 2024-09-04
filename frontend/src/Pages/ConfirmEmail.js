import React, { useEffect } from "react";
import { confirmEmailAPI } from "../Services/AuthService";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ConfirmEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams) {
      const token = queryParams.get("token").split(" ").join("+");
      const userId = queryParams.get("userId");
      const email = queryParams.get("email");

      await confirmEmailAPI(encodeURIComponent(token), userId, email)
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          const userObj = {
            username: res.data.userName,
            email: res.data.email,
            role: res.data.role,
            userId: res.data.userId,
            userManagement: res.data.userManagement
          };
          localStorage.setItem("user", JSON.stringify(userObj));

          toast.success(t("email_activate_msg"));
          navigate("/dashboard");
        })
        .catch((err) => {
          if (err.response.status === 401) {
            toast.warning(t("user_unauthorized"));
          } else {
            toast.warning(t(err.response.data.message));
          }
        });
    }
  };

  useEffect(() => {
    document.title = 'Prosumator | Verify Email';
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
                    {t("verify_email_header")}
                  </a>
                  <p className="text-center m-t-md">
                    {t("verify_email_description")}
                  </p>
                  <form className="m-t-md" onSubmit={handleSubmit}>
                    <button type="submit" className="btn btn-success btn-block">
                      {t("verify")}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmEmail;
