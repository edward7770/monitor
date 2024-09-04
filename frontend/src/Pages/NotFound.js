import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = "Prosumator | Not Found";
  }, []);
  return (
    <div className="page-error">
      <main className="page-content shadow-none">
        <div className="page-inner">
          <div id="main-wrapper">
            <div className="row">
              <div className="col-md-4 center">
                <h1 className="text-xxl text-primary text-center">404</h1>
                <div className="details">
                  <h3>{t("wrong_page_description1")}</h3>
                  <p>
                    {t("wrong_page_description2")}. {t("return")}{" "}
                    <span className="fa fa-home fs-2">
                      <Link to="/">{t("home")}</Link>
                    </span>{" "}
                  </p>
                </div>
                {/* <form className="input-group">
                    <input type="text" className="form-control" placeholder="Search" />
                    <span className="input-group-btn">
                        <button className="btn btn-default"><i className="fa fa-search"></i></button>
                    </span>
                </form> */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
