import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router';
import { getUserAPI, registerAPI, loginAPI, forgotPasswordAPI, resetPasswordAPI } from "../Services/AuthService";
import { toast } from 'react-toastify'; 
import axios from 'axios';
import { useTranslation } from "react-i18next";

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if(user && token) {
            setUser(JSON.parse(user));
            setToken(token);
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        }
        setIsReady(true);
    }, [token]);

    const registerUser = async (username, email, password, role) => {
        setIsLoading(true);
        await registerAPI(username, email, password, role)
            .then((res) => {
                if(res) {
                    localStorage.setItem('token', res.data.token);
                    const userObj = {
                        username: res.data.userName,
                        email: res.data.email,
                        role: res.data.role,
                        userId: res.data.userId
                    };
                    localStorage.setItem('user', JSON.stringify(userObj));
                    
                    setToken(res.data.token);
                    setUser(userObj);
                    toast.success('Register success!');
                    setIsLoading(false);
                    navigate("/dashboard");
                }
            })
            .catch(err => {
                if(typeof err.response.data === "string"){
                    toast.warning(err.response.data);
                } else {
                    toast.warning(err.response.data[0].description);
                }
                setIsLoading(false);
            });
    }

    const loginUser = async (email, password) => {
        setIsLoading(true);
        await loginAPI(email, password)
            .then((res) => {
                if(res.status === 200) {
                    if(res.data.emailConfirmed) {
                        if(res.data.status === 1) {
                            localStorage.setItem('token', res.data.token);
                            const userObj = {
                                userId: res.data.userId,
                                username: res.data.userName,
                                email: res.data.email,
                                role: res.data.role,
                                emailConfirmed: res.data.emailConfirmed,
                                userManagement: res.data.userManagement
                            };
        
                            localStorage.setItem('user', JSON.stringify(userObj));
                            setToken(res.data.token);
                            setUser(userObj);
                            toast.success(t("login_success_msg"));
                            setIsLoading(false);
                            navigate("/dashboard");
                            setTimeout(() => {
                                window.location.reload();
                              }, 0);
                        } else {
                            toast.warning(t("account_no_active_msg"));
                        }
                    } else {
                        navigate('/resend-email?userId=' + res.data.userId + "&email=" + res.data.email);
                    }
                }
            })
            .catch(err => {
                // toast.warning('Invalid email and/or password.');
                if(err.response){
                    toast.warning(t(err.response.data));
                }else {
                    toast.warning(t("check_connection_msg"));
                }
                setIsLoading(false);
            });
    }

    const forgotPassword = async (email) => {
        setIsLoading(true);
        await forgotPasswordAPI(email)
            .then((res) => {
                setIsLoading(false);
                if(res) {
                    toast.success(t("send_email_success_msg"));
                    navigate('/login');
                }
            })
            .catch(err => {
                if(err.response) {
                    toast.warning(t(err.response.data));
                } else {
                    toast.warning(t("send_email_fail_msg"));
                }
                setIsLoading(false);
            });
    }

    const resetPassword = async (password, forgot_otp) => {
        setIsLoading(true);
        await resetPasswordAPI(password, forgot_otp)
            .then((res) => {
                if(res) {
                    toast.success(t("password_change_msg"));
                    setIsLoading(true);
                    navigate('/login');
                }
            })
            .catch(err => {
                if(err.response) {
                    toast.warning(t(err.response.data));
                } else {
                    toast.warning(t("reset_psd_fail_msg"));
                }
                setIsLoading(false);
            });
    }

    const isLoggedIn = () => {
        const user = localStorage.getItem("user");
        return !!user;
    }

    const getUserRole = async () => {
        let role = "Client";
        const defaultUser = JSON.parse(localStorage.getItem("user"));
        if(defaultUser) {
            const user = await getUserAPI(defaultUser.userId);
            if(user) {
                role = user.role;
            }
        }

        return role;
    }

    const getUserManagement = async () => {
        const defaultUser = JSON.parse(localStorage.getItem('user'));

        if(user){
            const user = await getUserAPI(defaultUser.userId);
            if(user) {
                let userManagement = user.userManagement;
                return userManagement;
            }
        }
    }

    const getUserStatus = async () => {
        const defaultUser = JSON.parse(localStorage.getItem('user'));

        if(user){
            const user = await getUserAPI(defaultUser.userId);
            if(user) {
                let status = user.status
                return status;
            }
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken('');
        // window.location
        navigate('/login');
        setTimeout(() => {
            window.location.reload();
          }, 0);
    };

    return (
        <UserContext.Provider value={{ loginUser, user, token, logout, isLoggedIn, getUserRole, getUserManagement, getUserStatus, registerUser, forgotPassword, isLoading, resetPassword }}>
            {isReady ? children: null}
        </UserContext.Provider>
    );
}

export const useAuth = () => React.useContext(UserContext);