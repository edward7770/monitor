import "./App.css";
// import Home from "./Pages/Home";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import ConfirmEmail from "./Pages/ConfirmEmail";
import ResendEmail from "./Pages/ResendEmail";

import ProtectedRoute from "./Routes/ProtectedRoute";
// import ProtectedRoleRoute from "./Routes/ProtectedRoleRoute";
import ProtectedLoginRoute from "./Routes/ProtectedLoginRoute";
// import ProtectedAdminRoute from "./Routes/ProtectedAdminRoute";
// import ProtectedSuperadminRoute from "./Routes/ProtectedSuperadminRoute";
// import ProtectedUsermanagementRoute from "./Routes/ProtectedUsermanagementRoute";
import { useAuth } from "./context/useAuth";
import NotFound from "./Pages/NotFound";
import Navbar from "./Components/Navbar";
import SwitcherCanvs from "./Components/SwitcherCanvs";
import Sidebar from "./Components/Sidebar";
import Footer from "./Components/Footer";

import Profile from "./Pages/Profile";
import UploadPage from "./Pages/UploadPage";
import History from "./Pages/History";
import AccountSettings from "./Pages/AccountSettings";

import axios from 'axios';
import { Outlet } from "react-router";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";

import { Helmet } from "react-helmet";

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userStatus');
      
      window.location.href = '/login';
      error.response.data = "Session was timed out! Please try to login again.";
      // toast.warning("Session was timed out! Please try to login again.");
      // throw error;
    }
    return Promise.reject(error);
  }
);

function App() {
  const { isLoggedIn, getUserStatus } = useAuth();

  const [isChangedBalance, setIsChangedBalance] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState(0);

  const handleChangeBalance = (amount) => {
    setIsChangedBalance(!isChangedBalance);
    setBalanceAmount(amount);
  }
  
  useEffect(() => {
    const fetchUserRole = async () => {
      const defaultUser = JSON.parse(localStorage.getItem('user'));
      if(defaultUser) {
        const status = await getUserStatus();
        if(status === 0) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.setItem('userStatus', 0);
          
          return <Navigate to="/login" state={{case: 'status'}} replace />
        }
      }
    };

    fetchUserRole();
}, [getUserStatus, isLoggedIn, isChangedBalance]);

  return (
    <>
      <SwitcherCanvs/>
        <Routes>
          <Route path="/" element={<ProtectedLoginRoute><Login /></ProtectedLoginRoute>} />
          <Route path="/login" element={<ProtectedLoginRoute><Login /></ProtectedLoginRoute>} />
          <Route path="/register" element={<ProtectedLoginRoute><Register /></ProtectedLoginRoute>} />
          <Route path="/forgot" element={<ProtectedLoginRoute><ForgotPassword /></ProtectedLoginRoute>} />
          <Route path="/resetpassword" element={<ProtectedLoginRoute><ResetPassword /></ProtectedLoginRoute>} />
          <Route path="/confirm-email" element={<ProtectedLoginRoute><ConfirmEmail /></ProtectedLoginRoute>} />
          <Route path="/resend-email" element={<ProtectedLoginRoute><ResendEmail /></ProtectedLoginRoute>} />

          {/* <Route path="/new-admin" element={<ProtectedSuperadminRoute><NewAdmin /></ProtectedSuperadminRoute>} />
          <Route path="/supplier-user" element={<ProtectedUsermanagementRoute><SupplierUser /></ProtectedUsermanagementRoute>} />
          <Route path="/manage-users" element={<ProtectedUsermanagementRoute><Manageusers /></ProtectedUsermanagementRoute>} /> */}

          {isLoggedIn() && (
            <Route
              path="/"
              element={
                <div className="page">
                  <Navbar isChangedBalance={isChangedBalance} balanceAmount={balanceAmount} />
                  <Sidebar />
                  <div className="main-content app-content">
                    <Outlet />
                  </div>
                  <Footer />
                </div>
              }
            >
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute><UploadPage/></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History handleChangeBalance={handleChangeBalance} /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/account-settings" element={<ProtectedRoute><AccountSettings/></ProtectedRoute>} />
            </Route>
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      <div className="scrollToTop">
        <span className="arrow"><i className="ti ti-arrow-narrow-up fs-20"></i></span>
      </div>
      <div id="responsive-overlay"></div>
      <Helmet>
        {isLoggedIn() && <script src="/assets/js/defaultmenu.min.js"></script>}
        {isLoggedIn() && <script src="/assets/js/sticky.js"></script>}
        {isLoggedIn() && <script src="/assets/js/custom.js"></script>}
        {isLoggedIn() && <script src="/assets/js/custom-switcher.min.js"></script>}
        {!isLoggedIn() && <script src="/assets/libs/bootstrap/js/bootstrap.bundle.min.js"></script>}
        {!isLoggedIn() && <script src="/assets/js/show-password.js"></script>}
        {!isLoggedIn() && <script src="/assets/js/authentication-main.js"></script>}
      </Helmet>
    </>
  );
}

export default App;
