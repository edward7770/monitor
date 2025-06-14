import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getUserAPI } from "../Services/AuthService";
import { useTranslation } from "react-i18next";
import { runMonitorActionAPI } from "../Services/MonitorService";
import { runImport187API, runImport193API } from "../Services/FormDataService";
import { downloadFilesAPI } from "../Services/DownloadFilesService";
import { extractFilesAPI } from "../Services/ExtractedFilesService";
import { toast } from "react-toastify";

const Sidebar = (props) => {
  const { t } = useTranslation();
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const wrapperRef = useRef(null);
  const [accountMenu, setAccountMenu] = useState(false);
  const [importMenu, setImportMenu] = useState(false);
  const [marketingMenu, setMarketingMenu] = useState(false);

  // const handleClick = (event) => {
  //   event.preventDefault();
  // };

  const clickMonitorActionBtn = async (e) => {
    e.preventDefault();
    await runMonitorActionAPI(userId)
      .then((res) => {
        toast.success("Monitor action run successfully!");
      })
      .catch((err) => {
        toast.success("Monitor action running was failed.!");
      });
  };

  const handleDownloadFiles = async (e) => {
    e.preventDefault();

    await downloadFilesAPI(userId)
      .then(res => {
        toast.success("Download Gazettes Files run successfully!")
      })
      .catch((err) => {
        toast.success("Download Gazettes Files running was failed.!");
      });
  }

  const handleExtractFiles = async (e) => {
    e.preventDefault();

    await extractFilesAPI(userId)
      .then(res => {
        toast.success("Extracting Gazettes Files run successfully!")
      })
      .catch((err) => {
        toast.success("Extract Gazettes Files running was failed.!");
      });
  }

  const clickImportEstate193 = async (e) => {
    e.preventDefault();

    await runImport193API({userId: userId, type: "J193"})
    .then((res) => {
      if(res) {
        toast.success("Importing J193 Form records started successfully!");
      }
    })
    .catch((err) => {
      toast.success("Import was failed!");
    });
  };

  const clickImportEstate187 = async (e) => {
    e.preventDefault();

    await runImport187API({userId: userId, type: "J187"})
    .then((res) => {
      if(res) {
        toast.success("Importing J187 Form records started successfully!");
      }
    })
    .catch((err) => {
      toast.success("Import was failed!");
    });

  };

  const onClickSidebarMenu = (e) => {
    e.preventDefault();
    setAccountMenu(!accountMenu);
  };

  const onClickSidebarImportMenu = (e) => {
    e.preventDefault();
    setImportMenu(!importMenu);
  };

  const onClickSidebarMarketingMenu = (e) => {
    e.preventDefault();
    setMarketingMenu(!marketingMenu);
  };

  useEffect(() => {
    const fetchData = async () => {
      const defaultUser = JSON.parse(localStorage.getItem("user"));
      if (defaultUser) {
        const user = await getUserAPI(defaultUser.userId);
        if (user) {
          setRole(user.role);
          setUserId(user.userId);
        }
      }
    };

    fetchData();
  }, [props.isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      var sidebar_menu = window.document.getElementById("sidebar_menu");
      if (
        !event.target.classList.contains("push-sidebar") &&
        !event.target.classList.contains("fa-bars")
      ) {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
          if (sidebar_menu.classList.contains("visible")) {
            sidebar_menu.classList.remove("visible");
          }
        }
      }
    };

    window.document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <aside
        className="app-sidebar sticky"
        id="sidebar"
        style={{ position: "fixed" }}
      >
        <div className="main-sidebar-header">
          <a href="/#" className="header-logo">
            <img
              src="../assets/images/brand-logos/logo1.png"
              alt="logo"
              className="desktop-logo"
            />
            <img
              src="../assets/images/brand-logos/toggle-dark.png"
              alt="logo"
              className="toggle-dark"
            />
            <img
              src="../assets/images/brand-logos/logo1.png"
              alt="logo"
              className="desktop-dark"
            />
            <img
              src="../assets/images/brand-logos/toggle-logo.png"
              alt="logo"
              className="toggle-logo"
            />
          </a>
        </div>

        <div className="main-sidebar" id="sidebar-scroll">
          <nav className="main-menu-container nav nav-pills flex-column sub-open">
            <div className="slide-left" id="slide-left">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#7b8191"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                {" "}
                <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>{" "}
              </svg>
            </div>
            <ul className="main-menu">
              <li className="slide">
                <Link to="/dashboard" className="side-menu__item">
                  <i className="bi bi-house side-menu__icon"></i>
                  <span className="side-menu__label">Dashboard</span>
                </Link>
              </li>
              <li className="slide">
                <Link to="/upload" className="side-menu__item">
                  <i className="bi bi-upload side-menu__icon"></i>
                  <span className="side-menu__label">Upload</span>
                </Link>
              </li>
              <li className="slide">
                <Link to="/history" className="side-menu__item">
                  <i className="bi bi-book side-menu__icon"></i>
                  <span className="side-menu__label">History</span>
                </Link>
              </li>
              {role && role === "Superadmin" && (
                <li className="slide">
                  <a
                    href="/#"
                    onClick={(e) => clickMonitorActionBtn(e)}
                    className="side-menu__item"
                  >
                    <i className="bi bi-pen side-menu__icon"></i>
                    <span className="side-menu__label">Run Monitor</span>
                  </a>
                </li>
              )}

              <li className={`slide has-sub ${accountMenu ? "open" : ""}`}>
                <a
                  href="/#"
                  onClick={(e) => onClickSidebarMenu(e)}
                  className="side-menu__item"
                >
                  <i className="bi bi-check-square side-menu__icon"></i>
                  <span className="side-menu__label">Accounts</span>
                  <i className="fe fe-chevron-right side-menu__angle"></i>
                </a>
                <ul className="slide-menu child1" style={{display: accountMenu ? 'block' : 'none'}}>
                  <li className="slide side-menu__label1">
                    <a href="/#" onClick={(e) => onClickSidebarMenu(e)}>
                      Accounts
                    </a>
                  </li>
                  <li className="slide">
                    <Link to="/transaction-history" className="side-menu__item">
                      Transaction History
                    </Link>
                  </li>
                  {role && role === "Superadmin" && (
                    <li className="slide">
                      <Link to="/capture-payment" className="side-menu__item">
                        Capture Payment
                      </Link>
                    </li>
                  )}
                  {role && role === "Superadmin" && (
                    <li className="slide">
                      <Link to="/credit-limit" className="side-menu__item">
                        Credit Limit
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
              {role && role === "Superadmin" && (
                <li className="slide">
                  <Link to="/search-logs" className="side-menu__item">
                    <i className="bi bi-search side-menu__icon"></i>
                    <span className="side-menu__label">Search Logs</span>
                  </Link>
                </li>
              )}
              {role && role !== "Superadmin" && (
                <li className="slide">
                  <Link to="/pricing-menu" className="side-menu__item">
                    <i className="bi bi-layout-text-window side-menu__icon"></i>
                    <span className="side-menu__label">Pricing</span>
                  </Link>
                </li>
              )}
              {role && role === "Superadmin" && (
                <li className="slide">
                  <Link to="/price-list" className="side-menu__item">
                    <i className="bi bi-layout-text-window side-menu__icon"></i>
                    <span className="side-menu__label">Price List</span>
                  </Link>
                </li>
              )}
              {role && role === "Superadmin" && (
                <li className={`slide has-sub ${importMenu ? "open" : ""}`}>
                  <a
                    href="/#"
                    onClick={(e) => onClickSidebarImportMenu(e)}
                    className="side-menu__item"
                  >
                    <i className="bi bi-arrow-down-square side-menu__icon"></i>
                    <span className="side-menu__label">Data</span>
                    <i className="fe fe-chevron-right side-menu__angle"></i>
                  </a>
                  <ul className="slide-menu child1" style={{display: importMenu ? 'block' : 'none'}}>
                    <li className="slide side-menu__label1">
                      <a href="/#" onClick={(e) => onClickSidebarImportMenu(e)}>
                        Import
                      </a>
                    </li>
                    <li className="slide">
                      <Link
                        to="/monitor-history"
                        className="side-menu__item"
                      >
                        Monitor History
                      </Link>
                    </li>
                    <li className="slide">
                      <Link
                        to="/#"
                        className="side-menu__item"
                        onClick={(e) => clickImportEstate193(e)}
                      >
                        Import Estate 193
                      </Link>
                    </li>
                    <li className="slide">
                      <Link
                        to="/#"
                        className="side-menu__item"
                        onClick={(e) => clickImportEstate187(e)}
                      >
                        Import Estate 187
                      </Link>
                    </li>
                    <li className="slide">
                      <Link
                        to="/import-history"
                        className="side-menu__item"
                      >
                        Import History
                      </Link>
                    </li>
                    <li className="slide">
                      <a
                        href="/#"
                        onClick={(e) => handleDownloadFiles(e)}
                        className="side-menu__item"
                      >
                        <span className="side-menu__label">Download Gazettes</span>
                      </a>
                    </li>
                    <li className="slide">
                      <Link
                        to="/download-history"
                        className="side-menu__item"
                      >
                        Download History
                      </Link>
                    </li>
                    <li className="slide">
                      <a
                        href="/#"
                        onClick={(e) => handleExtractFiles(e)}
                        className="side-menu__item"
                      >
                        <span className="side-menu__label">Extract Gazettes</span>
                      </a>
                    </li>
                    <li className="slide">
                      <Link
                        to="/extracted-history"
                        className="side-menu__item"
                      >
                        Extract History
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
              {role && role === "Superadmin" && (
                <li className={`slide has-sub ${marketingMenu ? "open" : ""}`}>
                  <a
                    href="/#"
                    onClick={(e) => onClickSidebarMarketingMenu(e)}
                    className="side-menu__item"
                  >
                    <i className="bi bi-envelope-paper side-menu__icon"></i>
                    <span className="side-menu__label">Marketing</span>
                    <i className="fe fe-chevron-right side-menu__angle"></i>
                  </a>
                  <ul className="slide-menu child1" style={{display: marketingMenu ? 'block' : 'none'}}>
                    <li className="slide">
                      <Link to="/new-campaign" className="side-menu__item">
                        New Campaign
                      </Link>
                    </li>
                    <li className="slide">
                      <Link to="/campaign-history" className="side-menu__item">
                        Campaign History
                      </Link>
                    </li>
                    <li className="slide">
                      <Link to="/prospects" className="side-menu__item">
                        Prospects
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
            <div className="slide-right" id="slide-right">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#7b8191"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                {" "}
                <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>{" "}
              </svg>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
