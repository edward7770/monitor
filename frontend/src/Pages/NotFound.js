import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = "Prosumator | Not Found";
  }, []);
  return (
    <div className="page error-bg">
      <div className="error-page">
        <div className="container">
          <div className="my-auto">
            <div className="row align-items-center justify-content-center h-100">
              <div className="col-xl-4">
                <p className="error-text mb-4 text-gradient">404</p>
                <p className="fs-3 fw-normal mb-3 text-fixed-white">
                  {t("wrong_page_description1")}
                </p>
                <p className="fs-15 text-fixed-white mb-5 op-8">
                  {t("wrong_page_description2")}
                </p>
                <Link to="/" className="btn btn-default btn-block text-white hover:text-white text-xl"><i className="ri-arrow-left-line align-middle me-1 d-inline-block"></i>{t("home")}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
