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
      <aside className="app-sidebar sticky" id="sidebar" style={{position: 'fixed'}}>
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
              <li className="slide has-sub">
                <a href="javascript:void(0);" className="side-menu__item">
                  <i className="bi bi-house side-menu__icon"></i>
                  <span className="side-menu__label">Dashboards</span>
                  <i className="fe fe-chevron-right side-menu__angle"></i>
                </a>
                <ul className="slide-menu child1">
                  <li className="slide side-menu__label1">
                    <a href="javascript:void(0)">Dashboards</a>
                  </li>
                  <li className="slide">
                    <a href="/#" className="side-menu__item">
                      Sales
                    </a>
                  </li>
                  <li className="slide">
                    <a href="index-1.html" className="side-menu__item">
                      Analytics
                    </a>
                  </li>
                  <li className="slide">
                    <a href="index-2.html" className="side-menu__item">
                      Ecommerce
                    </a>
                  </li>
                  <li className="slide">
                    <a href="index-3.html" className="side-menu__item">
                      Crm
                    </a>
                  </li>
                  <li className="slide">
                    <a href="index-4.html" className="side-menu__item">
                      HRM
                    </a>
                  </li>
                  <li className="slide">
                    <a href="index-5.html" className="side-menu__item">
                      NFT
                    </a>
                  </li>
                  <li className="slide">
                    <a href="index-6.html" className="side-menu__item">
                      Crypto
                    </a>
                  </li>
                  <li className="slide">
                    <a href="index-7.html" className="side-menu__item">
                      Jobs
                    </a>
                  </li>
                  <li className="slide">
                    <a href="index-8.html" className="side-menu__item">
                      Projects
                    </a>
                  </li>
                  <li className="slide">
                    <a href="index-9.html" className="side-menu__item">
                      Courses
                    </a>
                  </li>
                  <li className="slide">
                    <a href="index-10.html" className="side-menu__item">
                      Stocks
                    </a>
                  </li>
                  <li className="slide">
                    <a href="index-11.html" className="side-menu__item">
                      Personal
                    </a>
                  </li>
                  <li className="slide">
                    <a href="index-12.html" className="side-menu__item">
                      Customer
                    </a>
                  </li>
                </ul>
              </li>

              <li className="slide has-sub">
                <a href="javascript:void(0);" className="side-menu__item">
                  <i className="bi bi-file-earmark side-menu__icon"></i>
                  <span className="side-menu__label">Pages</span>
                  <i className="fe fe-chevron-right side-menu__angle"></i>
                </a>
                <ul className="slide-menu child1 pages-ul">
                  <li className="slide side-menu__label1">
                    <a href="javascript:void(0)">Pages</a>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Blog
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a href="blog.html" className="side-menu__item">
                          Blog
                        </a>
                      </li>
                      <li className="slide">
                        <a href="blog-details.html" className="side-menu__item">
                          Blog Details
                        </a>
                      </li>
                      <li className="slide">
                        <a href="blog-create.html" className="side-menu__item">
                          Create Blog
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide">
                    <a href="chat.html" className="side-menu__item">
                      Chat
                    </a>
                  </li>
                  <li className="slide">
                    <a href="contacts.html" className="side-menu__item">
                      Contacts
                    </a>
                  </li>
                  <li className="slide">
                    <a href="contact-us.html" className="side-menu__item">
                      Contact Us
                    </a>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Ecommerce
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a href="add-products.html" className="side-menu__item">
                          Add Products
                        </a>
                      </li>
                      <li className="slide">
                        <a href="cart.html" className="side-menu__item">
                          Cart
                        </a>
                      </li>
                      <li className="slide">
                        <a href="checkout.html" className="side-menu__item">
                          Checkout
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="edit-products.html"
                          className="side-menu__item"
                        >
                          Edit Products
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="order-details.html"
                          className="side-menu__item"
                        >
                          Order Details
                        </a>
                      </li>
                      <li className="slide">
                        <a href="orders.html" className="side-menu__item">
                          Orders
                        </a>
                      </li>
                      <li className="slide">
                        <a href="products.html" className="side-menu__item">
                          Products
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="product-details.html"
                          className="side-menu__item"
                        >
                          Product Details
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="products-list.html"
                          className="side-menu__item"
                        >
                          Products List
                        </a>
                      </li>
                      <li className="slide">
                        <a href="wishlist.html" className="side-menu__item">
                          Wishlist
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Email
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a href="mail.html" className="side-menu__item">
                          Mail App
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="mail-settings.html"
                          className="side-menu__item"
                        >
                          Mail Settings
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide">
                    <a href="empty.html" className="side-menu__item">
                      Empty
                    </a>
                  </li>
                  <li className="slide">
                    <a href="faq's.html" className="side-menu__item">
                      FAQ's
                    </a>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      File Manager
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a href="file-manager.html" className="side-menu__item">
                          File Manager
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Invoice
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a
                          href="invoice-create.html"
                          className="side-menu__item"
                        >
                          Create Invoice
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="invoice-details.html"
                          className="side-menu__item"
                        >
                          Invoice Details
                        </a>
                      </li>
                      <li className="slide">
                        <a href="invoice-list.html" className="side-menu__item">
                          Invoice List
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide">
                    <a href="landing.html" className="side-menu__item">
                      Landing
                    </a>
                  </li>
                  <li className="slide">
                    <a href="landing-jobs.html" className="side-menu__item">
                      Jobs Landing
                    </a>
                  </li>
                  <li className="slide">
                    <a href="notifications.html" className="side-menu__item">
                      Notifications
                    </a>
                  </li>
                  <li className="slide">
                    <a href="pricing.html" className="side-menu__item">
                      Pricing
                    </a>
                  </li>
                  <li className="slide">
                    <a href="profile.html" className="side-menu__item">
                      Profile
                    </a>
                  </li>
                  <li className="slide">
                    <a href="reviews.html" className="side-menu__item">
                      Reviews
                    </a>
                  </li>
                  <li className="slide">
                    <a href="team.html" className="side-menu__item">
                      Team
                    </a>
                  </li>
                  <li className="slide">
                    <a href="terms_conditions.html" className="side-menu__item">
                      Terms & Conditions
                    </a>
                  </li>
                  <li className="slide">
                    <a href="timeline.html" className="side-menu__item">
                      Timeline
                    </a>
                  </li>
                  <li className="slide">
                    <a href="to-do-list.html" className="side-menu__item">
                      To Do List
                    </a>
                  </li>
                </ul>
              </li>
              <li className="slide has-sub">
                <a href="javascript:void(0);" className="side-menu__item">
                  <i className="bi bi-key side-menu__icon"></i>
                  <span className="side-menu__label">Authentication</span>
                  <i className="fe fe-chevron-right side-menu__angle"></i>
                </a>
                <ul className="slide-menu child1">
                  <li className="slide side-menu__label1">
                    <a href="javascript:void(0)">Authentication</a>
                  </li>
                  <li className="slide">
                    <a href="coming-soon.html" className="side-menu__item">
                      Coming Soon
                    </a>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Create Password
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a
                          href="create-password-basic.html"
                          className="side-menu__item"
                        >
                          Basic
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="create-password-cover.html"
                          className="side-menu__item"
                        >
                          Cover
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Lock Screen
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a
                          href="lockscreen-basic.html"
                          className="side-menu__item"
                        >
                          Basic
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="lockscreen-cover.html"
                          className="side-menu__item"
                        >
                          Cover
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Reset Password
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a
                          href="reset-password-basic.html"
                          className="side-menu__item"
                        >
                          Basic
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="reset-password-cover.html"
                          className="side-menu__item"
                        >
                          Cover
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Sign Up
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a
                          href="sign-up-basic.html"
                          className="side-menu__item"
                        >
                          Basic
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="sign-up-cover.html"
                          className="side-menu__item"
                        >
                          Cover
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Sign In
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a
                          href="sign-in-basic.html"
                          className="side-menu__item"
                        >
                          Basic
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="sign-in-cover.html"
                          className="side-menu__item"
                        >
                          Cover
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Two Step Verification
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a
                          href="two-step-verification-basic.html"
                          className="side-menu__item"
                        >
                          Basic
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="two-step-verification-cover.html"
                          className="side-menu__item"
                        >
                          Cover
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide">
                    <a
                      href="under-maintenance.html"
                      className="side-menu__item"
                    >
                      Under Maintenance
                    </a>
                  </li>
                </ul>
              </li>

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
              <li className="slide has-sub">
                <a href="javascript:void(0);" className="side-menu__item">
                  <i className="bi bi-grid side-menu__icon"></i>
                  <span className="side-menu__label">Apps</span>
                  <i className="fe fe-chevron-right side-menu__angle"></i>
                </a>
                <ul className="slide-menu child1">
                  <li className="slide side-menu__label1">
                    <a href="javascript:void(0)">Apps</a>
                  </li>
                  <li className="slide">
                    <a href="full-calendar.html" className="side-menu__item">
                      Full Calendar
                    </a>
                  </li>
                  <li className="slide">
                    <a href="gallery.html" className="side-menu__item">
                      Gallery
                    </a>
                  </li>
                  <li className="slide">
                    <a href="sweet_alerts.html" className="side-menu__item">
                      Sweet Alerts
                    </a>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Projects
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a
                          href="projects-list.html"
                          className="side-menu__item"
                        >
                          Projects List
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="projects-overview.html"
                          className="side-menu__item"
                        >
                          Project Overview
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="projects-create.html"
                          className="side-menu__item"
                        >
                          Create Project
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Task
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a
                          href="task-kanban-board.html"
                          className="side-menu__item"
                        >
                          Kanban Board
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="task-list-view.html"
                          className="side-menu__item"
                        >
                          List View
                        </a>
                      </li>
                      <li className="slide">
                        <a href="task-details.html" className="side-menu__item">
                          Task Details
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Jobs
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a href="job-details.html" className="side-menu__item">
                          Job Details
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="job-company-search.html"
                          className="side-menu__item"
                        >
                          Search Company
                        </a>
                      </li>
                      <li className="slide">
                        <a href="job-search.html" className="side-menu__item">
                          Search Jobs
                        </a>
                      </li>
                      <li className="slide">
                        <a href="job-post.html" className="side-menu__item">
                          Job Post
                        </a>
                      </li>
                      <li className="slide">
                        <a href="jobs-list.html" className="side-menu__item">
                          Jobs List
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="job-candidate-search.html"
                          className="side-menu__item"
                        >
                          Search Candidate
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="job-candidate-details.html"
                          className="side-menu__item"
                        >
                          Candidate Details
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      NFT
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a
                          href="nft-marketplace.html"
                          className="side-menu__item"
                        >
                          Market Place
                        </a>
                      </li>
                      <li className="slide">
                        <a href="nft-details.html" className="side-menu__item">
                          NFT Details
                        </a>
                      </li>
                      <li className="slide">
                        <a href="nft-create.html" className="side-menu__item">
                          Create NFT
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="nft-wallet-integration.html"
                          className="side-menu__item"
                        >
                          Wallet Integration
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="nft-live-auction.html"
                          className="side-menu__item"
                        >
                          Live Auction
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      CRM
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a href="crm-contacts.html" className="side-menu__item">
                          Contacts
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="crm-companies.html"
                          className="side-menu__item"
                        >
                          Companies
                        </a>
                      </li>
                      <li className="slide">
                        <a href="crm-deals.html" className="side-menu__item">
                          Deals
                        </a>
                      </li>
                      <li className="slide">
                        <a href="crm-leads.html" className="side-menu__item">
                          Leads
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Crypto
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a
                          href="crypto-transactions.html"
                          className="side-menu__item"
                        >
                          Transactions
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="crypto-currency-exchange.html"
                          className="side-menu__item"
                        >
                          Currency Exchange
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="crypto-buy_sell.html"
                          className="side-menu__item"
                        >
                          Buy & Sell
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="crypto-marketcap.html"
                          className="side-menu__item"
                        >
                          Marketcap
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="crypto-wallet.html"
                          className="side-menu__item"
                        >
                          Wallet
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className="slide has-sub">
                <a href="javascript:void(0);" className="side-menu__item">
                  <i className="bi bi-layers side-menu__icon"></i>
                  <span className="side-menu__label">Nested Menu</span>
                  <i className="fe fe-chevron-right side-menu__angle"></i>
                </a>
                <ul className="slide-menu child1">
                  <li className="slide side-menu__label1">
                    <a href="javascript:void(0)">Nested Menu</a>
                  </li>
                  <li className="slide">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Nested-1
                    </a>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Nested-2
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a
                          href="javascript:void(0);"
                          className="side-menu__item"
                        >
                          Nested-2.1
                        </a>
                      </li>
                      <li className="slide has-sub">
                        <a
                          href="javascript:void(0);"
                          className="side-menu__item"
                        >
                          Nested-2.2
                          <i className="fe fe-chevron-right side-menu__angle"></i>
                        </a>
                        <ul className="slide-menu child3">
                          <li className="slide">
                            <a
                              href="javascript:void(0);"
                              className="side-menu__item"
                            >
                              Nested-2.2.1
                            </a>
                          </li>
                          <li className="slide">
                            <a
                              href="javascript:void(0);"
                              className="side-menu__item"
                            >
                              Nested-2.2.2
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className="slide has-sub">
                <a href="javascript:void(0);" className="side-menu__item">
                  <i className="bi bi-archive side-menu__icon"></i>
                  <span className="side-menu__label">Ui Elements</span>
                  <i className="fe fe-chevron-right side-menu__angle"></i>
                </a>
                <ul className="slide-menu child1 mega-menu">
                  <li className="slide side-menu__label1">
                    <a href="javascript:void(0)">Ui Elements</a>
                  </li>
                  <li className="slide">
                    <a href="alerts.html" className="side-menu__item">
                      Alerts
                    </a>
                  </li>
                  <li className="slide">
                    <a href="badge.html" className="side-menu__item">
                      Badge
                    </a>
                  </li>
                  <li className="slide">
                    <a href="breadcrumb.html" className="side-menu__item">
                      Breadcrumb
                    </a>
                  </li>
                  <li className="slide">
                    <a href="buttons.html" className="side-menu__item">
                      Buttons
                    </a>
                  </li>
                  <li className="slide">
                    <a href="buttongroup.html" className="side-menu__item">
                      Button Group
                    </a>
                  </li>
                  <li className="slide">
                    <a href="cards.html" className="side-menu__item">
                      Cards
                    </a>
                  </li>
                  <li className="slide">
                    <a href="dropdowns.html" className="side-menu__item">
                      Dropdowns
                    </a>
                  </li>
                  <li className="slide">
                    <a href="images_figures.html" className="side-menu__item">
                      Images & Figures
                    </a>
                  </li>
                  <li className="slide">
                    <a href="listgroup.html" className="side-menu__item">
                      List Group
                    </a>
                  </li>
                  <li className="slide">
                    <a href="navs_tabs.html" className="side-menu__item">
                      Navs & Tabs
                    </a>
                  </li>
                  <li className="slide">
                    <a href="object-fit.html" className="side-menu__item">
                      Object Fit
                    </a>
                  </li>
                  <li className="slide">
                    <a href="pagination.html" className="side-menu__item">
                      Pagination
                    </a>
                  </li>
                  <li className="slide">
                    <a href="popovers.html" className="side-menu__item">
                      Popovers
                    </a>
                  </li>
                  <li className="slide">
                    <a href="progress.html" className="side-menu__item">
                      Progress
                    </a>
                  </li>
                  <li className="slide">
                    <a href="spinners.html" className="side-menu__item">
                      Spinners
                    </a>
                  </li>
                  <li className="slide">
                    <a href="toasts.html" className="side-menu__item">
                      Toasts
                    </a>
                  </li>
                  <li className="slide">
                    <a href="tooltips.html" className="side-menu__item">
                      Tooltips
                    </a>
                  </li>
                  <li className="slide">
                    <a href="typography.html" className="side-menu__item">
                      Typography
                    </a>
                  </li>
                </ul>
              </li>
              <li className="slide has-sub">
                <a href="javascript:void(0);" className="side-menu__item">
                  <i className="bi bi-award side-menu__icon"></i>
                  <span className="side-menu__label">Utilities</span>
                  <i className="fe fe-chevron-right side-menu__angle"></i>
                </a>
                <ul className="slide-menu child1">
                  <li className="slide side-menu__label1">
                    <a href="javascript:void(0)">Utilities</a>
                  </li>
                  <li className="slide">
                    <a href="avatars.html" className="side-menu__item">
                      Avatars
                    </a>
                  </li>
                  <li className="slide">
                    <a href="borders.html" className="side-menu__item">
                      Borders
                    </a>
                  </li>
                  <li className="slide">
                    <a href="breakpoints.html" className="side-menu__item">
                      Breakpoints
                    </a>
                  </li>
                  <li className="slide">
                    <a href="colors.html" className="side-menu__item">
                      Colors
                    </a>
                  </li>
                  <li className="slide">
                    <a href="columns.html" className="side-menu__item">
                      Columns
                    </a>
                  </li>
                  <li className="slide">
                    <a href="flex.html" className="side-menu__item">
                      Flex
                    </a>
                  </li>
                  <li className="slide">
                    <a href="gutters.html" className="side-menu__item">
                      Gutters
                    </a>
                  </li>
                  <li className="slide">
                    <a href="helpers.html" className="side-menu__item">
                      Helpers
                    </a>
                  </li>
                  <li className="slide">
                    <a href="position.html" className="side-menu__item">
                      Position
                    </a>
                  </li>
                  <li className="slide">
                    <a href="more.html" className="side-menu__item">
                      Additional Content
                    </a>
                  </li>
                </ul>
              </li>
              <li className="slide has-sub">
                <a href="javascript:void(0);" className="side-menu__item">
                  <i className="bi bi-file-earmark-text side-menu__icon"></i>
                  <span className="side-menu__label">Forms</span>
                  <i className="fe fe-chevron-right side-menu__angle"></i>
                </a>
                <ul className="slide-menu child1">
                  <li className="slide side-menu__label1">
                    <a href="javascript:void(0)">Forms</a>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Form Elements
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a href="form_inputs.html" className="side-menu__item">
                          Inputs
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="form_check_radios.html"
                          className="side-menu__item"
                        >
                          Checks & Radios
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="form_input_group.html"
                          className="side-menu__item"
                        >
                          Input Group
                        </a>
                      </li>
                      <li className="slide">
                        <a href="form_select.html" className="side-menu__item">
                          Form Select
                        </a>
                      </li>
                      <li className="slide">
                        <a href="form_range.html" className="side-menu__item">
                          Range Slider
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="form_input_masks.html"
                          className="side-menu__item"
                        >
                          Input Masks
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="form_file_uploads.html"
                          className="side-menu__item"
                        >
                          File Uploads
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="form_dateTime_pickers.html"
                          className="side-menu__item"
                        >
                          Date,Time Picker
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="form_color_pickers.html"
                          className="side-menu__item"
                        >
                          Color Pickers
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide">
                    <a href="floating_labels.html" className="side-menu__item">
                      Floating Labels
                    </a>
                  </li>
                  <li className="slide">
                    <a href="form_layout.html" className="side-menu__item">
                      Form Layouts
                    </a>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Form Editors
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a href="quill_editor.html" className="side-menu__item">
                          Quill Editor
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide">
                    <a href="form_validation.html" className="side-menu__item">
                      Validation
                    </a>
                  </li>
                  <li className="slide">
                    <a href="form_select2.html" className="side-menu__item">
                      Select2
                    </a>
                  </li>
                </ul>
              </li>
              <li className="slide has-sub">
                <a href="javascript:void(0);" className="side-menu__item">
                  <i className="bi bi-snow side-menu__icon"></i>
                  <span className="side-menu__label">Advanced UI</span>
                  <i className="fe fe-chevron-right side-menu__angle"></i>
                </a>
                <ul className="slide-menu child1">
                  <li className="slide side-menu__label1">
                    <a href="javascript:void(0)">Advanced Ui</a>
                  </li>
                  <li className="slide">
                    <a
                      href="accordions_collpase.html"
                      className="side-menu__item"
                    >
                      Accordions & Collapse
                    </a>
                  </li>
                  <li className="slide">
                    <a href="carousel.html" className="side-menu__item">
                      Carousel
                    </a>
                  </li>
                  <li className="slide">
                    <a href="draggable-cards.html" className="side-menu__item">
                      Draggable Cards
                    </a>
                  </li>
                  <li className="slide">
                    <a href="modals_closes.html" className="side-menu__item">
                      Modals & Closes
                    </a>
                  </li>
                  <li className="slide">
                    <a href="navbar.html" className="side-menu__item">
                      Navbar
                    </a>
                  </li>
                  <li className="slide">
                    <a href="offcanvas.html" className="side-menu__item">
                      Offcanvas
                    </a>
                  </li>
                  <li className="slide">
                    <a href="placeholders.html" className="side-menu__item">
                      Placeholders
                    </a>
                  </li>
                  <li className="slide">
                    <a href="ratings.html" className="side-menu__item">
                      Ratings
                    </a>
                  </li>
                  <li className="slide">
                    <a href="scrollspy.html" className="side-menu__item">
                      Scrollspy
                    </a>
                  </li>
                  <li className="slide">
                    <a href="swiperjs.html" className="side-menu__item">
                      Swiper JS
                    </a>
                  </li>
                </ul>
              </li>
              <li className="slide">
                <a href="widgets.html" className="side-menu__item">
                  <i className="bi bi-gift side-menu__icon"></i>
                  <span className="side-menu__label">Widgets</span>
                </a>
              </li>

              <li className="slide has-sub">
                <a href="javascript:void(0);" className="side-menu__item">
                  <i className="bi bi-layout-text-window side-menu__icon"></i>
                  <span className="side-menu__label">Tables</span>
                  <i className="fe fe-chevron-right side-menu__angle"></i>
                </a>
                <ul className="slide-menu child1">
                  <li className="slide side-menu__label1">
                    <a href="javascript:void(0)">Tables</a>
                  </li>
                  <li className="slide">
                    <a href="tables.html" className="side-menu__item">
                      Tables
                    </a>
                  </li>
                  <li className="slide">
                    <a href="grid-tables.html" className="side-menu__item">
                      Grid JS Tables
                    </a>
                  </li>
                  <li className="slide">
                    <a href="data-tables.html" className="side-menu__item">
                      Data Tables
                    </a>
                  </li>
                </ul>
              </li>

              <li className="slide has-sub">
                <a href="javascript:void(0);" className="side-menu__item">
                  <i className="bi bi-bar-chart side-menu__icon"></i>
                  <span className="side-menu__label">Charts</span>
                  <i className="fe fe-chevron-right side-menu__angle"></i>
                </a>
                <ul className="slide-menu child1">
                  <li className="slide side-menu__label1">
                    <a href="javascript:void(0)">Charts</a>
                  </li>
                  <li className="slide has-sub">
                    <a href="javascript:void(0);" className="side-menu__item">
                      Apex Charts
                      <i className="fe fe-chevron-right side-menu__angle"></i>
                    </a>
                    <ul className="slide-menu child2">
                      <li className="slide">
                        <a
                          href="apex-line-charts.html"
                          className="side-menu__item"
                        >
                          Line Charts
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="apex-area-charts.html"
                          className="side-menu__item"
                        >
                          Area Charts
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="apex-column-charts.html"
                          className="side-menu__item"
                        >
                          Column Charts
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="apex-bar-charts.html"
                          className="side-menu__item"
                        >
                          Bar Charts
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="apex-mixed-charts.html"
                          className="side-menu__item"
                        >
                          Mixed Charts
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="apex-rangearea-charts.html"
                          className="side-menu__item"
                        >
                          Range Area Charts
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="apex-timeline-charts.html"
                          className="side-menu__item"
                        >
                          Timeline Charts
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="apex-funnel-charts.html"
                          className="side-menu__item"
                        >
                          Funnel Charts
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="apex-candlestick-charts.html"
                          className="side-menu__item"
                        >
                          CandleStick Charts
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="apex-boxplot-charts.html"
                          className="side-menu__item"
                        >
                          Boxplot Charts
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="apex-bubble-charts.html"
                          className="side-menu__item"
                        >
                          Bubble Charts
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="apex-scatter-charts.html"
                          className="side-menu__item"
                        >
                          Scatter Charts
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="apex-heatmap-charts.html"
                          className="side-menu__item"
                        >
                          Heatmap Charts
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="apex-treemap-charts.html"
                          className="side-menu__item"
                        >
                          Treemap Charts
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="apex-pie-charts.html"
                          className="side-menu__item"
                        >
                          Pie Charts
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="apex-radialbar-charts.html"
                          className="side-menu__item"
                        >
                          Radialbar Charts
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="apex-radar-charts.html"
                          className="side-menu__item"
                        >
                          Radar Charts
                        </a>
                      </li>
                      <li className="slide">
                        <a
                          href="apex-polararea-charts.html"
                          className="side-menu__item"
                        >
                          Polararea Charts
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="slide">
                    <a href="chartjs-charts.html" className="side-menu__item">
                      Chartjs Charts
                    </a>
                  </li>
                  <li className="slide">
                    <a href="echarts.html" className="side-menu__item">
                      Echart Charts
                    </a>
                  </li>
                </ul>
              </li>

              <li className="slide has-sub">
                <a href="javascript:void(0);" className="side-menu__item">
                  <i className="bi bi-geo-alt side-menu__icon"></i>
                  <span className="side-menu__label">Maps</span>
                  <i className="fe fe-chevron-right side-menu__angle"></i>
                </a>
                <ul className="slide-menu child1">
                  <li className="slide side-menu__label1">
                    <a href="javascript:void(0)">Maps</a>
                  </li>
                  <li className="slide">
                    <a href="google-maps.html" className="side-menu__item">
                      Google Maps
                    </a>
                  </li>
                  <li className="slide">
                    <a href="leaflet-maps.html" className="side-menu__item">
                      Leaflet Maps
                    </a>
                  </li>
                  <li className="slide">
                    <a href="vector-maps.html" className="side-menu__item">
                      Vector Maps
                    </a>
                  </li>
                </ul>
              </li>

              <li className="slide">
                <a href="icons.html" className="side-menu__item">
                  <i className="bi bi-shop side-menu__icon"></i>
                  <span className="side-menu__label">Icons</span>
                </a>
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
