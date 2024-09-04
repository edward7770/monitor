import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import DropDown from "../../Components/DropDown";
// import SearchListDropdown from "../../Components/SearchListDropdown";
import ManageUsersTable from "../../Components/ManageUsersTable";
import SearchBar from "../../Components/SearchBar";
import {
  getUsersAPI,
  toggleUserStatusAPI,
  toggleUserRoleAPI,
} from "../../Services/AuthService";
import { getUserAPI } from "../../Services/AuthService";
import { createSupplierUserAPI } from "../../Services/SupplierService";
import { toast } from "react-toastify";
import { registerAPI } from "../../Services/AuthService";
import { useTranslation } from "react-i18next";

const SupplierUser = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [allusers, setAllusers] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const [searchValue, setSearchValue] = useState("");

  const [supplierUserData, setSupplierUserData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    phone: "",
    mobile: "",
  });

  const onChangeSupplierUserData = (e) => {
    setSupplierUserData({ ...supplierUserData, [e.target.name]: e.target.value });
  };

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [supplierUserErrors, setSupplierUserErrors] = useState([]);
  const [isError, setIsError] = useState(false);

  const onChangeInputSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const toggleUserStatusSwitch = async (user) => {
    let currentUserstatus = 0;
    let tempUsers = [];
    if (user.status === 0) {
      currentUserstatus = 1;
    }

    user = { ...user, status: currentUserstatus };

    await toggleUserStatusAPI(user).then((res) => {
      if (res) {
        users &&
          users.forEach((item) => {
            if (item.userId === res.data.id) {
              item.status = currentUserstatus;
            }

            tempUsers.push(item);
          });

        setUsers(tempUsers);
        toast.success(t("solution_status_change_success_msg", {name: res.data.name}));
      }
    });
  };

  const toggleUserRoleSwitch = async (user, event) => {
    const roleName = event.target.name;
    let currentRoleStatus = true;
    let tempUsers = [];

    if (roleName === "UserManagement" && user.userManagement === true) {
      currentRoleStatus = false;
    } else if (user.role === roleName) {
      currentRoleStatus = false;
    }

    let data = {
      userId: user.userId,
      currentRoleStatus: currentRoleStatus,
      roleName: roleName,
    };

    await toggleUserRoleAPI(data).then((res) => {
      if (res) {
        users &&
          users.forEach((item) => {
            if (item.userId === res.data.id) {
              if (roleName === "UserManagement") {
                item.userManagement = currentRoleStatus;
              } else if (currentRoleStatus === true) {
                item.role = roleName;
              } else {
                item.role = "";
              }
            }

            tempUsers.push(item);
          });

        setUsers(tempUsers);
        toast.success(
          t("user_role_update_success_msg", {name: res.data.name})
        );
      }
    });
  };

  const getSupplierNameForClient = (userId) => {
    let supplierName = "";
    allusers.forEach(item => {
      var findUserId = item.supplierUsers.indexOf(userId);
      if(findUserId > -1) {
        supplierName = item.supplier.companyName;
      }
    })

    return supplierName;
  }

  const onSubmitNewSupplierUser = async (e) => {
    e.preventDefault();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = regex.test(supplierUserData.email);
    if (!supplierUserData.email) {
      toast.error(t("check_email_msg"));
    } else if (!isValidEmail) {
      toast.error(t("check_email_validation_msg"));
    } else if (!supplierUserData.password) {
      toast.error(t("check_password_msg"));
    } else if (
      !supplierUserData.name ||
      !supplierUserData.surname ||
      !supplierUserData.phone ||
      !supplierUserData.mobile
    ) {
      let tempErrors = [];
      Object.entries(supplierUserData).forEach(([key, value]) => {
        if (!value) {
          tempErrors.push(key);
        }
      });

      setIsError(true);
      setSupplierUserErrors(tempErrors);

      toast.error(t("check__required_fields_msg"));
    } else {
      setIsSubmitLoading(true);
      let username = supplierUserData.name + " " + supplierUserData.surname;
      let [allusers] = await Promise.all([
        getUsersAPI()
      ]);

      await registerAPI(
        username,
        supplierUserData.email,
        supplierUserData.password,
        "User",
        supplierUserData.phone
      )
        .then((res) => {
          if (res) {
            var supplierId = "";
        
            var findUserId = allusers && allusers.map(item => item.userId).indexOf(userId);
            if(findUserId > -1) {
                supplierId = allusers[findUserId].supplier && allusers[findUserId].supplier.id;
            }
        
            const data = {
              supplierId: supplierId,
              userId: res.data.userId
            };

            createSupplierUserAPI(data)
              .then(response => {
                  if(response) {
                    setIsError(false);
                    setSupplierUserErrors({});
                    setSupplierUserData({
                      email: "",
                      password: "",
                      name: "",
                      surname: "",
                      phone: "",
                      mobile: "",
                    });
                    toast.success(t("supplier_user_save_success_msg"));
                  }
              })
              .catch(err => {
                toast.warning(t(err.response.data));
              })
              .finally(() => {
                setIsSubmitLoading(false);
              });
          }
        })
        .catch((err) => {
          setIsSubmitLoading(false);
          if (typeof err.response.data === "string") {
            if(err.response.data === "That email already exists.") {
              toast.warning(t("email_exists_msg"));
            } else {
              toast.warning(err.response.data);
            }
          } else {
            if (!Array.isArray(err.response.data)) {
              Object.entries(err.response.data.errors).forEach(
                ([key, value]) => {
                  toast.warning(value[0]);
                }
              );
            } else {
              if(err.response.data[0].description === "Passwords must be at least 8 characters."){
                toast.warning(t("password_valiation_limit_num_msg"));
              } else if(err.response.data[0].description === "Passwords must have at least one non alphanumeric character."){
                toast.warning(t("password_valiation_alpha_msg"));
              } else {
                toast.warning(err.response.data[0].description);
              }
            }
          }
        });
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      //   let allUsers = await getUsersAPI();
      let [allUsers] = await Promise.all([
        getUsersAPI()
      ]);

      const defaultUser = JSON.parse(localStorage.getItem('user'));
      if(defaultUser){
          const user = await getUserAPI(defaultUser.userId);
          if(user) {
            setRole(user.role);
            setUserId(user.userId);
          }
      }

      if (allUsers) {
        setAllusers(allUsers);
      }

      if (role === "Supplier") {
        var findUserId1 = allUsers.map((item) => item.userId).indexOf(userId);
        if (findUserId1 > -1) {
          let tempSupplierUsers = allUsers[findUserId1].supplierUsers;
          for (let i = allUsers.length - 1; i >= 0; i--) {
            var findSupplierUserId = tempSupplierUsers.indexOf(
              allUsers[i].userId
            );

            if (findSupplierUserId === -1) {
                allUsers.splice(i, 1);
            }
          }
        }
      }

      //search email, surname, name
      if (searchValue !== "") {
        for (let i = allUsers.length - 1; i >= 0; i--) {
          if (
            !allUsers[i].name
              .toLowerCase()
              .includes(searchValue.toLocaleLowerCase()) &&
            !allUsers[i].email
              .toLowerCase()
              .includes(searchValue.toLocaleLowerCase())
          ) {
            allUsers.splice(i, 1);
          }
        }
      }

      if(role) {
        setUsers(allUsers.reverse());
      }
    };

    fetchData();
  }, [
    isSubmitLoading,
    searchValue,
    userId,
    role
  ]);

  return (
    <div className="page-inner">
      <div className="page-breadcrumb">
        <ol className="breadcrumb container">
          <li>
            <Link to="/dashboard">{t("dashboard")}</Link>
          </li>
        </ol>
      </div>
      <div className="page-title">
        <div className="container">
          <h3>{t("supplier_users_label")}</h3>
        </div>
      </div>
      <div id="main-wrapper" className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="panel panel-white">
                <div className="panel-body">
                  <form onSubmit={onSubmitNewSupplierUser}>
                    <h2 className="text-center mb-4 text-lg">{t("new_supplier_user")}</h2>
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control"
                        placeholder={t("email")}
                        name="email"
                        id="email"
                        value={supplierUserData.email}
                        onChange={onChangeSupplierUserData}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control mb-8"
                        placeholder={t("password")}
                        name="password"
                        id="password"
                        value={supplierUserData.password}
                        onChange={onChangeSupplierUserData}
                      />
                    </div>
                    <hr />
                    <div className="row mt-8">
                      <div className="col-md-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={t("name")}
                            name="name"
                            id="name"
                            value={supplierUserData.name}
                            onChange={onChangeSupplierUserData}
                          />
                          {isError && supplierUserErrors.indexOf("name") > -1 && (
                            <span className="text-red-500">
                              {t("field_required")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={t("surname")}
                            name="surname"
                            id="surname"
                            value={supplierUserData.surname}
                            onChange={onChangeSupplierUserData}
                          />
                          {isError && supplierUserErrors.indexOf("surname") > -1 && (
                            <span className="text-red-500">
                              {t("field_required")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={t("mobile")}
                            name="mobile"
                            id="mobile"
                            value={supplierUserData.mobile}
                            onChange={onChangeSupplierUserData}
                          />
                          {isError && supplierUserErrors.indexOf("mobile") > -1 && (
                            <span className="text-red-500">
                              {t("field_required")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={t("alternative_phone")}
                            name="phone"
                            id="phone"
                            value={supplierUserData.phone}
                            onChange={onChangeSupplierUserData}
                          />
                          {isError && supplierUserErrors.indexOf("phone") > -1 && (
                            <span className="text-red-500">
                              {t("field_required")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-success btn-block m-t-xs">
                      {t("submit")} {isSubmitLoading && "..."}
                    </button>
                  </form>
                </div>
            </div>
            
            <div className="panel panel-white rounded-3xl">
              <div className="panel-body">
                <div className="home-table-header">
                  <div className="d-flex">
                    <div className="text-xl mt-2">{t("search_results")}</div>
                    <div className="d-flex home-table-header-inputs">
                      <SearchBar
                        label = {t("search")}
                        searchValue={searchValue}
                        onChangeInput={onChangeInputSearch}
                      />
                    </div>
                  </div>
                </div>
                <ManageUsersTable
                  toggleUserStatusSwitch={toggleUserStatusSwitch}
                  toggleUserRoleSwitch={toggleUserRoleSwitch}
                  getSupplierNameForClient = {getSupplierNameForClient}
                  data={users}
                  role={role}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierUser;
