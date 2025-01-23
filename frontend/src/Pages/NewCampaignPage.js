import React, { useState, useEffect } from "react";
import { getAllProspectListAPI } from "../Services/ProspectService";
import { createProspectVoucherAPI } from "../Services/ProspectVoucherService";
import { toast } from "react-toastify";

const NewCampaignPage = () => {
  const [prospectList, setProspectList] = useState(null);
  const [selectedProspects, setSelectedProspects] = useState(null);
  const [selectedProspectListId, setSelectedProspectListId] = useState(null);

  const [isSelected, setIsSelected] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [newCampaignData, setNewCampaignData] = useState({
    subject: "",
    voucherValue: "",
    bodyText: `Claim your R{{voucherValue}} credit voucher to test our Deceased Estates Database for free, zero risk!\nCLAIM YOUR VOUCHER: {{voucherNumber}} \nVoucher Expires: {{datetime}}`,
  });

  // function generateVoucherNumber() {
  //   const getRandomLetters = (length) =>
  //     Array.from({ length }, () => Math.random().toString(36).charAt(2).toUpperCase()).join('');

  //   return `${getRandomLetters(4)}-${getRandomLetters(4)}-${getRandomLetters(8)}-${getRandomLetters(8)}`;
  // };

  const handleSearchTextClient = (e) => {
    setSearchText(e.target.value);
    setIsSelected(false);
  };

  const handleSelectPriceList = (e, item) => {
    e.preventDefault();
    setSearchText(item.name);
    setSelectedProspectListId(item.id);
    setIsSelected(true);
  };

  const handleChangeCampaignData = (e) => {
    const { name, value } = e.target;

    setNewCampaignData((prevState) => {
      // if (name === "voucherValue") {
      //   return {
      //     ...prevState,
      //     [name]: value,
      //     bodyText: `Claim your R${value} credit voucher to test our Deceased Estates Database for free, zero risk!\n\nCLAIM YOUR VOUCHER: \n${prevState.voucherNumber} (This is a button)\nVoucher Expires: {{datetime}}`,
      //   };
      // }
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSubmitCampaign = async () => {
    if(!selectedProspectListId) {
      toast.warning("Please select prospect list to send!");
      return;
    }

    if(newCampaignData.voucherValue === "") {
      toast.warning("Please put a voucher value!");
      return;
    }

    const formData = {
      prospectListId: selectedProspectListId,
      subject: newCampaignData.subject,
      bodyText: newCampaignData.bodyText,
      voucherValue: newCampaignData.voucherValue
    }
    console.log(formData);

    await createProspectVoucherAPI(formData)
      .then(res => {
        if(res) {
          setNewCampaignData({
            subject: "",
            voucherValue: "",
            bodyText: `Claim your R{{voucherValue}} credit voucher to test our Deceased Estates Database for free, zero risk!\nCLAIM YOUR VOUCHER: {{voucherNumber}} \nVoucher Expires: {{datetime}}`,
          });
          setSelectedProspectListId(null);

          toast.success("New campaign sent successfully!");
        }
      })
      .catch(err => {
        if (err.response) {
          toast.error(err.response.data);
        } else {
          toast.error("Failed to submit new campaign!");
        }
      });
  }

  useEffect(() => {
    const fetchProspectListData = async () => {
      var tempProspectList = await getAllProspectListAPI();
      if (tempProspectList) {
        if (searchText !== "" && !isSelected) {
          for (let i = tempProspectList.length - 1; i >= 0; i--) {
            if (
              !tempProspectList[i].name
                .toLowerCase()
                .includes(searchText.toLocaleLowerCase())
            ) {
              tempProspectList.splice(i, 1);
            }
          }
        }

        if (selectedProspectListId) {
          var tempProspects = tempProspectList.filter(
            (x) => x.id === selectedProspectListId
          );

          if (tempProspects && tempProspects.length > 0) {
            setSelectedProspects(tempProspects[0].prospects);
          }
        }

        setProspectList(tempProspectList);
      }
    };

    fetchProspectListData();
  }, [isSelected, searchText, selectedProspectListId]);

  return (
    <>
      <div className="w-full mt-4">
        <div className="col-xl-12">
          <div className="card custom-card">
            <div className="card-header justify-between">
              <div className="card-title">New Campaign</div>
            </div>
            <div className="card-body">
              <div className="gridjs-head mb-3">
                <div className="header-element d-lg-block d-none my-auto">
                  <div className="dropdown my-auto">
                    <div className="w-100 flex items-center">
                      <span className="pr-12">To:</span>
                      <input
                        value={searchText}
                        onChange={(e) => handleSearchTextClient(e)}
                        placeholder="Search prospect list name...."
                        className="btn bg-body header-dashboards-button text-start d-flex align-items-center justify-content-between w-100 custom-input"
                        style={{ color: "rgba(0, 0, 0, 0.87)" }}
                        data-bs-toggle="dropdown"
                        // aria-expanded="false"
                      />
                      <ul
                        className="dropdown-menu dashboard-dropdown ml-12 w-[calc(100%-70px)]"
                        role="menu"
                      >
                        {prospectList &&
                          prospectList.map((x, index) => (
                            <li key={index}>
                              <a
                                className="dropdown-item dashboards-dropdown-item w-100"
                                href="/#"
                                onClick={(e) => handleSelectPriceList(e, x)}
                              >
                                {x.name}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div className="w-100 flex items-center mt-4">
                      <span className="pr-3">Subject:</span>
                      <input
                        value={newCampaignData.subject}
                        name="subject"
                        placeholder="This is subject..."
                        onChange={(e) => handleChangeCampaignData(e)}
                        className="btn bg-body header-dashboards-button text-start d-flex align-items-center justify-content-between w-100 custom-input"
                        style={{ color: "rgba(0, 0, 0, 0.87)", cursor: 'default' }}
                      />
                    </div>
                    <div className="w-100 flex items-center mt-4">
                      <span className="pr-1">Voucher:</span>
                      <input
                        value={newCampaignData.voucherValue}
                        name="voucherValue"
                        type="number"
                        placeholder="This is voucher value..."
                        onChange={(e) => handleChangeCampaignData(e)}
                        className="btn bg-body header-dashboards-button text-start d-flex align-items-center justify-content-between w-100 custom-input"
                        style={{ color: "rgba(0, 0, 0, 0.87)", cursor: 'default' }}
                      />
                    </div>
                    <div className="w-100 flex mt-4">
                      <span className="pr-7">Body:</span>
                      <textarea
                        value={newCampaignData.bodyText}
                        name="bodyText"
                        onChange={(e) => handleChangeCampaignData(e)}
                        rows={8}
                        className="btn bg-body header-dashboards-button text-start d-flex align-items-center justify-content-between w-100"
                        style={{ color: "rgba(0, 0, 0, 0.87)", cursor: 'default' }}
                      />
                    </div>
                    <div className="w-full mx-auto mt-4 block">
                      <button
                        type="button"
                        onClick={() => handleSubmitCampaign()}
                        className={`btn btn-wave w-full btn-primary`}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewCampaignPage;
