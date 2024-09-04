import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import DropDown from "../../Components/DropDown";
// import SearchListDropdown from "../../Components/SearchListDropdown";
import SearchInputListDropdown from "../../Components/SearchInputListDropdown";
import ManageUsersTable from "../../Components/ManageUsersTable";
import SearchBar from "../../Components/SearchBar";
import {
  getUsersAPI,
  toggleUserStatusAPI,
  toggleUserRoleAPI,
} from "../../Services/AuthService";
import { getUserAPI } from "../../Services/AuthService";
import { getSuppliersAPI } from "../../Services/SupplierService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Manageusers = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [allusers, setAllusers] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const [searchInputVal, setSearchInputVal] = useState("");
  const [searchInputSupplier, setSearchInputSupplier] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);

  // const [userTypes] = useState([
  //   "All",
  //   "Superadmin",
  //   "Admin",
  //   "Supplier",
  //   "Client",
  // ]);
  // const [roleType, setRoleType] = useState(null);

  // const handleTypeSelect = (option) => {
  //   setRoleType(option);
  // };

  const onChangeInputSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const onSelectSupplier = (option) => {
    if (option === "All") {
      setSearchInputSupplier("All");
      setSelectedSupplierId(null);
      setSearchInputVal("");
    } else {
      setSearchInputSupplier(option.companyName);
      setSelectedSupplierId(option.id);
      setSearchInputVal("");
    }
  };

  const onChangeSupplierName = (e) => {
    setSearchInputSupplier(e.target.value);
    setSearchInputVal(e.target.value);
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
        toast.success(
         
        );
        
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

  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem("user"));

    // if (user) {
    //   setRole(user.role);
    //   setUserId(user.userId);
    // }

    const fetchData = async () => {
      //   let allUsers = await getUsersAPI();
      let [allUsers, allSuppliers] = await Promise.all([
        getUsersAPI(),
        getSuppliersAPI(),
      ]);

      const defaultUser = JSON.parse(localStorage.getItem('user'));
      if(defaultUser){
          const user = await getUserAPI(defaultUser.userId);
          if(user) {
            setRole(user.role);
            setUserId(user.userId);
          }
      }

      let tempUsers = [];
      if (allUsers) {
        setAllusers(allUsers);
        allUsers.forEach((item) => {
          tempUsers.push(item);
        });
      }

      if (allSuppliers) {
        setSuppliers(allSuppliers);
      }

      //search role type
      // if (roleType !== "All" && roleType) {
      //   allUsers = allUsers.filter((item) => item.role === roleType);
      // }

      if (role === "Supplier") {
        var findUserId1 = tempUsers.map((item) => item.userId).indexOf(userId);
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

      var findSuperadminId = allUsers
        .map((item) => item.role)
        .indexOf("Superadmin");
      if (findSuperadminId > -1) {
        allUsers.splice(findSuperadminId, 1);
      }

      var findSameuserId = allUsers.map((item) => item.userId).indexOf(userId);
      if (findSameuserId > -1) {
        allUsers.splice(findSameuserId, 1);
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

      // if (searchInputSupplier !== "" && searchInputSupplier !== "All") {
      //   for (let i = allUsers.length - 1; i >= 0; i--) {
      //     if (
      //       allUsers[i].supplier &&
      //       !allUsers[i].supplier.companyName
      //         .toLowerCase()
      //         .includes(searchInputSupplier.toLocaleLowerCase())
      //     ) {
      //       allUsers.splice(i, 1);
      //     }
      //   }
      // }

      if (selectedSupplierId) {
        let selectedSupplierUserId = tempUsers
          .map((item) => item.supplier && item.supplier.id)
          .indexOf(selectedSupplierId);
        if (selectedSupplierUserId !== -1) {
          for (let i = allUsers.length - 1; i >= 0; i--) {
            var findUserId = tempUsers[
              selectedSupplierUserId
            ].supplierUsers.indexOf(allUsers[i].userId);
            if (findUserId === -1) {
              allUsers.splice(i, 1);
            }
          }
        }
      }

      if(role) {
        setUsers(allUsers);
      }
    };

    fetchData();
  }, [
    searchValue,
    searchInputSupplier,
    searchInputVal,
    selectedSupplierId,
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
          <h3>{t("manage_users_label")}</h3>
        </div>
      </div>
      <div id="main-wrapper" className="container">
        <div className="row">
          <div className="col-md-12">
            {(role !== "Supplier") && (
              <div className="panel panel-white">
                {/* <div className="panel-heading clearfix">
                <h4 className="panel-title">Manage users</h4>
              </div> */}
                <div className="panel-body">
                  {/* <div className="row mt-2">
                  <div className="col-md-12">
                    <DropDown
                      label="User Role"
                      selectedVal={roleType}
                      handleOptionClick={handleTypeSelect}
                      datas={userTypes}
                      placeholder=""
                      optioncase=""
                    />
                  </div>
                </div> */}
                  <div className="row mt-2">
                    <div className="col-md-12">
                      <SearchInputListDropdown
                        label={t("search_supplier_label")}
                        selectedVal={searchInputSupplier}
                        searchInputVal={searchInputVal}
                        handleChangeName={onChangeSupplierName}
                        handleOptionClick={onSelectSupplier}
                        datas={suppliers}
                        placeholder=""
                        optioncase="supplier"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
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

export default Manageusers;
