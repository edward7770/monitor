import React, { useEffect } from "react";
import { confirmEmailAPI } from "../Services/AuthService";
// import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ConfirmEmail = () => {
  const { t } = useTranslation();
  // const navigate = useNavigate();

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
            userManagement: res.data.userManagement,
            balanceType: res.data.balanceType,
            balanceAmount: res.data.balanceAmount
          };
          localStorage.setItem("user", JSON.stringify(userObj));

          toast.success(t("email_activate_msg"));
          window.location.href = "/dashboard";
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
    document.title = "Monitor | Verify Email";
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
                <p className="h5 mb-2 text-center">
                  {t("verify_email_header")}
                </p>
                <p className="mb-4 text-muted op-7 fw-normal text-center">
                  {t("verify_email_description")}
                </p>
                <form className="m-t-md" onSubmit={handleSubmit}>
                  <button type="submit" className="btn btn-lg btn-primary w-full">
                    {t("verify")}
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

export default ConfirmEmail;
