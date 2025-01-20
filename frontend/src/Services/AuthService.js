import axios from "axios";

const api = process.env.REACT_APP_BACKEND_API + "/api/";

export const getUsersAPI = async () => {
    try {
        const users = await axios.get(api + 'user');
        return users.data;
    } catch (error) {
        console.log(error);
    }
}

export const getUserAPI = async (userId) => {
    try {
        const users = await axios.get(api + `user/${userId}`);
        return users.data;
    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userStatus');
        window.location.href = '/login';
    }
}

export const loginAPI = async (email, password) => {
    const data = await axios.post(api + 'user/login', {
        email: email,
        password: password
    });
    return data;
}

export const registerAPI = async (username, email, password, role, phone) => {
    const data = await axios.post(api + 'user/register', {
        username: username,
        email: email,
        password: password,
        role: role,
        phone: phone
    });
    return data;

}

export const registerWithVoucherAPI = async (username, email, password, role, phone, voucherNumber) => {
    const data = await axios.post(api + 'user/register-voucher', {
        username: username,
        email: email,
        password: password,
        role: role,
        phone: phone,
        voucherNumber: voucherNumber
    });
    return data;
}

export const forgotPasswordAPI = async (email) => {
    const data = await axios.post(api + 'user/forgotPassword', {email});
    return data;
    
}

export const resetPasswordAPI = async (password, forgot_otp) => {
    const data = await axios.post(api + 'user/resetPassword', {
        password: password,
        forgot_otp: forgot_otp
    });
    return data;
}

export const confirmEmailAPI = async (token, userId, email) => {
    const data = await axios.get(api + 'user/confirm-email?token=' + token + "&userId=" + userId + "&email=" + email);
    return data;
}

export const resendEmailAPI = async (userId ,email) => {
    const data = await axios.get(api + 'user/resend-email?userId=' +  userId + "&email=" + email);
    return data;
}

export const toggleUserStatusAPI = async (user) => {
    const data = await axios.post(api + 'user/toggle-status', user);
    return data;
}

export const toggleUserRoleAPI = async (user) => {
    const data = await axios.post(api + 'user/toggle-userrole', user);
    return data;
}