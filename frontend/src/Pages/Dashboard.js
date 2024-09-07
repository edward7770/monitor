import React from "react";
import { useTranslation } from "react-i18next";

const Dashboard = (props) => {
  const { t } = useTranslation();

  return (
    <div className="page-inner">
      <div className="page-title">
        <div className="container">
          <h3>{t("dashboard")}</h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
