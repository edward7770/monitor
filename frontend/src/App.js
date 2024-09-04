import "./App.css";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { Route, Routes } from "react-router-dom";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import ConfirmEmail from "./Pages/ConfirmEmail";
import ResendEmail from "./Pages/ResendEmail";

import ProtectedRoute from "./Routes/ProtectedRoute";
// import ProtectedRoleRoute from "./Routes/ProtectedRoleRoute";
import ProtectedLoginRoute from "./Routes/ProtectedLoginRoute";
// import ProtectedAdminRoute from "./Routes/ProtectedAdminRoute";
import ProtectedSuperadminRoute from "./Routes/ProtectedSuperadminRoute";
import ProtectedUsermanagementRoute from "./Routes/ProtectedUsermanagementRoute";
import { useAuth } from "./context/useAuth";
import NotFound from "./Pages/NotFound";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import CdNav from "./Components/CdNav";

import NewAdmin from "./Pages/Manageusers/NewAdmin";
import SupplierUser from "./Pages/Manageusers/SupplierUser";
import Manageusers from "./Pages/Manageusers/Manageusers";
import Profile from "./Pages/Profile";

import axios from 'axios';
import { useEffect } from "react";
import { Navigate } from "react-router";

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
}, [getUserStatus]);

  return (
    <>
      <div className="page-header-fixed compact-menu page-horizontal-bar full-height">
        <main className="page-content content-wrap">
          <Navbar/>
          <Sidebar isLoggedIn = {isLoggedIn()}/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
            <Route path="/login" element={<ProtectedLoginRoute><Login /></ProtectedLoginRoute>} />
            <Route path="/register" element={<ProtectedLoginRoute><Register /></ProtectedLoginRoute>} />
            <Route path="/forgot" element={<ProtectedLoginRoute><ForgotPassword /></ProtectedLoginRoute>} />
            <Route path="/resetpassword" element={<ProtectedLoginRoute><ResetPassword /></ProtectedLoginRoute>} />
            <Route path="/confirm-email" element={<ProtectedLoginRoute><ConfirmEmail /></ProtectedLoginRoute>} />
            <Route path="/resend-email" element={<ProtectedLoginRoute><ResendEmail /></ProtectedLoginRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            <Route path="/new-admin" element={<ProtectedSuperadminRoute><NewAdmin /></ProtectedSuperadminRoute>} />
            <Route path="/supplier-user" element={<ProtectedUsermanagementRoute><SupplierUser /></ProtectedUsermanagementRoute>} />
            <Route path="/manage-users" element={<ProtectedUsermanagementRoute><Manageusers /></ProtectedUsermanagementRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <div className="flex p-6 justify-center">
            <p className="no-s">2024 &copy; Prosumator SRL</p>
          </div>
        </main>
        {isLoggedIn() && <CdNav />}
      </div>
    </>
  );
}

export default App;
