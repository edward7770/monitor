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
              toast.warning(t(err.response.data.message, {email: changeEmail}));
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
    document.title = 'Prosumator | Resend Email';
    const queryParams = new URLSearchParams(window.location.search);
    const email = queryParams.get("email");
    if (email) {
      setResendEmail(email);
    }
  }, []);

  return (
    <div className="page-forgot">
      <main className="page-content shadow-none">
        <div className="page-inner">
          <div id="main-wrapper">
            <div className="row mt-32">
              <div className="col-md-4 center">
                <div className="login-box">
                  <a
                    href="index.html"
                    className="logo-name text-lg text-center"
                  >
                    Prosumator
                  </a>
                  <p className="text-center m-t-md">
                    {t("resend_email_description1")}<br/>
                    {t("resend_email_description2")}
                  </p>
                  <form className="m-t-md" onSubmit={handleSubmit}>
                    <button type="submit" className="btn btn-success btn-block">
                      {t("resend_email_btn")} {resendEmail && resendEmail} {isSubmitLoading && "..."}
                    </button>
                  </form>
                  {!isChangeEmailOpen ? (
                    <button
                      type="submit"
                      className="btn btn-success btn-block mt-6"
                      onClick={onCollapseChangeEmail}
                    >
                      {t("change_email_btn")}
                    </button>
                  ) : (
                    <form className="m-t-md" onSubmit={handleChangeEmailSubmit}>
                      <div className="form-group">
                        <input
                          className="form-control"
                          onChange={onChangeEmail}
                          name="change_email"
                          value={changeEmail}
                          placeholder={t("email_address")}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-success btn-block"
                      >
                        {t("save_change_email_btn")} {isChangeSubmitLoading && "..."}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResendEmail;
