import React, { useState, useEffect } from "react";
import { getUserAPI } from "../Services/AuthService";
import { updateBalanceTypeAPI } from "../Services/ClientService";
import { toast } from "react-toastify";

const AccountSettings = () => {
  const [user, setUser] = useState(null);

  const handleConvertBalanceType = async (type) => {
    await updateBalanceTypeAPI(user.userId, {balanceType: type})
      .then((res) => {
        if (res) {
          console.log(res);
          toast.success("Your Balance Type is converted to " + type + "!");
        }
      })
      .catch((err) => {
        toast.error("Failed to convert balance type.");
      });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      document.title = "Monitor | Account Settings";

      const defaultUser = JSON.parse(window.localStorage.getItem("user"));
      if (defaultUser) {
        var tempUser = await getUserAPI(defaultUser.userId);
        if (tempUser) {
          setUser(tempUser);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="my-4 page-header-breadcrumb d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <h1 className="page-title fw-medium fs-18 mb-2">
              Account Settings
            </h1>
          </div>
        </div>
        {/* <div className="row">
          <div className="col-xl-12">
            <div className="card custom-card">
              <div className="card-body">
                <h4 className="fs-16">
                  Your Current Credit Balance: <b>R {user?.balanceAmount}</b>
                  <br />
                </h4>
                <h6 className="mt-2">
                  Balance Type:{" "}
                  <b>
                    {user?.balanceType?.charAt(0).toUpperCase() +
                      user?.balanceType?.slice(1)}
                  </b>
                </h6>
                <div className="d-grid my-4">
                  <button
                    onClick={() =>
                      handleConvertBalanceType(
                        user?.balanceType === "prepaid" ? "postpaid" : "prepaid"
                      )
                    }
                    className="btn btn-md btn-primary w-25"
                  >
                    Convert Balance Type to{" "}
                    {user?.balanceType === "prepaid" ? "Postpaid" : "Prepaid"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default AccountSettings;
