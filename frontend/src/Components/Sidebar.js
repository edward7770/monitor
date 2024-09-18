import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getUserAPI } from "../Services/AuthService";
import { useTranslation } from "react-i18next";
import { runMonitorActionAPI } from "../Services/MonitorService";
import { toast } from "react-toastify";

const Sidebar = (props) => {
  const { t } = useTranslation();
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const wrapperRef = useRef(null);

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
              src="../assets/images/brand-logos/desktop-logo.png"
              alt="logo"
              className="desktop-logo"
            />
            <img
              src="../assets/images/brand-logos/toggle-dark.png"
              alt="logo"
              className="toggle-dark"
            />
            <img
              src="../assets/images/brand-logos/desktop-dark.png"
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

              <li className="slide has-sub">
                <a href="javascript:void(0);" className="side-menu__item">
                  <i className="bi bi-exclamation-triangle side-menu__icon"></i>
                  <span className="side-menu__label">Error</span>
                  <i className="fe fe-chevron-right side-menu__angle"></i>
                </a>
                <ul className="slide-menu child1">
                  <li className="slide side-menu__label1">
                    <a href="javascript:void(0)">Error</a>
                  </li>
                  <li className="slide">
                    <a href="401-error.html" className="side-menu__item">
                      401 - Error
                    </a>
                  </li>
                  <li className="slide">
                    <a href="404-error.html" className="side-menu__item">
                      404 - Error
                    </a>
                  </li>
                  <li className="slide">
                    <a href="500-error.html" className="side-menu__item">
                      500 - Error
                    </a>
                  </li>
                </ul>
              </li>
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
