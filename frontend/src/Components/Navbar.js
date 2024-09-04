import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getUserAPI } from "../Services/AuthService";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

const Navbar = (props) => {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const location = useLocation();

  const { t, i18n } = useTranslation();

  const onChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const onClickNavbarItem = (event) => {
    event.preventDefault();
    var sidebar_menu = window.document.getElementById("sidebar_menu");
    // if (user) {
    if (sidebar_menu) {
      if (sidebar_menu.classList.contains("visible")) {
        sidebar_menu.classList.remove("visible");
      } else {
        sidebar_menu.classList.add("visible");
      }
    }
    // }
  };

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const defaultUser = JSON.parse(localStorage.getItem("user"));
      if (defaultUser) {
        const user = await getUserAPI(defaultUser.userId);
        if (user) {
          setUser(user);
        }
      }
    };

    fetchData();
  }, [location, i18n]);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <>
      <Helmet>{/* <script src="/assets/js/modern.min.js"></script> */}</Helmet>
      <div className="navbar">
        <div className="navbar-inner container">
          <div className="sidebar-pusher">
            <a
              href="/#"
              onClick={(e) => onClickNavbarItem(e)}
              className="waves-effect waves-button waves-classic push-sidebar"
            >
              <i className="fa fa-bars"></i>
            </a>
          </div>
          <div className="logo-box content-center">
            <Link to="/" className="logo-text">
              {/* <span>Techumanity</span> */}
              <img src={logo} alt="logo" width="100px" />
            </Link>
            <ul
              className="nav navbar-nav navbar-right responsive-navbar-content"
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                marginBottom: "25px",
                border: "none",
              }}
            >
              {isLoggedIn() ? (
                <>
                  {" "}
                  <li className="dropdown">
                    <a
                      href="/#"
                      onClick={(e) => e.preventDefault()}
                      className="dropdown-toggle waves-effect waves-button waves-classic"
                      style={{ padding: "10px 5px" }}
                      data-toggle="dropdown"
                    >
                      <span className="user-name">
                        {user && user.userName}
                        <i className="fa fa-angle-down"></i>
                      </span>
                      {/* <img
                        className="img-circle avatar"
                        src="/assets/images/avatar7.png"
                        width="40"
                        height="40"
                        alt=""
                      /> */}
                    </a>
                    <ul
                      className="dropdown-menu dropdown-list responsive-profile-dropdown"
                      role="menu"
                    >
                      {/* <li role="presentation">
                        <a href="calendar.html">
                          <i className="fa fa-calendar"></i>Calendar
                        </a>
                      </li> */}
                      {user && user.role === "Supplier" && (
                        <>
                          <li role="presentation">
                            <Link
                              to="/profile"
                              style={{ padding: "5px 15px 5px 25px" }}
                            >
                              <i className="fa fa-user"></i>Profile
                            </Link>
                          </li>
                          <li
                            role="presentation"
                            className="divider"
                            style={{ margin: "2px 0px" }}
                          ></li>
                        </>
                      )}
                      <li role="presentation">
                        <a
                          href="/#"
                          onClick={handleLogout}
                          style={{ padding: "5px 15px 5px 25px" }}
                        >
                          <i className="fa fa-sign-out m-r-xs"></i>Log out
                        </a>
                      </li>
                    </ul>
                  </li>
                  {/* <li>
                    <a
                      href="/#"
                      onClick={(e) => e.preventDefault()}
                      className="waves-effect waves-button waves-classic"
                      id="showRight"
                    >
                      <i className="fa fa-comments"></i>
                    </a>
                  </li> */}
                  <li className="dropdown">
                    <a
                      href="/#"
                      onClick={(e) => e.preventDefault()}
                      className="dropdown-toggle waves-effect waves-button waves-classic"
                      data-toggle="dropdown"
                    >
                      <i className="fa fa-globe"></i>
                    </a>
                    <ul
                      className="dropdown-menu dropdown-list theme-settings"
                      role="menu"
                      id="language_navbar_menu"
                    >
                      <li
                        className="li-group d-flex cursor-pointer"
                        onClick={() => onChangeLanguage("en")}
                      >
                        <img
                          src="./assets/images/flags/en-flag.png"
                          className="ml-2"
                          alt="en-flag"
                          style={{ height: "20px", width: "32px" }}
                        />
                        <span className="ml-4">English</span>
                      </li>
                      <li
                        className="li-group d-flex cursor-pointer"
                        onClick={() => onChangeLanguage("ro")}
                      >
                        <img
                          src="./assets/images/flags/ro-flag.png"
                          className="ml-2"
                          alt="ro-flag"
                          style={{ height: "20px", width: "32px" }}
                        />
                        <span className="ml-4">Romanian</span>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  {" "}
                  <li>
                    <a
                      href="/login"
                      className="waves-effect waves-button waves-classic show-search"
                    >
                      Login
                    </a>
                  </li>
                  <li>
                    <a
                      href="/register"
                      className="waves-effect waves-button waves-classic"
                      id="showRight"
                    >
                      Register
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* <div className="search-button">
          <a
            href="/#"
            className="waves-effect waves-button waves-classic show-search"
          >
            <i className="fa fa-search"></i>
          </a>
        </div> */}
          <div className="topmenu-outer">
            <div className="top-menu">
              <ul className="nav navbar-nav navbar-left">
                {/* <li>
                  <a
                    href="/#"
                    onClick={(e) => e.preventDefault()}
                    className="waves-effect waves-button waves-classic sidebar-toggle"
                  >
                    <i className="fa fa-bars"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="/#cd-nav"
                    className="waves-effect waves-button waves-classic cd-nav-trigger"
                  >
                    <i className="fa fa-diamond"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="/#"
                    onClick={(e) => e.preventDefault()}
                    className="waves-effect waves-button waves-classic toggle-fullscreen"
                  >
                    <i className="fa fa-expand"></i>
                  </a>
                </li>
                <li className="dropdown">
                  <a
                    href="/#"
                    onClick={(e) => e.preventDefault()}
                    className="dropdown-toggle waves-effect waves-button waves-classic"
                    data-toggle="dropdown"
                  >
                    <i className="fa fa-cogs"></i>
                  </a>
                  <ul
                    className="dropdown-menu dropdown-md dropdown-list theme-settings"
                    role="menu"
                  >
                    <li className="li-group">
                      <ul className="list-unstyled">
                        <li className="no-link" role="presentation">
                          Fixed Header
                          <div className="ios-switch pull-right switch-md">
                            <input
                              type="checkbox"
                              className="js-switch pull-right fixed-header-check"
                            />
                          </div>
                        </li>
                      </ul>
                    </li>
                    <li className="li-group">
                      <ul className="list-unstyled">
                        <li className="no-link" role="presentation">
                          Fixed Sidebar
                          <div className="ios-switch pull-right switch-md">
                            <input
                              type="checkbox"
                              className="js-switch pull-right fixed-sidebar-check"
                            />
                          </div>
                        </li>
                        <li className="no-link" role="presentation">
                          Toggle Sidebar
                          <div className="ios-switch pull-right switch-md">
                            <input
                              type="checkbox"
                              className="js-switch pull-right toggle-sidebar-check"
                            />
                          </div>
                        </li>
                        <li className="no-link" role="presentation">
                          Compact Menu
                          <div className="ios-switch pull-right switch-md">
                            <input
                              type="checkbox"
                              className="js-switch pull-right compact-menu-check"
                            />
                          </div>
                        </li>
                      </ul>
                    </li>
                    <li className="no-link">
                      <button className="btn btn-default reset-options">
                        Reset Options
                      </button>
                    </li>
                  </ul>
                </li> */}
                {/* <li className="dropdown">
                  <a
                    href="/#"
                    onClick={(e) => e.preventDefault()}
                    className="dropdown-toggle waves-effect waves-button waves-classic"
                    data-toggle="dropdown"
                  >
                    <i className="fa fa-globe"></i>
                  </a>
                  <ul
                    className="dropdown-menu dropdown-list theme-settings"
                    role="menu"
                  >
                    <li
                      className="li-group d-flex cursor-pointer"
                      onClick={() => onChangeLanguage("en")}
                    >
                      <img
                        src="./assets/images/flags/en-flag.png"
                        className="ml-2"
                        alt="en-flag"
                        style={{ height: "20px", width: "32px" }}
                      />
                      <span className="ml-4">English</span>
                    </li>
                    <li
                      className="li-group d-flex cursor-pointer"
                      onClick={() => onChangeLanguage("ro")}
                    >
                      <img
                        src="./assets/images/flags/ro-flag.png"
                        className="ml-2"
                        alt="ro-flag"
                        style={{ height: "20px", width: "32px" }}
                      />
                      <span className="ml-4">Romanian</span>
                    </li>
                  </ul>
                </li> */}
              </ul>
              <ul className="nav navbar-nav navbar-right">
                {isLoggedIn() ? (
                  <>
                    {" "}
                    {/* <li>
                      <a
                        href="/#"
                        onClick={(e) => e.preventDefault()}
                        className="waves-effect waves-button waves-classic show-search"
                      >
                        <i className="fa fa-search"></i>
                      </a>
                    </li> */}
                    {/* <li className="dropdown">
                      <a
                        href="/#"
                        onClick={(e) => e.preventDefault()}
                        className="dropdown-toggle waves-effect waves-button waves-classic"
                        data-toggle="dropdown"
                      >
                        <i className="fa fa-envelope"></i>
                        <span className="badge badge-success pull-right">
                          4
                        </span>
                      </a>
                      <ul
                        className="dropdown-menu title-caret dropdown-lg"
                        role="menu"
                      >
                        <li>
                          <p className="drop-title">
                            You have 4 new messages !
                          </p>
                        </li>
                        <li className="dropdown-menu-list slimscroll messages">
                          <ul className="list-unstyled">
                            <li>
                              <a href="/#" onClick={(e) => e.preventDefault()}>
                                <div className="msg-img">
                                  <div className="online on"></div>
                                  <img
                                    className="img-circle"
                                    src="/assets/images/avatar2.png"
                                    alt=""
                                  />
                                </div>
                                <p className="msg-name">Robin Bayhack</p>
                                <p className="msg-text">
                                  Hey ! I will get back to you shortly.
                                </p>
                                <p className="msg-time">3 minutes ago</p>
                              </a>
                            </li>
                            <li>
                              <a href="/#" onClick={(e) => e.preventDefault()}>
                                <div className="msg-img">
                                  <div className="online off"></div>
                                  <img
                                    className="img-circle"
                                    src="/assets/images/avatar5.png"
                                    alt=""
                                  />
                                </div>
                                <p className="msg-name">David Horwitz</p>
                                <p className="msg-text">
                                  Hi Alisha, the balance on that account is
                                  still unchanged!
                                </p>
                                <p className="msg-time">8 minutes ago</p>
                              </a>
                            </li>
                            <li>
                              <a href="/#" onClick={(e) => e.preventDefault()}>
                                <div className="msg-img">
                                  <div className="online off"></div>
                                  <img
                                    className="img-circle"
                                    src="/assets/images/avatar3.png"
                                    alt=""
                                  />
                                </div>
                                <p className="msg-name">Ferosa Limalia</p>
                                <p className="msg-text">
                                  I will be in by 9:30 !
                                </p>
                                <p className="msg-time">56 minutes ago</p>
                              </a>
                            </li>
                            <li>
                              <a href="/#" onClick={(e) => e.preventDefault()}>
                                <div className="msg-img">
                                  <div className="online on"></div>
                                  <img
                                    className="img-circle"
                                    src="/assets/images/avatar4.png"
                                    alt=""
                                  />
                                </div>
                                <p className="msg-name">Julius Idana</p>
                                <p className="msg-text">
                                  Account balance is R254,352.00 as at 7 August
                                  2023.
                                </p>
                                <p className="msg-time">2 hours ago</p>
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li className="drop-all">
                          <a
                            href="/#"
                            className="text-center"
                            onClick={(e) => e.preventDefault()}
                          >
                            All Messages
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="dropdown">
                      <a
                        href="/#"
                        onClick={(e) => e.preventDefault()}
                        className="dropdown-toggle waves-effect waves-button waves-classic"
                        data-toggle="dropdown"
                      >
                        <i className="fa fa-bell"></i>
                        <span className="badge badge-success pull-right">
                          3
                        </span>
                      </a>
                      <ul
                        className="dropdown-menu title-caret dropdown-lg"
                        role="menu"
                      >
                        <li>
                          <p className="drop-title">
                            You have 3 pending tasks !
                          </p>
                        </li>
                        <li className="dropdown-menu-list slimscroll tasks">
                          <ul className="list-unstyled">
                            <li>
                              <a href="/#" onClick={(e) => e.preventDefault()}>
                                <div className="task-icon badge badge-success">
                                  <i className="icon-call-out"></i>
                                </div>
                                <span className="badge badge-roundless badge-default pull-right">
                                  1min ago
                                </span>
                                <p className="task-details">
                                  New Accounts:
                                  <span className="badge badge-success pull-right">
                                    374
                                  </span>
                                </p>
                              </a>
                            </li>
                            <li>
                              <a href="/#" onClick={(e) => e.preventDefault()}>
                                <div className="task-icon badge badge-danger">
                                  <i className="icon-energy"></i>
                                </div>
                                <span className="badge badge-roundless badge-default pull-right">
                                  24min ago
                                </span>
                                <p className="task-details">
                                  Action needed:
                                  <span className="badge badge-danger pull-right">
                                    38
                                  </span>
                                </p>
                              </a>
                            </li>
                            <li>
                              <a href="/#" onClick={(e) => e.preventDefault()}>
                                <div className="task-icon badge badge-info">
                                  <i className="icon-bell"></i>
                                </div>
                                <span className="badge badge-roundless badge-default pull-right">
                                  1h ago
                                </span>
                                <p className="task-details">
                                  Messages:
                                  <span className="badge badge-info pull-right">
                                    5
                                  </span>
                                </p>
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li className="drop-all">
                          <a
                            href="/#"
                            className="text-center"
                            onClick={(e) => e.preventDefault()}
                          >
                            All Tasks
                          </a>
                        </li>
                      </ul>
                    </li> */}
                    {/* <li className="dropdown">
                      <Link
                        onClick={onHandleCompareSolutions}
                        className="dropdown-toggle waves-effect waves-button waves-classic"
                        data-toggle="dropdown"
                      >
                        <DifferenceIcon
                          style={{
                            width: "16px",
                            height: "16px",
                            marginTop: "-1px",
                          }}
                        />
                        <span className="badge badge-success pull-right">
                          {props.compareSolutions
                            ? props.compareSolutions.length
                            : 0}
                        </span>
                      </Link>
                    </li> */}
                    <li className="dropdown">
                      <a
                        href="/#"
                        onClick={(e) => e.preventDefault()}
                        className="dropdown-toggle waves-effect waves-button waves-classic"
                        style={{ padding: "20px 0px 20px 8px" }}
                        data-toggle="dropdown"
                      >
                        <span className="user-name">
                          {user && user.userName}
                          <i className="fa fa-angle-down"></i>
                        </span>
                        {/* <img
                          className="img-circle avatar"
                          src="/assets/images/avatar7.png"
                          width="40"
                          height="40"
                          alt=""
                        /> */}
                      </a>
                      <ul className="dropdown-menu dropdown-list" role="menu">
                        {/* <li role="presentation">
                          <a href="calendar.html">
                            <i className="fa fa-calendar"></i>Calendar
                          </a>
                        </li> */}

                        {/* <li role="presentation">
                          <a href="inbox.html">
                            <i className="fa fa-envelope"></i>Inbox
                            <span className="badge badge-success pull-right">
                              4
                            </span>
                          </a>
                        </li> */}
                        {user && user.role === "Supplier" && (
                          <>
                            <li role="presentation">
                              <Link
                                to="/profile"
                                style={{ padding: "5px 15px 5px 25px" }}
                              >
                                <i className="fa fa-user"></i>Profile
                              </Link>
                            </li>
                            <li
                              role="presentation"
                              className="divider"
                              style={{ margin: "2px 0px" }}
                            ></li>
                          </>
                        )}
                        <li role="presentation">
                          <a href="/#" onClick={handleLogout}>
                            <i className="fa fa-sign-out m-r-xs"></i>Log out
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="dropdown">
                      <a
                        href="/#"
                        onClick={(e) => e.preventDefault()}
                        className="dropdown-toggle waves-effect waves-button waves-classic"
                        data-toggle="dropdown"
                      >
                        <i className="fa fa-globe"></i>
                      </a>
                      <ul
                        className="dropdown-menu dropdown-list theme-settings"
                        role="menu"
                      >
                        <li
                          className="li-group d-flex cursor-pointer"
                          onClick={() => onChangeLanguage("en")}
                        >
                          <img
                            src="./assets/images/flags/en-flag.png"
                            className="ml-2"
                            alt="en-flag"
                            style={{ height: "20px", width: "32px" }}
                          />
                          <span className="ml-4">English</span>
                        </li>
                        <li
                          className="li-group d-flex cursor-pointer"
                          onClick={() => onChangeLanguage("ro")}
                        >
                          <img
                            src="./assets/images/flags/ro-flag.png"
                            className="ml-2"
                            alt="ro-flag"
                            style={{ height: "20px", width: "32px" }}
                          />
                          <span className="ml-4">Romanian</span>
                        </li>
                      </ul>
                    </li>
                    {/* <li>
                      <a
                        href="/#"
                        onClick={(e) => e.preventDefault()}
                        className="waves-effect waves-button waves-classic"
                        id="showRight"
                      >
                        <i className="fa fa-comments"></i>
                      </a>
                    </li> */}
                  </>
                ) : (
                  <>
                    {" "}
                    {/* <li className="dropdown">
                      <Link
                        onClick={onHandleCompareSolutions}
                        className="dropdown-toggle waves-effect waves-button waves-classic"
                        data-toggle="dropdown"
                      >
                        <DifferenceIcon
                          style={{
                            width: "16px",
                            height: "16px",
                            marginTop: "-1px",
                          }}
                        />
                        <span className="badge badge-success pull-right">
                          {props.compareSolutions
                            ? props.compareSolutions.length
                            : 0}
                        </span>
                      </Link>
                    </li> */}
                    <li>
                      <a
                        href="/login"
                        className="waves-effect waves-button waves-classic show-search"
                      >
                        Login
                      </a>
                    </li>
                    <li>
                      <a
                        href="/register"
                        className="waves-effect waves-button waves-classic"
                        id="showRight"
                      >
                        Register
                      </a>
                    </li>
                    <li className="dropdown">
                      <a
                        href="/#"
                        onClick={(e) => e.preventDefault()}
                        className="dropdown-toggle waves-effect waves-button waves-classic"
                        data-toggle="dropdown"
                      >
                        <i className="fa fa-globe"></i>
                      </a>
                      <ul
                        className="dropdown-menu dropdown-list theme-settings"
                        role="menu"
                      >
                        <li
                          className="li-group d-flex cursor-pointer"
                          onClick={() => onChangeLanguage("en")}
                        >
                          <img
                            src="./assets/images/flags/en-flag.png"
                            className="ml-2"
                            alt="en-flag"
                            style={{ height: "20px", width: "32px" }}
                          />
                          <span className="ml-4">English</span>
                        </li>
                        <li
                          className="li-group d-flex cursor-pointer"
                          onClick={() => onChangeLanguage("ro")}
                        >
                          <img
                            src="./assets/images/flags/ro-flag.png"
                            className="ml-2"
                            alt="ro-flag"
                            style={{ height: "20px", width: "32px" }}
                          />
                          <span className="ml-4">Romanian</span>
                        </li>
                      </ul>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
