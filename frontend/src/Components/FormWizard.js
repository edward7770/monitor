import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import DropDown from "./DropDown";
import { Alert } from "@mui/material";
import {
  createSolutionAPI,
  editSolutionAPI,
} from "../Services/SolutionService";
import { getUserAPI } from "../Services/AuthService";
import { getPanelsAPI } from "../Services/PanelService";
import { getStoragesAPI } from "../Services/StorageService";
import { getInvertersAPI } from "../Services/InverterService";
import { getBrandsAPI } from "../Services/BrandService";
import { getSuppliersAPI } from "../Services/SupplierService";
import { getProvincesAPI } from "../Services/ProvinceService";
import { toast } from "react-toastify";
import SearchInputListDropdown from "./SearchInputListDropdown";
import { useTranslation } from "react-i18next";

const FormWizard = (props) => {
  const { t } = useTranslation();
  const { optioncase, selectedSolution } = props;
  const [role, setRole] = useState(null);

  const [phase, setPhase] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const [brands, setBrands] = useState([]);
  const [inverters, setInverters] = useState([]);
  const [panels, setPanels] = useState([]);
  const [storages, setStorages] = useState([]);

  const [inverterKvas, setInverterKvas] = useState(null);
  const [inverterBrands, setInverterBrands] = useState(null);
  const [inverterModelnumbers, setInverterModelnumbers] = useState(null);

  const [panelBrands, setPanelBrands] = useState(null);
  const [storageBrands, setStorageBrands] = useState(null);

  const [panelBrandSelected, setPanelBrandSelected] = useState(null);
  const [panelBrandIdSelected, setPanelBrandIdSelected] = useState(0);
  const [panelModelNumberSelected, setPanelModelNumberSelected] =
    useState(null);
  const [panelModelnumbers, setPanelModelnumbers] = useState(null);

  const [storageBrandSelected, setStorageBrandSelected] = useState(null);
  const [storageBrandIdSelected, setStorageBrandIdSelected] = useState(0);
  const [storageModelNumberSelected, setStorageModelNumberSelected] =
    useState(null);
  const [storageModelnumbers, setStorageModelnumbers] = useState(null);

  const [inverterSelected, setInverterSelected] = useState(null);
  const [panelSelected, setPanelSelected] = useState(null);
  const [storageSelected, setStorageSelected] = useState(null);

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [progress, setProgress] = useState(50 / 3);

  const [inverterKvaSelected, setInverterKvaSelected] = useState(0);
  const [inverterBrandSelected, setInverterBrandSelected] = useState("");
  const [inverterBrandIdSelected, setInverterBrandIdSelected] = useState(0);
  const [inverterModelnumberSelected, setInverterModelnumberSelected] =
    useState("");

  const [solutionName, setSolutionName] = useState("");
  const [solutionNameLength, setSolutionNameLength] = useState(150);
  const [solutionPrice, setSolutionPrice] = useState(0);
  const [solutionEquipmentPrice, setSolutionEquipmentPrice] = useState(0);
  const [solutionDescription, setsolutionDescription] = useState("");

  // const [stringCount, setStringCount] = useState(0);
  const [panelCount, setPanelCount] = useState(0);
  const [storageCount, setStorageCount] = useState(0);

  const [allProvinces, setAllProvinces] = useState([]);
  const [searchProvinceInputVal, setSearchProvinceInputVal] = useState("");
  const [selectedSolutionProvince, setSelectedSolutionProvince] = useState("");
  const [selectedSolutionProvinceId, setSelectedSolutionProvinceId] =
    useState("");
  const [selectedSolutionProvinces, setSelectedSolutionProvinces] = useState(
    []
  );

  const onSelectSolutionProvince = (option) => {
    setSearchProvinceInputVal("");
    setSelectedSolutionProvince("");
    if(option === '') {
      setSelectedSolutionProvinces(allProvinces);
    } else {
      setSelectedSolutionProvinceId(option.id);
      const findProvinceId = selectedSolutionProvinces
        .map((item) => item.id)
        .indexOf(option.id);
      if (findProvinceId === -1) {
        selectedSolutionProvinces.push(option);
        setSelectedSolutionProvinces(selectedSolutionProvinces);
      }
    }
  };

  const onChangeSolutionProvince = (e) => {
    setSearchProvinceInputVal(e.target.value);
    setSelectedSolutionProvince(e.target.value);
  };

  const onCloseSolutionProvince = (id) => {
    setSelectedSolutionProvinceId(id + "close");
    const findId = selectedSolutionProvinces
      .map((province) => province.id)
      .indexOf(id);
    if (findId > -1) {
      selectedSolutionProvinces.splice(findId, 1);
      setSelectedSolutionProvinces(selectedSolutionProvinces);
    }
  };

  const onChangePhase = (val) => {
    setPhase(val);

    // Filter inverters based on phase count
    const filteredInverters = inverters.filter(
      (inverter) => inverter.phaseCount === val
    );

    // Extract unique kva values from filtered inverters
    const kvas = [
      ...new Set(filteredInverters.map((inverter) => inverter.kva)),
    ].sort((a, b) => a - b);

    setInverterKvas(kvas);
  };

  const handleInverterKvaSelect = (option) => {
    setInverterKvaSelected(option);

    // Filter inverters based on phase count and selected kVA
    const filteredInverters = inverters.filter(
      (inverter) => inverter.phaseCount === phase && inverter.kva === option
    );

    // Extract unique brands from filtered inverters
    // const uniqueBrands = [
    //   ...new Set(filteredInverters.map((inverter) => inverter.brand)),
    // ];
    let uniqueBrands = [];
    filteredInverters.forEach((inverter) => {
      let existingBrand = uniqueBrands.find(
        (brand) => brand.id === inverter.brandId
      );
      if (!existingBrand) {
        uniqueBrands.push({ id: inverter.brandId, name: inverter.brand });
      }
    });

    // Filter brands based on unique brand names
    const filteredBrands = brands.filter((brand) =>
      uniqueBrands.some((uniqueBrand) => uniqueBrand.id === brand.id)
    );

    setInverterBrands(filteredBrands);
  };

  const handleInverterBrandSelect = (option) => {
    setInverterBrandSelected(option.name);
    setInverterBrandIdSelected(option.id);

    // Filter inverters based on phase count, selected kVA, and selected brand
    const filteredInverters = inverters.filter(
      (inverter) =>
        inverter.phaseCount === phase &&
        inverter.kva === inverterKvaSelected &&
        inverter.brandId === option.id
    );

    // Extract unique model numbers from filtered inverters
    const uniqueModelNumbers = [
      ...new Set(filteredInverters.map((inverter) => inverter.modelNumber)),
    ];

    setInverterModelnumbers(uniqueModelNumbers);
  };

  const handleInverterModelnumberSelect = (option) => {
    setInverterModelnumberSelected(option);
    var findInverterId = inverters
      .map((item) => item.modelNumber)
      .indexOf(option);
    if (findInverterId > -1) {
      setInverterSelected(inverters[findInverterId]);
    }
  };

  const handlePanelBrandSelect = (option) => {
    setPanelBrandSelected(option.name);
    setPanelBrandIdSelected(option.id);

    // Filter panels based on selected brand
    const filteredPanels = panels.filter(
      (panel) => panel.brandId === option.id
    );

    // setInverterBrands(filteredBrands);

    // Extract unique model numbers from filtered panels
    const uniqueModelNumbers = [
      ...new Set(filteredPanels.map((panel) => panel.modelNumber)),
    ];

    setPanelModelnumbers(uniqueModelNumbers);
  };

  const handleStorageBrandSelect = (option) => {
    setStorageBrandSelected(option.name);
    setStorageBrandIdSelected(option.id);

    // Filter storages based on selected brand
    const filteredStorages = storages.filter(
      (storage) => storage.brandId === option.id
    );

    // Extract unique model numbers from filtered storages
    const uniqueModelNumbers = [
      ...new Set(filteredStorages.map((storage) => storage.modelNumber)),
    ];

    setStorageModelnumbers(uniqueModelNumbers);
  };

  const handlePanelSelect = (option) => {
    setPanelModelNumberSelected(option);

    // Find the panel object corresponding to the selected model number
    const selectedPanel = panels.find((panel) => panel.modelNumber === option);

    // Set the selected panel details
    if (selectedPanel) {
      setPanelSelected(selectedPanel);
    }
  };

  const handleStorageSelect = (option) => {
    setStorageModelNumberSelected(option);

    // Find the storage object corresponding to the selected model number
    const selectedStorage = storages.find(
      (storage) => storage.modelNumber === option
    );

    // Set the selected storage details
    if (selectedStorage) {
      setStorageSelected(selectedStorage);
    }
  };

  const onNextBtnClick = (event) => {
    event.preventDefault();
    setActiveStep(activeStep + 1);
    setProgress(progress + 50 / 3);
  };

  const onPrevBtnClick = (event) => {
    event.preventDefault();
    setActiveStep(activeStep - 1);
    setProgress(progress - 50 / 3);
  };

  const onTabStepClick = (activeStep) => {
    setActiveStep(activeStep);
    setProgress((50 / 3) * (activeStep + 1));
  };

  const onChangePanelCount = (e) => {
    setPanelCount(e.target.value);
  };

  const onChangeStorageCount = (e) => {
    setStorageCount(e.target.value);
  };

  const onchangeSolutionName = (e) => {
    if (e.target.value.length < 151) {
      setSolutionName(e.target.value);
      setSolutionNameLength(150 - e.target.value.length);
    }
  };

  const onchangeSolutionPrice = (e) => {
    setSolutionPrice(e.target.value);
  };

  const onchangeSolutionEquipmentPrice = (e) => {
    setSolutionEquipmentPrice(e.target.value);
  };

  const onchangeSolutionDescription = (e) => {
    setsolutionDescription(e.target.value);
  };

  // const onChangeStringCount = (e) => {
  //     setStringCount(e.target.value);
  // }
  const handleSupplierSelect = (option) => {
    setSelectedSupplier(option);
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    const strUser = localStorage.getItem("user");
    let email = "";
    if (strUser) email = JSON.parse(strUser).email;

    if (!inverterSelected) {
      toast.warning(t("inverter_validation_msg"));
    } else if (!panelSelected) {
      toast.warning(t("panel_validation_msg"));
    }  else if (!selectedSupplier) {
      toast.warning(t("supplier_validation_msg"));
    } else if (selectedSolutionProvinces.length === 0) {
      toast.warning(t("province_validation_msg"));
    } else {
      let formdata = {
        name: solutionName,
        price: solutionPrice,
        equipmentPrice: solutionEquipmentPrice,
        description: solutionDescription,
        inverterId: inverterSelected.id,
        panelId: panelSelected.id,
        storageId: storageSelected ? storageSelected.id : null,
        stringCount: inverterSelected.strings,
        panelCount: panelCount,
        storageCount: storageCount,
        createdByEmail: email,
        status: props.solutionStatus,
        supplierId: selectedSupplier && selectedSupplier.id,
        provinces: selectedSolutionProvinces,
      };

      if (
        (optioncase === "editsolution" || optioncase === "resubmitsolution") &&
        selectedSolution
      ) {
        await editSolutionAPI(formdata, selectedSolution.id)
          .then((res) => {
            if (res.status === 200) {
              setActiveStep(5);
              setProgress(100);
              toast.success(
                optioncase === "editsolution"
                  ? t("edit_solution")
                  : t("resubmit_solution") +
                      " " +
                      res.data.name +
                      " Successfully!"
              );
            }
          })
          .catch((err) => {
            if (err) {
              if (err.response.status === 401) {
                toast.warning(t("unauthorized_msg"));
              } else {
                toast.warning(t(err.response.data));
                // toast.warning("edit solution failed!");
              }
            }
          });
      } else {
        await createSolutionAPI(formdata)
          .then((res) => {
            if (res.status === 200) {
              setActiveStep(5);
              setProgress(100);
              toast.success(t("add_solution_success_msg"));
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              toast.warning(t("unauthorized_msg"));
            } else {
              // toast.warning("Add solution failed!");
              toast.warning(t(err.response.data));
            }
          });
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchData = async () => {
      const [
        brandsData,
        panelsData,
        storagesData,
        invertersData,
        getSuppliers,
        getProvinces,
      ] = await Promise.all([
        getBrandsAPI(),
        getPanelsAPI(),
        getStoragesAPI(),
        getInvertersAPI(),
        getSuppliersAPI(),
        getProvincesAPI(),
      ]);

      if (getProvinces) {
        setAllProvinces(getProvinces);
      }

      if (invertersData) {
        setInverters(invertersData.filter(item => item.status === 1));
      }

      if (brandsData) {
        setBrands(brandsData.filter(item => item.status === 1));
      }

      if (panelsData) {
        let uniquePanelBrands = [];
        panelsData.filter(item => item.status === 1).forEach((panel) => {
          let existingBrand = uniquePanelBrands.find(
            (brand) => brand.id === panel.brandId
          );
          if (!existingBrand) {
            uniquePanelBrands.push({ id: panel.brandId, name: panel.brand });
          }
        });
        const filteredPanelBrands = brandsData.filter((brand) =>
          uniquePanelBrands.some((uniqueBrand) => uniqueBrand.id === brand.id)
        );

        setPanelBrands(filteredPanelBrands);
        setPanels(panelsData.filter(item => item.status === 1));
      }

      if (storagesData) {
        let uniqueStorageBrands = [];
        storagesData.filter(item => item.status === 1).forEach((storage) => {
          let existingBrand = uniqueStorageBrands.find(
            (brand) => brand.id === storage.brandId
          );
          if (!existingBrand) {
            uniqueStorageBrands.push({
              id: storage.brandId,
              name: storage.brand,
            });
          }
        });
        const filteredStorageBrands = brandsData.filter((brand) =>
          uniqueStorageBrands.some((uniqueBrand) => uniqueBrand.id === brand.id)
        );

        setStorageBrands(filteredStorageBrands);
        setStorages(storagesData.filter(item => item.status === 1));
      }

      if (getSuppliers) {
        setSuppliers(getSuppliers);
      }

      //edit solution wizard
      if (
        (optioncase === "editsolution" || optioncase === "resubmitsolution") &&
        selectedSolution
      ) {
        // Make sure selectedSolution.solutionDetail exists and is not null
        if (selectedSolution.solutionDetail) {
          const solutionDetail = selectedSolution.solutionDetail;

          setPhase(solutionDetail.inverter.phaseCount);

          let kvas = [];
          let brands1 = [];
          let modelnumbers = [];
          if (solutionDetail.inverter) {
            invertersData.forEach((inverter) => {
              if (inverter.phaseCount === solutionDetail.inverter.phaseCount) {
                var findId = kvas.indexOf(inverter.kva);
                if (findId === -1) {
                  kvas.push(inverter.kva);
                }
                if (inverter.kva === solutionDetail.inverter.kva) {
                  var findbrandId = brands1
                    .map((item) => item.id)
                    .indexOf(inverter.brandId);
                  if (findbrandId === -1) {
                    var selectedBrandId = brands
                      .map((item) => item.id)
                      .indexOf(inverter.brandId);
                    if (selectedBrandId > -1) {
                      brands1.push(brands[selectedBrandId]);
                    }

                    if (inverter.brand === solutionDetail.inverter.brand) {
                      var findModelNumId = modelnumbers.indexOf(
                        inverter.modelNumber
                      );
                      if (findModelNumId === -1) {
                        modelnumbers.push(inverter.modelNumber);
                      }
                    }
                  }
                }
              }
            });
          }

          kvas = kvas.sort((a, b) => a - b);
          setInverterKvas(kvas);
          setInverterBrands(brands1);
          setInverterModelnumbers(modelnumbers);

          // Add null checks for selectedSolution.solutionDetail.inverter
          if (solutionDetail.inverter) {
            const inverterDetail = solutionDetail.inverter;
            setInverterKvaSelected(inverterDetail.kva);
            setInverterBrandSelected(inverterDetail.brand);
            setInverterBrandIdSelected(inverterDetail.brandId);
            setInverterModelnumberSelected(inverterDetail.modelNumber);
            setInverterSelected(inverterDetail);
          }

          // Add null checks for selectedSolution.solutionDetail.panel
          if (solutionDetail.panel) {
            const panelDetail = solutionDetail.panel;
            setPanelBrandSelected(panelDetail.brand);
            setPanelBrandIdSelected(panelDetail.brandId);
            setPanelModelNumberSelected(panelDetail.modelNumber);
            setPanelSelected(panelDetail);

            let panelModelnumbers = [];
            panelsData &&
              panelsData.forEach((panel) => {
                if (panel.brand === panelDetail.brand) {
                  var findPanelBrandId = panelModelnumbers.indexOf(
                    panel.modelNumber
                  );
                  if (findPanelBrandId === -1) {
                    panelModelnumbers.push(panel.modelNumber);
                  }
                }
              });
            setPanelModelnumbers(panelModelnumbers);
          }

          // Add null checks for selectedSolution.solutionDetail.storage
          if (solutionDetail.storage) {
            const storageDetail = solutionDetail.storage;
            setStorageBrandSelected(storageDetail.brand);
            setStorageBrandIdSelected(storageDetail.brandId);
            setStorageModelNumberSelected(storageDetail.modelNumber);
            setStorageSelected(storageDetail);

            let storageModelnumbers = [];
            storagesData &&
              storagesData.forEach((storage) => {
                if (storage.brand === storageDetail.brand) {
                  var findStorageBrandId = storageModelnumbers.indexOf(
                    storage.modelNumber
                  );
                  if (findStorageBrandId === -1) {
                    storageModelnumbers.push(storage.modelNumber);
                  }
                }
              });
            setStorageModelnumbers(storageModelnumbers);
          }

          // Set other solution details
          setPanelCount(solutionDetail.panelCount);
          setStorageCount(solutionDetail.storageCount);

          setSolutionName(selectedSolution.name);
          setSolutionPrice(selectedSolution.price);
          setSolutionEquipmentPrice(selectedSolution.equipmentPrice);
          setsolutionDescription(selectedSolution.description);
          setSelectedSupplier(selectedSolution.supplier);
          setSelectedSolutionProvinces(selectedSolution.provinces);
        }
      }

      const defaultUser = JSON.parse(localStorage.getItem("user"));
      if (defaultUser) {
        const user = await getUserAPI(defaultUser.userId);
        if (user) {
          if (user.role === "Supplier") {
            getSuppliers &&
              getSuppliers.forEach((item) => {
                if (item.userId === user.userId) {
                  setSelectedSupplier(item);
                }
              });
          }
          setRole(user.role);
        }
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, [selectedSolution, searchProvinceInputVal, selectedSolutionProvinceId]);

  return (
    <>
      <Helmet>
        <link
          href="/assets/css/modern.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <link href="/assets/css/custom.css" rel="stylesheet" type="text/css" />
      </Helmet>
      <div className="row">
        <div className="col-md-12">
          <div className="panel panel-white">
            <div className="panel-body">
              <div id="rootwizard">
                <ul className="nav nav-tabs" role="tablist">
                  <li
                    role="presentation"
                    onClick={() => onTabStepClick(0)}
                    className={activeStep === 0 ? "active" : ""}
                  >
                    <a
                      href="#tab1"
                      data-toggle="tab"
                      style={{ padding: "10px 13px" }}
                    >
                      <i className="fa fa-user m-r-xs"></i>
                      {t("inverter")}
                    </a>
                  </li>
                  <li
                    role="presentation"
                    onClick={() => onTabStepClick(1)}
                    className={activeStep === 1 ? "active" : ""}
                  >
                    <a
                      href="#tab2"
                      data-toggle="tab"
                      style={{ padding: "10px 13px" }}
                    >
                      <i className="glyphicon glyphicon-th m-r-xs"></i>
                      {t("panel")}
                    </a>
                  </li>
                  <li
                    role="presentation"
                    onClick={() => onTabStepClick(2)}
                    className={activeStep === 2 ? "active" : ""}
                  >
                    <a
                      href="#tab2"
                      data-toggle="tab"
                      style={{ padding: "10px 13px" }}
                    >
                      <i className="glyphicon glyphicon-th m-r-xs"></i>
                      {t("storage_tab")}
                    </a>
                  </li>
                  <li
                    role="presentation"
                    onClick={() => onTabStepClick(3)}
                    className={activeStep === 3 ? "active" : ""}
                  >
                    <a
                      href="#tab2"
                      data-toggle="tab"
                      style={{ padding: "10px 13px" }}
                    >
                      <i className="glyphicon glyphicon-map-marker m-r-xs"></i>
                      {t("province")}
                    </a>
                  </li>
                  <li
                    role="presentation"
                    onClick={() => onTabStepClick(4)}
                    className={activeStep === 4 ? "active" : ""}
                  >
                    <a
                      href="#tab3"
                      data-toggle="tab"
                      style={{ padding: "10px 13px" }}
                    >
                      <i className="glyphicon glyphicon-th m-r-xs"></i>
                      {t("solution_info_tab")}
                    </a>
                  </li>
                  <li
                    role="presentation"
                    onClick={() => onTabStepClick(5)}
                    className={activeStep === 5 ? "active" : ""}
                  >
                    <a
                      href="#tab4"
                      data-toggle="tab"
                      style={{ padding: "10px 13px" }}
                    >
                      <i className="fa fa-check m-r-xs"></i>
                      {t("finish")}
                    </a>
                  </li>
                </ul>

                <div className="progress progress-sm m-t-sm">
                  <div
                    className="progress-bar progress-bar-primary"
                    role="progressbar"
                    aria-valuenow="20"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="tab-content">
                  <div
                    className={`tab-pane fade ${
                      activeStep === 0 && "active in"
                    }`}
                    id="tab1"
                  >
                    <div className="row m-b-lg">
                      <div className="col-md-6">
                        <div className="row m-b-sm">
                          <div className="col-md-3 justify-content-center m-t-sm">
                            <div className="checkbox">
                              <label style={{ paddingLeft: "0" }}>
                                <input
                                  type="radio"
                                  checked={phase === 1 && true}
                                  onChange={() => onChangePhase(1)}
                                />
                                &nbsp;&nbsp;{t("phase_1")}
                              </label>
                            </div>
                          </div>
                          <div className="col-md-3 justify-content-center m-t-sm">
                            <div className="checkbox">
                              <label style={{ paddingLeft: "0" }}>
                                <input
                                  type="radio"
                                  checked={phase === 3 && true}
                                  onChange={() => onChangePhase(3)}
                                />
                                &nbsp;&nbsp;{t("phase_3")}
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <DropDown
                              label={t("inverter_kva")}
                              selectedVal={
                                inverterKvaSelected &&
                                `${inverterKvaSelected}kVA`
                              }
                              handleOptionClick={handleInverterKvaSelect}
                              datas={inverterKvas}
                              placeholder={t("inverter_kva")}
                              optioncase="wizardInvertKva"
                              disabled={phase !== 0 ? false : true}
                            />
                          </div>
                        </div>
                        <DropDown
                          label={t("inverter_brand")}
                          selectedVal={inverterBrandSelected}
                          handleOptionClick={handleInverterBrandSelect}
                          datas={inverterBrands}
                          placeholder="Inverter"
                          optioncase="name"
                          disabled={inverterKvaSelected !== 0 ? false : true}
                        />
                        <div className="w-100">
                          <DropDown
                            label={t("model_number")}
                            selectedVal={inverterModelnumberSelected}
                            handleOptionClick={handleInverterModelnumberSelect}
                            datas={inverterModelnumbers}
                            placeholder="Inverter"
                            optioncase=""
                            disabled={
                              inverterBrandIdSelected !== 0 ? false : true
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-6 mt-6">
                        <h3>
                          {t("model_number")}:&nbsp;&nbsp;
                          {inverterSelected ? inverterSelected.modelNumber : ""}
                        </h3>
                        <p>
                          {t("inverter_brand")}:&nbsp;&nbsp;{" "}
                          {inverterSelected ? inverterSelected.brand : ""}
                        </p>
                        <div className="row">
                          <div className="col-xs-6 col-md-4">
                            <p>
                              Volts:&nbsp;&nbsp;
                              {inverterSelected ? inverterSelected.volts : 0}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-4">
                            <p>
                              kVA:&nbsp;&nbsp;
                              {inverterSelected ? inverterSelected.kva : 0}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-4">
                            <p>
                              Voc:&nbsp;&nbsp;
                              {inverterSelected ? inverterSelected.voc : 0}
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-6 col-md-4">
                            <p>
                              Max MPPT Volts:&nbsp;&nbsp;
                              {inverterSelected
                                ? inverterSelected.maxMPPTVolts
                                : 0}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-4">
                            <p>
                              Max MPPT Watts:&nbsp;&nbsp;
                              {inverterSelected
                                ? inverterSelected.maxMPPTWatts
                                : 0}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-4">
                            <p>
                              Max MPPT Amps:&nbsp;&nbsp;
                              {inverterSelected
                                ? inverterSelected.maxMPPTAmps
                                : 0}
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-6 col-md-4">
                            <p>
                              {t("string_label")}(MPPT):&nbsp;&nbsp;
                              {inverterSelected ? inverterSelected.strings : 0}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-4">
                            <p>
                              Operating Voltage Range:&nbsp;&nbsp;
                              {inverterSelected
                                ? inverterSelected.pvOperatingVoltageRange
                                : ""}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-4">
                            <p>
                              {t("efficiency")}:&nbsp;&nbsp;
                              {inverterSelected
                                ? inverterSelected.efficiency
                                : ""}
                            </p>
                          </div>
                        </div>
                        {/* <div className="checkbox">
                                                        <label className="m-r-lg m-t-sm" style={{paddingLeft: '0px'}}>
                                                            Total String(MPPT)&nbsp;&nbsp;&nbsp;
                                                            <input className="form-control" type="number" onChange={onChangeStringCount} value={stringCount} />
                                                        </label>
                                                    </div> */}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`tab-pane fade ${
                      activeStep === 1 && "active in"
                    }`}
                    id="tab2"
                  >
                    <div className="row">
                      <div className="col-md-6">
                        <DropDown
                          label={t("panel_brand")}
                          selectedVal={panelBrandSelected}
                          handleOptionClick={handlePanelBrandSelect}
                          datas={panelBrands}
                          optioncase="name"
                          placeholder="Search Panel Brand"
                          disabled={false}
                        />
                        <DropDown
                          label={t("panel_model_number")}
                          selectedVal={panelModelNumberSelected}
                          handleOptionClick={handlePanelSelect}
                          datas={panelModelnumbers}
                          optioncase=""
                          placeholder="Panel"
                          disabled={panelBrandIdSelected !== 0 ? false : true}
                        />
                        <label htmlFor="panel_counts">
                          {t("panel_counts")}
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="panelcounts"
                          id="panel_counts"
                          placeholder=""
                          onChange={onChangePanelCount}
                          value={panelCount}
                        />
                      </div>
                      <div className="col-md-6 mt-4">
                        <h3>
                          {t("panel_model_number")}:{" "}
                          {panelSelected ? panelSelected.modelNumber : ""}
                        </h3>
                        <p>
                          {t("panel_brand")}:&nbsp;&nbsp;{" "}
                          {panelSelected ? panelSelected.brand : ""}
                        </p>
                        <div className="row">
                          <div className="col-xs-6 col-md-4">
                            <p>
                              Watts:&nbsp;&nbsp;
                              {panelSelected ? panelSelected.watts : 0}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-4">
                            <p>
                              VOC:&nbsp;&nbsp;
                              {panelSelected ? panelSelected.voc : 0}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-4">
                            <p>
                              Amps:&nbsp;&nbsp;
                              {panelSelected ? panelSelected.amps : 0}
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-6 col-md-3">
                            <p>
                              {t("width")}:&nbsp;&nbsp;
                              {panelSelected ? panelSelected.width : 0}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-3">
                            <p>
                              {t("height")}:&nbsp;&nbsp;
                              {panelSelected ? panelSelected.height : 0}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-3">
                            <p>
                              {t("depth")}:&nbsp;&nbsp;
                              {panelSelected ? panelSelected.depth : 0}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-3">
                            <p>
                              {t("weight")}:&nbsp;&nbsp;
                              {panelSelected ? panelSelected.weight : 0}
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-6 col-md-6">
                            <p>
                              {t("color")}:&nbsp;&nbsp;
                              {panelSelected ? panelSelected.color : ""}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-6">
                            <p>
                              {t("frame_color")}:&nbsp;&nbsp;
                              {panelSelected ? panelSelected.frameColor : ""}
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-6 col-md-3">
                            <p>
                              {t("connectors")}:&nbsp;&nbsp;
                              {panelSelected ? panelSelected.connectors : 0}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-3">
                            <p>
                              {t("type")}:&nbsp;&nbsp;
                              {panelSelected ? panelSelected.type : ""}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-3">
                            <p>
                              {t("technology")}:&nbsp;&nbsp;
                              {panelSelected ? panelSelected.technology : ""}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-3">
                            <p>
                              {t("efficiency")}:&nbsp;&nbsp;
                              {panelSelected ? panelSelected.efficiency : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`tab-pane fade ${
                      activeStep === 2 && "active in"
                    }`}
                    id="tab3"
                  >
                    <div className="row">
                      <div className="col-md-12">
                        <Alert
                          severity="info"
                          style={{
                            backgroundColor: "rgb(217 251 254)",
                            marginBottom: '15px'
                          }}
                        >
                          {t("storage_form_text")}
                        </Alert>
                      </div>
                      <div className="col-md-6">
                        <DropDown
                          label={t("storage_brand")}
                          selectedVal={storageBrandSelected}
                          handleOptionClick={handleStorageBrandSelect}
                          datas={storageBrands}
                          optioncase="name"
                          placeholder="Search Storage Brand"
                          disabled={false}
                        />
                        <DropDown
                          label={t("storage_model_number")}
                          selectedVal={storageModelNumberSelected}
                          handleOptionClick={handleStorageSelect}
                          datas={storageModelnumbers}
                          placeholder="Storage"
                          disabled={storageBrandIdSelected !== 0 ? false : true}
                        />
                        <label htmlFor="storage_counts">
                          {t("storage_counts")}
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="storagecounts"
                          id="storage_counts"
                          placeholder=""
                          onChange={onChangeStorageCount}
                          value={storageCount}
                        />
                      </div>
                      <div className="col-md-6 mt-6">
                        <h3>
                          {t("storage_model_number")}:{" "}
                          {storageSelected ? storageSelected.modelNumber : ""}
                        </h3>
                        <p>
                          {t("storage_brand")}:&nbsp;&nbsp;{" "}
                          {storageSelected ? storageSelected.brand : ""}
                        </p>
                        <div className="row">
                          <div className="col-xs-6 col-md-4">
                            <p>
                              Watts:&nbsp;&nbsp;
                              {storageSelected ? storageSelected.watts : 0}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-4">
                            <p>
                              Volts:&nbsp;&nbsp;
                              {storageSelected ? storageSelected.volts : 0}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-4">
                            <p>
                              Amps:&nbsp;&nbsp;
                              {storageSelected ? storageSelected.amps : 0}
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-6 col-md-4">
                            <p>
                              Max Charging Voltage:&nbsp;&nbsp;
                              {storageSelected
                                ? storageSelected.maxChargingVoltage
                                : 0}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-4">
                            <p>
                              Float Charging Voltage:&nbsp;&nbsp;
                              {storageSelected
                                ? storageSelected.floatChargingVoltage
                                : 0}
                            </p>
                          </div>
                          <div className="col-xs-6 col-md-4">
                            <p>
                              Max Charging Amps:&nbsp;&nbsp;
                              {storageSelected
                                ? storageSelected.maxChargeAmps
                                : 0}
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <p>
                              {t("weight")}:&nbsp;&nbsp;
                              {storageSelected ? storageSelected.weight : 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`tab-pane fade ${
                      activeStep === 3 && "active in"
                    }`}
                    id="tab3"
                  >
                    <div className="row">
                      <div className="col-md-12">
                        <SearchInputListDropdown
                          label=""
                          selectedVal={selectedSolutionProvince}
                          searchInputVal={searchProvinceInputVal}
                          handleChangeName={onChangeSolutionProvince}
                          handleOptionClick={onSelectSolutionProvince}
                          datas={allProvinces}
                          placeholder={t("select_province_label")}
                          optioncase="all"
                        />
                      </div>
                      <div className="col-md-12 mt-4">
                        <label>{t("selected_provinces_label")}</label>
                        <div
                          className="bootstrap-tagsinput"
                          style={{ minHeight: "33.5px", display: 'flex', flexWrap: 'wrap'}}
                        >
                          {selectedSolutionProvinces &&
                            selectedSolutionProvinces.map((province) => {
                              return (
                                <div
                                  className="tag label label-info pt-1 pb-1 mr-2 text-sm mb-2"
                                  key={province.id}
                                >
                                  {province.name}
                                  <i
                                    className="fa fa-close ml-6"
                                    onClick={() =>
                                      onCloseSolutionProvince(province.id)
                                    }
                                  ></i>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`tab-pane fade ${
                      activeStep === 4 && "active in"
                    }`}
                    id="tab4"
                  >
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group col-md-12">
                          {(role === "Admin" || role === "Superadmin") && (
                            <div className="row">
                              <div className="col-md-12">
                                <DropDown
                                  label={t("suppliers_list")}
                                  selectedVal={
                                    selectedSupplier &&
                                    selectedSupplier.companyName
                                  }
                                  handleOptionClick={handleSupplierSelect}
                                  datas={suppliers}
                                  placeholder="suppliers"
                                  optioncase="supplierName"
                                />
                              </div>
                            </div>
                          )}
                          <div className="row">
                            <div className="col-md-6">
                              <label htmlFor="solution_price">
                                {t("solution_name_validation", {
                                  solutionLength: solutionNameLength,
                                })}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="solution_name"
                                id="solution_name"
                                placeholder=""
                                onChange={onchangeSolutionName}
                                value={solutionName}
                              />
                            </div>
                            <div className="col-md-3">
                              <label htmlFor="solution_equipmentprice">
                                {t("equipment_price_label")}
                              </label>
                              <input
                                type="number"
                                className="form-control col-md-4"
                                name="solution_equipmentprice"
                                id="solution_equipmentprice"
                                onChange={onchangeSolutionEquipmentPrice}
                                value={solutionEquipmentPrice}
                              />
                            </div>
                            <div className="col-md-3">
                              <label htmlFor="solution_price">
                                {t("price_label")}
                              </label>
                              <input
                                type="number"
                                className="form-control col-md-4"
                                name="solution_price"
                                id="solution_price"
                                onChange={onchangeSolutionPrice}
                                value={solutionPrice}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-md-12">
                          <label htmlFor="solution_description">
                            {t("description_label")}
                          </label>
                          <br />
                          <textarea
                            rows={5}
                            value={solutionDescription}
                            onChange={onchangeSolutionDescription}
                            id="solution_description"
                            className="form-control"
                            style={{ width: "100%" }}
                          >
                            {solutionDescription}
                          </textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`tab-pane fade ${
                      activeStep === 5 && "active in"
                    }`}
                    id="tab5"
                  >
                    <h2 className="no-s">{t("thank_you")}</h2>
                    <div
                      className="alert alert-success m-t-sm m-b-lg"
                      role="alert"
                    >
                      {t("solution_save_description")}
                    </div>
                  </div>
                  <ul className="pager wizard">
                    {activeStep !== 0 && activeStep !== 5 && (
                      <li
                        className={`previous ${
                          activeStep === 0 ? "disabled" : ""
                        }`}
                      >
                        <a
                          href="/#"
                          className="btn btn-default"
                          onClick={onPrevBtnClick}
                        >
                          {t("previous")}
                        </a>
                      </li>
                    )}
                    {activeStep !== 4 ? (
                      activeStep !== 5 && (
                        <li
                          className={`next ${
                            activeStep === 4 ? "disabled" : ""
                          }`}
                        >
                          <a
                            href="/#"
                            className="btn btn-default"
                            onClick={onNextBtnClick}
                          >
                            {t("next")}
                          </a>
                        </li>
                      )
                    ) : (
                      <li className="next">
                        <a
                          href="/#"
                          className="btn btn-default"
                          onClick={onFormSubmit}
                        >
                          {optioncase && optioncase === "resubmitsolution"
                            ? t("resubmit")
                            : t("finish")}
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Helmet>
        {/* <script src="/assets/plugins/jquery/jquery-2.1.4.min.js"></script>
                <script src="/assets/plugins/jquery-ui/jquery-ui.min.js"></script> */}

        {/* <script type="text/javascript" src="/assets/js/modern.js" async></script>
                <script type="text/javascript" src="/assets/js/pages/form-wizard.js" async></script> */}
      </Helmet>
    </>
  );
};

export default FormWizard;
