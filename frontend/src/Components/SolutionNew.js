import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import FormWizard from "./FormWizard";
import { useTranslation } from "react-i18next";

const SolutionNew = () => {
    const { t } = useTranslation();

    useEffect(() => {
        document.title = "Prosumator | New Solution";
        // fetch necessary datas from backend
        // solution, inverter, panel, storage
    }, []);

    return (
        <div className="page-inner">
            <div className="page-breadcrumb">
                <ol className="breadcrumb container">
                <li><Link to="/dashboard">{t("dashboard")}</Link></li>
                </ol>
            </div>
            <div className="page-title">
                <div className="container">
                    <h3>{t("new_solution_label")}</h3>
                </div>
            </div>
            <div id="main-wrapper" className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="panel panel-white">
                            <div className="panel-heading clearfix">
                                <h4 className="panel-title">{t("new_solution_label")}</h4>
                            </div>
                            <div className="panel-body">
                                <FormWizard optioncase = "addsolution"  selectedSolution = {null}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolutionNew;
