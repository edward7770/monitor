import React, { useState, useEffect } from "react";
import { getUserAPI } from "../Services/AuthService";
import { getPricingListAPI } from "../Services/PricingService";
import { toast } from "react-toastify";

const Pricing = () => {
  const [user, setUser] = useState(null);
  const [userPriceId, setUserPriceId] = useState(null);
  const [pricingList, setPricingList] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      document.title = "Monitor | Pricing";

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

  useEffect(() => {
    const fetchPricingListData = async () => {
      if (user) {
        var tempPriceList = await getPricingListAPI(user.priceListId);
        if (tempPriceList) {
          setUserPriceId(user.pricingId);
          setPricingList(tempPriceList);
        }
      }
    };

    fetchPricingListData();
  }, [user]);

  return (
    <>
      <div className="container-fluid">
        <div className="my-4 page-header-breadcrumb d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <h1 className="page-title fw-medium fs-18 mb-2">Pricing Models</h1>
          </div>
        </div>
        <div className="alert alert-primary">
        Please select the pricing volume best suited to your business. Should you select Tier 5 and at the end of the month the total volume falls in another Tier, the difference will be invoiced separately as Pricing Tier Adjustment!
        </div>
        <div className="grid grid-cols-5 gap-4 mt-8">
          {pricingList &&
            pricingList.map((item, index) => {
              return (
                <div
                  className={`card custom-card pricing-card p-4 ${
                    userPriceId &&
                    item.id === userPriceId &&
                    "border border-primary overflow-hidden"
                  }`}
                  key={index}
                >
                  <div className="card-body p-0">
                    {userPriceId && item.id === userPriceId && (
                      <span className="pricing-new shadow">Selected</span>
                    )}
                    <div className="pb-4">
                      <h2
                        className="fw-medium mb-1"
                        style={{ fontSize: "20px" }}
                      >
                        {item.listName} Price Tier {item.tier}
                      </h2>
                      {/* <span className="fs-12 mb-1 text-muted d-block">
                        For Basic Business purpose !
                      </span> */}
                      <span
                        className="mb-1 d-block mt-4"
                        style={{ fontSize: "18px" }}
                      >
                        {item.start}&nbsp;-&nbsp;{item.end}
                      </span>
                    </div>
                  </div>
                  <div className="card-footer border-top-0 text-center p-0 pt-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="fs-16 fw-medium">
                        {index === 4 ? "Best Price" : "Price"}
                      </span>
                      <span className="fs-4 fw-medium text-primary">
                        R&nbsp;{item.price}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
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

export default Pricing;
