import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getUserAPI } from "../Services/AuthService";
import { useTranslation } from "react-i18next";

const Sidebar = (props) => {
  const { t } = useTranslation();
  const [activeList] = useState(null);
  const [role, setRole] = useState(null);
  const [userManagement, setUserManagement] = useState(null);

  const wrapperRef = useRef(null);

  const handleClick = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const fetchData = async () => {
      const defaultUser = JSON.parse(localStorage.getItem("user"));
      if (defaultUser) {
        const user = await getUserAPI(defaultUser.userId);
        if (user) {
          setUserManagement(user.userManagement);
          setRole(user.role);
        }
      }
    };

    fetchData();
  },[props.isLoggedIn]);

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
      {props.isLoggedIn ? (
        <div
          className="page-sidebar sidebar horizontal-bar h-full"
          id="sidebar_menu"
          ref={wrapperRef}
          // style={{ zIndex: 1200, position: "fixed", height: "100%" }}
        >
          {/* // <div style={{width: "100vw", height: "100vh", position: "fixed", background: "rgba(0, 0, 0, 0.5)", zIndex: "1000"}}> */}
          <div className="page-sidebar-inner">
            <ul className="menu accordion-menu">
              <li className="nav-heading">
                <span>Navigation</span>
              </li>
              <li
                className={
                  activeList === 0 ? "active" : ""
                } /* onClick={() => onActiveList(0)} */
              >
                <Link to="/dashboard">
                  <span className="menu-icon icon-speedometer"></span>
                  <p>{t("dashboard")}</p>
                </Link>
              </li>
              {userManagement && userManagement === true && (
                <li
                  className={
                    activeList === 2 ? "active droplink" : "droplink"
                  } /* onClick={() => onActiveList(2)} */
                >
                  <Link to="#" onClick={handleClick}>
                    <span className="menu-icon icon-user"></span>
                    <p>{t("user_manager")}</p>
                  </Link>
                  <ul className="sub-menu">
                    {role !== "Supplier" ? (
                      <li>
                        <Link to="/new-admin">{t("new_admin_user")}</Link>
                      </li>
                    ) : (
                      <li>
                        <Link to="/supplier-user">
                          {t("new_supplier_user")}
                        </Link>
                      </li>
                    )}

                    {/* <li>
                    <Link to="/new-supplier">New Supplier User</Link>
                  </li> */}
                    <li>
                      <Link to="/manage-users">{t("manage_users_label")}</Link>
                    </li>
                  </ul>
                </li>
              )}
              <li className="droplink menu-compare-button">
                {/* <Link
                  onClick={onHandleCompareSolutions}
                  className="dropdown-toggle waves-effect waves-button waves-classic"
                  data-toggle="dropdown"
                >
                  <DifferenceIcon
                    style={{
                      width: "18px",
                      height: "18px",
                      marginTop: "-5px",
                      marginLeft: "-2px",
                    }}
                  />
                  <span
                    className="badge badge-success pull-right"
                    style={{ marginTop: "-10px" }}
                  >
                    {props.compareSolutions ? props.compareSolutions.length : 0}
                  </span>
                </Link> */}
              </li>
            </ul>
          </div>
          {/* </div> */}
        </div>
      ) : (
        <div
          className="page-sidebar sidebar horizontal-bar h-full"
          id="sidebar_menu"
          ref={wrapperRef}
          // style={{ zIndex: 1200, position: "fixed", height: "100%" }}
        >
          <div className="page-sidebar-inner">
            <ul className="menu accordion-menu">
              <li className="nav-heading">
                <span>Navigation</span>
              </li>
              {/* <li className="droplink menu-compare-button">
                <Link
                  onClick={onHandleCompareSolutions}
                  className="dropdown-toggle waves-effect waves-button waves-classic"
                  data-toggle="dropdown"
                >
                  <DifferenceIcon
                    style={{
                      width: "18px",
                      height: "18px",
                      marginTop: "-5px",
                      marginLeft: "-2px",
                    }}
                  />
                  <span
                    className="badge badge-success pull-right"
                    style={{ marginTop: "-10px" }}
                  >
                    {props.compareSolutions ? props.compareSolutions.length : 0}
                  </span>
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
