import React, { useEffect, useState } from "react";
import DropDownSelect from "./DropDownSelect";
import { useTranslation } from "react-i18next";

const SearchSolutionForm = (props) => {
  const { t } = useTranslation();
  const {
    phase,
    inverterKva,
    inverterBrand,
    panelBrand,
    panelKwh,
    storageBrand,
    storageKwh,
    inverterKvas,
    inverterBrands,
    panelBrands,
    panelKwhs,
    storageBrands,
    storageKwhs,
    priceInstall
  } = props;

  const [phases, setPhases] = useState([]);
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    setPhases([
      { value: 1, name: t("phase_1")},
      { value: 3, name: t("phase_3")},
    ]);

    setPrices([
      { value: true, name: t("with_installation")},
      { value: false, name: t("without_installation")},
    ]);
  }, [t]);

  return (
    <div
      className="panel panel-white rounded-3xl"
      // style={{ borderRadius: "25px" }}
    >
      <div className="panel-heading">
        <span className="text-2xl ml-4">{t("search")}</span>
      </div>
      <div className="panel-body">
        <div className="grid lg:grid-cols-8 sm:grid-cols-12 gap-2 content-center">
          {/* <div className="lg:col-span-3 sm:col-span-6 p-h-md grid grid-cols-7 gap-2 checkphase-box md:mt-[10px] my-[10px]">
            <div className="col-span-3 sm:text-sm text-xs mx-auto content-center my-1.5 py-1 px-1">
              <div className="flex items-center w-full my-3">
                <input
                  style={{ marginTop: "0px" }}
                  checked={phase === 1 && true}
                  onChange={() => props.onChangePhase(1)}
                  id="default-radio-1"
                  type="radio"
                  name="default-radio-1"
                  className="text-blue-600 bg-gray-100 border-gray-300 rounded-2xl dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="default-radio-1"
                  className="mb-0 text-base font-medium dark:text-gray-300"
                >
                  &nbsp;{t("phase_1")}
                </label>
              </div>
              <div className="flex items-center w-full my-3">
                <input
                  style={{ marginTop: "0px" }}
                  checked={priceInstall === true ? true : false}
                  onChange={() => props.onChangePriceInstall(true)}
                  id="default-radio-2"
                  type="radio"
                  name="default-radio-2"
                  className="text-blue-600 bg-gray-100 border-gray-300 rounded-2xl dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="default-radio-2"
                  className="mb-0 text-sm font-medium dark:text-gray-300 pl-1"
                >
                  {t("with_installation")}
                </label>
              </div>
            </div>
            <div className="col-span-3 sm:text-sm text-xs mx-auto content-center my-1.5 py-1 px-1">
              <div className="flex items-center w-full pr-1 my-3">
                <input
                  style={{ marginTop: "0px" }}
                  checked={phase === 3 && true}
                  onChange={() => props.onChangePhase(3)}
                  id="default-radio-3"
                  type="radio"
                  name="default-radio-3"
                  className="text-blue-600 bg-gray-100 border-gray-300 rounded-2xl dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="default-radio-3"
                  className="mb-0 text-base font-medium dark:text-gray-300"
                >
                  &nbsp;{t("phase_3")}
                </label>
              </div>
              <div className="flex items-center w-full my-3">
                <input
                  style={{ marginTop: "0px" }}
                  checked={priceInstall === false ? true : false}
                  onChange={() => props.onChangePriceInstall(false)}
                  id="default-radio-4"
                  type="radio"
                  name="default-radio-4"
                  className="text-blue-600 bg-gray-100 border-gray-300 rounded-2xl dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="default-radio-4"
                  className="mb-0 text-sm font-medium dark:text-gray-300"
                >
                  &nbsp;{t("without_installation")}
                </label>
              </div>
            </div>
            <div className="col-span-1 m-0 content-center mx-auto w-full">
              <button
                className="reload-phase-button m-0 rounded-md py-2 w-full"
                onClick={props.onReloadPhaseButton}
              >
                {t("all")}
              </button>
            </div>
          </div> */}
          <div className="lg:col-span-2 sm:col-span-6 p-h-lg border-left">
            <DropDownSelect
              key="phase"
              label={t("phase")}
              selectedVal={phase && phase === 1 ? t("phase_1") : phase === 3 && t("phase_3")}
              handleOptionClick={props.onChangePhase}
              datas={phases}
              placeholder={t("inverter_watts_label")}
              optioncase="name"
            />
            <DropDownSelect
              key="price"
              label={t("install_price")}
              selectedVal={priceInstall && priceInstall === true ? t("with_installation") : priceInstall === false && t("without_installation")}
              handleOptionClick={props.onChangePriceInstall}
              datas={prices}
              placeholder={t("inverter_brand_label")}
              optioncase="name"
            />
          </div>
          <div className="lg:col-span-2 sm:col-span-6 p-h-lg border-left">
            <DropDownSelect
              key="inverterKva"
              label={t("inverter_watts")}
              selectedVal={inverterKva && inverterKva + " watts"}
              handleOptionClick={props.handleInverterKvaSelect}
              datas={inverterKvas}
              placeholder={t("inverter_watts_label")}
              optioncase="inverterkva"
            />
            <DropDownSelect
              key="inverterBrand"
              label={t("inverter_brand")}
              selectedVal={inverterBrand}
              handleOptionClick={props.handleInverterBrandSelect}
              datas={inverterBrands}
              placeholder={t("inverter_brand_label")}
              optioncase="name"
            />
          </div>
          <div className="lg:col-span-2 sm:col-span-6 p-h-lg border-left">
            <DropDownSelect
              key="panelBrand"
              label={t("panel_brand")}
              selectedVal={panelBrand}
              handleOptionClick={props.handlePanelBrandSelect}
              datas={panelBrands}
              placeholder={t("panel_brand_label")}
              optioncase="name"
            />
            <DropDownSelect
              key="panelKwh"
              label={t("panel_wp")}
              selectedVal={panelKwh}
              handleOptionClick={props.handleSelectedPanelKwh}
              datas={panelKwhs}
              placeholder={t("panel_wp_label")}
              optioncase=""
            />
          </div>
          <div className="lg:col-span-2 sm:col-span-6 p-h-lg border-left">
            <DropDownSelect
              key="storageBrand"
              label={t("storage_brand")}
              selectedVal={storageBrand}
              handleOptionClick={props.handleStorageBrandSelect}
              datas={storageBrands}
              placeholder={t("storage_brand_label")}
              optioncase="name"
            />
            <DropDownSelect
              key="storageKwh"
              label={t("storage_wh")}
              selectedVal={storageKwh}
              handleOptionClick={props.handleSelectedStorageKwh}
              datas={storageKwhs}
              placeholder={t("storage_wh_label")}
              optioncase=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSolutionForm;
