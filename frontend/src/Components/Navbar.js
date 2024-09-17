import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getUserAPI } from "../Services/AuthService";
import { Link } from "react-router-dom";
// import logo from "../assets/images/logo.png";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

const Navbar = (props) => {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const location = useLocation();

  const { t, i18n } = useTranslation();

  // const onChangeLanguage = (lang) => {
  //   i18n.changeLanguage(lang);
  // };

  // const { isLoggedIn } = useAuth();

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
      <header className="app-header">
        <div className="main-header-container container-fluid">
          <div className="header-content-left">
            <div className="header-element">
              <div className="horizontal-logo">
                <a href="/#" className="header-logo">
                  <img
                    src="../assets/images/brand-logos/desktop-logo.png"
                    alt="logo"
                    className="desktop-logo"
                  />
                  <img
                    src="../assets/images/brand-logos/toggle-logo.png"
                    alt="logo"
                    className="toggle-logo"
                  />
                  <img
                    src="../assets/images/brand-logos/desktop-dark.png"
                    alt="logo"
                    className="desktop-dark"
                  />
                  <img
                    src="../assets/images/brand-logos/toggle-dark.png"
                    alt="logo"
                    className="toggle-dark"
                  />
                </a>
              </div>
            </div>
            <div className="header-element mx-lg-0 mx-2">
              <a
                aria-label="Hide Sidebar"
                className="sidemenu-toggle header-link animated-arrow hor-toggle horizontal-navtoggle"
                data-bs-toggle="sidebar"
                href="javascript:void(0);"
              >
                <span></span>
              </a>
            </div>

            <div className="header-element header-search d-md-block d-none">
              <input
                type="text"
                className="header-search-bar form-control border-0 bg-body"
                placeholder="Search for Results..."
              />
              <a
                href="javascript:void(0);"
                className="header-search-icon border-0"
              >
                <i className="bi bi-search"></i>
              </a>
            </div>
            <div className="header-element ms-3 d-lg-block d-none my-auto">
              <div className="dropdown my-auto d-none">
                <a
                  href="javascript:void(0);"
                  className="btn bg-body header-dashboards-button text-start d-flex align-items-center justify-content-between"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                ></a>
                <ul className="dropdown-menu dashboard-dropdown" role="menu">
                  
                </ul>
              </div>
            </div>
          </div>

          <ul className="header-content-right">
            <li className="header-element d-md-none d-block">
              <a
                href="javascript:void(0);"
                className="header-link"
                data-bs-toggle="modal"
                data-bs-target="#header-responsive-search"
              >
                <i className="bi bi-search header-link-icon"></i>
              </a>
            </li>

            <li className="header-element country-selector">
              <a
                href="javascript:void(0);"
                className="header-link dropdown-toggle"
                data-bs-auto-close="outside"
                data-bs-toggle="dropdown"
              >
                <img
                  src="../assets/images/flags/us_flag.jpg"
                  alt="img"
                  className="rounded-circle"
                />
              </a>
              <ul
                className="main-header-dropdown dropdown-menu dropdown-menu-end"
                data-popper-placement="none"
              >
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="javascript:void(0);"
                  >
                    <span className="avatar avatar-xs lh-1 me-2">
                      <img src="../assets/images/flags/us_flag.jpg" alt="img" />
                    </span>
                    English
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="javascript:void(0);"
                  >
                    <span className="avatar avatar-xs lh-1 me-2">
                      <img
                        src="../assets/images/flags/spain_flag.jpg"
                        alt="img"
                      />
                    </span>
                    Spanish
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="javascript:void(0);"
                  >
                    <span className="avatar avatar-xs lh-1 me-2">
                      <img
                        src="../assets/images/flags/french_flag.jpg"
                        alt="img"
                      />
                    </span>
                    French
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="javascript:void(0);"
                  >
                    <span className="avatar avatar-xs lh-1 me-2">
                      <img
                        src="../assets/images/flags/germany_flag.jpg"
                        alt="img"
                      />
                    </span>
                    German
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="javascript:void(0);"
                  >
                    <span className="avatar avatar-xs lh-1 me-2">
                      <img
                        src="../assets/images/flags/italy_flag.jpg"
                        alt="img"
                      />
                    </span>
                    Italian
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="javascript:void(0);"
                  >
                    <span className="avatar avatar-xs lh-1 me-2">
                      <img
                        src="../assets/images/flags/russia_flag.jpg"
                        alt="img"
                      />
                    </span>
                    Russian
                  </a>
                </li>
              </ul>
            </li>

            <li className="header-element header-theme-mode">
              <a
                href="javascript:void(0);"
                className="header-link layout-setting"
              >
                <span className="light-layout">
                  <i className="bi bi-moon header-link-icon"></i>
                </span>
                <span className="dark-layout">
                  <i className="bi bi-brightness-high header-link-icon"></i>
                </span>
              </a>
            </li>

            <li className="header-element cart-dropdown">
              <a
                href="javascript:void(0);"
                className="header-link dropdown-toggle"
                data-bs-auto-close="outside"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-cart2 header-link-icon"></i>
                <span
                  className="badge bg-primary rounded-pill header-icon-badge"
                  id="cart-icon-badge"
                >
                  5
                </span>
              </a>
              <div
                className="main-header-dropdown dropdown-menu dropdown-menu-end"
                data-popper-placement="none"
              >
                <div className="p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0 fs-16">
                      Cart Items
                      <span
                        className="badge bg-success-transparent ms-1 fs-12 rounded-circle"
                        id="cart-data"
                      >
                        5
                      </span>
                    </p>
                    <span>
                      <span className="text-muted me-1">Total:</span>
                      <span className="text-primary fw-medium">$14,289</span>
                    </span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <ul
                  className="list-unstyled mb-0"
                  id="header-cart-items-scroll"
                >
                  <li className="dropdown-item">
                    <div className="d-flex align-items-start cart-dropdown-item">
                      <img
                        src="../assets/images/ecommerce/jpg/9.jpg"
                        alt="img"
                        className="avatar me-3"
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-start justify-content-between mb-0">
                          <div className="mb-0 fs-13 text-dark">
                            <a href="cart.html">Pink High Heel Sandals</a>
                          </div>
                          <div>
                            <span className="fw-medium mb-1">$499.00</span>
                            <a
                              href="javascript:void(0);"
                              className="header-cart-remove float-end dropdown-item-close"
                            >
                              <i className="ti ti-x"></i>
                            </a>
                          </div>
                        </div>
                        <div className="min-w-fit-content d-flex align-items-start justify-content-between">
                          <ul className="header-product-item d-flex">
                            <li>Quantity: 01</li>
                            <li>
                              <span className="badge bg-light text-default border">
                                In Stock
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="dropdown-item">
                    <div className="d-flex align-items-start cart-dropdown-item">
                      <img
                        src="../assets/images/ecommerce/jpg/10.jpg"
                        alt="img"
                        className="avatar me-3"
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-start justify-content-between mb-0">
                          <div className="mb-0 fs-13 text-dark">
                            <a href="cart.html">Blue Denim Jacket</a>
                          </div>
                          <div>
                            <span className="fw-medium mb-1">$129.79</span>
                            <a
                              href="javascript:void(0);"
                              className="header-cart-remove float-end dropdown-item-close"
                            >
                              <i className="ti ti-x"></i>
                            </a>
                          </div>
                        </div>
                        <div className="min-w-fit-content d-flex align-items-start justify-content-between">
                          <ul className="header-product-item">
                            <li>Quantity: 02</li>
                            <li>
                              <span className="badge bg-light text-default border">
                                In Stock
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="dropdown-item">
                    <div className="d-flex align-items-start cart-dropdown-item">
                      <img
                        src="../assets/images/ecommerce/jpg/13.jpg"
                        alt="img"
                        className="avatar me-3"
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-start justify-content-between mb-0">
                          <div className="mb-0 fs-13 text-dark">
                            <a href="cart.html">Yellow Backpack (24L)</a>
                          </div>
                          <div>
                            <span className="fw-medium mb-1">$99.99</span>
                            <a
                              href="javascript:void(0);"
                              className="header-cart-remove float-end dropdown-item-close"
                            >
                              <i className="ti ti-x"></i>
                            </a>
                          </div>
                        </div>
                        <div className="min-w-fit-content d-flex align-items-start justify-content-between">
                          <ul className="header-product-item d-flex">
                            <li>Quantity: 01</li>
                            <li>
                              <span className="badge bg-light text-default border">
                                In Stock
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="dropdown-item">
                    <div className="d-flex align-items-start cart-dropdown-item">
                      <img
                        src="../assets/images/ecommerce/jpg/16.jpg"
                        alt="img"
                        className="avatar me-3"
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-start justify-content-between mb-0">
                          <div className="mb-0 fs-13 text-dark">
                            <a href="cart.html">
                              Multi Color Dress for Girls (3Y - 4Y)
                            </a>
                          </div>
                          <div>
                            <span className="fw-medium mb-1">$1.499.00</span>
                            <a
                              href="javascript:void(0);"
                              className="header-cart-remove float-end dropdown-item-close"
                            >
                              <i className="ti ti-x"></i>
                            </a>
                          </div>
                        </div>
                        <div className="min-w-fit-content d-flex align-items-start justify-content-between">
                          <ul className="header-product-item d-flex">
                            <li>Quantity: 02</li>
                            <li>
                              <span className="badge bg-danger-transparent border">
                                Out Of Stock
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="dropdown-item">
                    <div className="d-flex align-items-start cart-dropdown-item">
                      <img
                        src="../assets/images/ecommerce/jpg/18.jpg"
                        alt="img"
                        className="avatar me-3"
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-start justify-content-between mb-0">
                          <div className="mb-0 fs-13 text-dark">
                            <a href="cart.html">Xavier Smart Watch</a>
                          </div>
                          <div>
                            <span className="fw-medium mb-1">$49.79</span>
                            <a
                              href="javascript:void(0);"
                              className="header-cart-remove float-end dropdown-item-close"
                            >
                              <i className="ti ti-x"></i>
                            </a>
                          </div>
                        </div>
                        <div className="d-flex align-items-start justify-content-between">
                          <ul className="header-product-item d-flex">
                            <li>Quantity: 03</li>
                            <li>
                              <span className="badge bg-light text-default border">
                                In Stock
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="p-3 empty-header-item border-top">
                  <div className="text-center">
                    <a
                      href="checkout.html"
                      className="link-primary text-decoration-underline"
                    >
                      Proceed to checkout
                    </a>
                  </div>
                </div>
                <div className="p-5 empty-item d-none">
                  <div className="text-center">
                    <span className="avatar avatar-xl avatar-rounded bg-primary-transparent">
                      <i className="ri-shopping-cart-2-line fs-2"></i>
                    </span>
                    <h6 className="fw-medium mb-1 mt-3">Your Cart is Empty</h6>
                    <span className="mb-3 fw-normal fs-13 d-block">
                      Add some items to make me happy :)
                    </span>
                    <a
                      href="products.html"
                      className="btn btn-primary btn-wave btn-sm m-1"
                      data-abc="true"
                    >
                      continue shopping{" "}
                      <i className="bi bi-arrow-right ms-1"></i>
                    </a>
                  </div>
                </div>
              </div>
            </li>

            <li className="header-element notifications-dropdown d-xl-block d-none">
              <a
                href="javascript:void(0);"
                className="header-link dropdown-toggle"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                id="messageDropdown"
                aria-expanded="false"
              >
                <i className="bi bi-bell header-link-icon"></i>
                <span className="header-icon-pulse bg-secondary rounded pulse pulse-secondary"></span>
              </a>
              <div
                className="main-header-dropdown dropdown-menu dropdown-menu-end"
                data-popper-placement="none"
              >
                <div className="p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="mb-0 fs-16">Notifications</p>
                    <span
                      className="badge bg-secondary-transparent"
                      id="notifiation-data"
                    >
                      5 Unread
                    </span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <ul
                  className="list-unstyled mb-0"
                  id="header-notification-scroll"
                >
                  <li className="dropdown-item">
                    <div className="d-flex align-items-center">
                      <div className="pe-2 lh-1">
                        <span className="avatar avatar-rounded">
                          <img src="../assets/images/faces/11.jpg" alt="" />
                        </span>
                      </div>
                      <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                        <div>
                          <p className="mb-0 fw-medium">
                            <a href="notifications.html">John Doe</a>
                          </p>
                          <span className="text-muted fw-normal fs-12 header-notification-text">
                            Hey there! What's up?
                          </span>
                        </div>
                        <div>
                          <a
                            href="javascript:void(0);"
                            className="min-w-fit-content text-muted me-1 dropdown-item-close1"
                          >
                            <i className="ti ti-x fs-16"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="dropdown-item">
                    <div className="d-flex align-items-center">
                      <div className="pe-2 lh-1">
                        <span className="avatar bg-secondary-transparent avatar-rounded">
                          <img src="../assets/images/faces/21.jpg" alt="" />
                        </span>
                      </div>
                      <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                        <div>
                          <p className="mb-0 fw-medium">
                            <a href="notifications.html">Customer Support</a>
                          </p>
                          <span className="text-muted fw-normal fs-12 header-notification-text">
                            Great job on resolving the issue! Thank you!
                          </span>
                        </div>
                        <div>
                          <a
                            href="javascript:void(0);"
                            className="min-w-fit-content text-muted me-1 dropdown-item-close1"
                          >
                            <i className="ti ti-x"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="dropdown-item">
                    <div className="d-flex align-items-center">
                      <div className="pe-2 lh-1">
                        <span className="avatar bg-pink-transparent avatar-rounded">
                          <img src="../assets/images/faces/20.jpg" alt="" />
                        </span>
                      </div>
                      <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                        <div>
                          <p className="mb-0 fw-medium">
                            <a href="notifications.html">
                              Digital Marketing Trends
                            </a>
                          </p>
                          <span className="text-muted fw-normal fs-12 header-notification-text">
                            Next Thursday at 2:30 PM
                          </span>
                        </div>
                        <div>
                          <a
                            href="javascript:void(0);"
                            className="min-w-fit-content text-muted me-1 dropdown-item-close1"
                          >
                            <i className="ti ti-x"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="dropdown-item">
                    <div className="d-flex align-items-center">
                      <div className="pe-2 lh-1">
                        <span className="avatar bg-danger-transparent avatar-rounded">
                          <i className="ti ti-circle-check fs-18"></i>
                        </span>
                      </div>
                      <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                        <div>
                          <p className="mb-0 fw-medium">
                            <a href="notifications.html">
                              Amount: $50.00 paid for the order
                            </a>
                          </p>
                          <span className="text-muted fw-normal fs-12 header-notification-text">
                            Transaction ID: 123456789
                          </span>
                        </div>
                        <div>
                          <a
                            href="javascript:void(0);"
                            className="min-w-fit-content text-muted me-1 dropdown-item-close1"
                          >
                            <i className="ti ti-x"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="dropdown-item">
                    <div className="d-flex align-items-center">
                      <div className="pe-2 lh-1">
                        <span className="avatar bg-success-transparent avatar-rounded">
                          <img src="../assets/images/faces/6.jpg" alt="" />
                        </span>
                      </div>
                      <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                        <div>
                          <p className="mb-0 fw-medium">
                            <a href="notifications.html">Samantha</a>
                          </p>
                          <span className="text-muted fw-normal fs-12 header-notification-text">
                            Would you like to connect?
                          </span>
                        </div>
                        <div>
                          <a
                            href="javascript:void(0);"
                            className="min-w-fit-content text-muted me-1 dropdown-item-close1"
                          >
                            <i className="ti ti-x"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="p-3 empty-header-item1 border-top">
                  <div className="text-center">
                    <a
                      href="notifications.html"
                      className="link-primary text-decoration-underline"
                    >
                      View All
                    </a>
                  </div>
                </div>
                <div className="p-5 empty-item1 d-none">
                  <div className="text-center">
                    <span className="avatar avatar-xl avatar-rounded bg-secondary-transparent">
                      <i className="ri-notification-off-line fs-2"></i>
                    </span>
                    <h6 className="fw-medium mt-3">No New Notifications</h6>
                  </div>
                </div>
              </div>
            </li>

            {/* <li className="header-element header-fullscreen">
              <a
                onclick="openFullscreen();"
                href="javascript:void(0);"
                className="header-link"
              >
                <i className="bi bi-fullscreen full-screen-open header-link-icon"></i>
                <i className="bi bi-fullscreen-exit full-screen-close header-link-icon d-none"></i>
              </a>
            </li> */}

            <li className="header-element">
              <a
                href="javascript:void(0);"
                className="header-link dropdown-toggle"
                id="mainHeaderProfile"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
              >
                <div className="d-flex align-items-center">
                  <div className="me-sm-2 me-0">
                    <img
                      src="../assets/images/faces/9.jpg"
                      alt="img"
                      className="avatar avatar-sm avatar-rounded"
                    />
                  </div>
                  <div className="d-xl-block d-none lh-1">
                    <span className="fw-medium lh-1">
                      {user && user.userName}
                    </span>
                  </div>
                </div>
              </a>
              <ul
                className="main-header-dropdown dropdown-menu pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end"
                aria-labelledby="mainHeaderProfile"
              >
                <li>
                  <Link
                    to="/profile"
                    className="dropdown-item d-flex align-items-center"
                  >
                    {" "}
                    <i className="bi bi-person fs-18 me-2 op-7"></i>Profile
                  </Link>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="mail.html"
                  >
                    <i className="bi bi-envelope fs-16 me-2 op-7"></i>Inbox{" "}
                    <span className="ms-auto badge bg-light border text-default">
                      19
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="to-do-list.html"
                  >
                    <i className="bi bi-check-square fs-16 me-2 op-7"></i>Task
                    Manager
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="mail-settings.html"
                  >
                    <i className="bi bi-gear fs-16 me-2 op-7"></i>Settings
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="chat.html"
                  >
                    <i className="bi bi-headset fs-18 me-2 op-7"></i>Support
                  </a>
                </li>
                <li>
                  <a
                    href="/#"
                    className="dropdown-item d-flex align-items-center"
                    onClick={(e) => handleLogout(e)}
                  >
                    <i className="bi bi-box-arrow-right fs-18 me-2 op-7"></i>Log
                    Out
                  </a>
                </li>
              </ul>
            </li>

            <li className="header-element">
              <a
                href="javascript:void(0);"
                className="header-link switcher-icon"
                data-bs-toggle="offcanvas"
                data-bs-target="#switcher-canvas"
              >
                <i className="bi bi-gear header-link-icon border-0"></i>
              </a>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};

export default Navbar;
