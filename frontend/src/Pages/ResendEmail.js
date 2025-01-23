import React, { useEffect, useState } from "react";
import { resendEmailAPI } from "../Services/AuthService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ResendEmail = () => {
  const { t } = useTranslation();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isChangeSubmitLoading, setIsChangeSubmitLoading] = useState(false);

  const [resendEmail, setResendEmail] = useState("");
  const [changeEmail, setChangeEmail] = useState("");
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams) {
      const userId = queryParams.get("userId");
      await resendEmailAPI(userId, resendEmail)
        .then((res) => {
          toast.success(t("email_activate_resend_msg") + " " + resendEmail);
          if (res.data.status === 200) {
          }
        })
        .catch((err) => {
          console.log(err.response.data);
          if (err.response.data) {
            toast.warning(t(err.response.data.message));
          } else {
            toast.warning(t("email_activate_fail_msg"));
          }
        })
        .finally(() => {
          setIsSubmitLoading(false);
        });
    }
  };

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
        const userId = queryParams.get("userId");
        await resendEmailAPI(userId, changeEmail)
          .then((res) => {
            toast.success(t("email_activate_resend_msg") + " " + changeEmail);
            if (res.data.status === 200) {
            }
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

  const onCollapseChangeEmail = () => {
    setIsChangeEmailOpen(true);
  };

  useEffect(() => {
    document.title = "Monitor | Resend Email";
    const queryParams = new URLSearchParams(window.location.search);
    const email = queryParams.get("email");
    if (email) {
      setResendEmail(email);
    }
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
                  {t("resend_email_description1")}
                </p>
                <p className="mb-4 text-muted op-7 fw-normal text-center">
                  {t("resend_email_description2")}
                </p>
                <form className="m-t-md" onSubmit={handleSubmit}>
                  <button type="submit" className="btn btn-lg btn-primary w-full">
                    {t("resend_email_btn")} {resendEmail && resendEmail}{" "}
                    {isSubmitLoading && "..."}
                  </button>
                </form>
                {!isChangeEmailOpen ? (
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary mt-6 w-full"
                    onClick={onCollapseChangeEmail}
                  >
                    {t("change_email_btn")}
                  </button>
                ) : (
                  <form className="mt-4" onSubmit={handleChangeEmailSubmit}>
                    <div className="row gy-3">
                      <div className="col-xl-12">
                        <label htmlFor="email" className="form-label text-default">
                          {t("email")}
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          onChange={onChangeEmail}
                          name="change_email"
                          value={changeEmail}
                          placeholder={t("email_address")}
                        />
                      </div>
                    </div>
                      <button type="submit" className="btn btn-lg btn-primary w-full mt-2">
                        {t("save_change_email_btn")}{" "}
                        {isChangeSubmitLoading && "..."}
                      </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResendEmail;
