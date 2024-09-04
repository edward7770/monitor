import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const SolutionDetailInfo = (props) => {
  const { t } = useTranslation();
  const { solutionSelected } = props;

  const formatThousandNumber = (number) => {
    if (number === null || number === undefined) {
      return "";
    }

    return number.toLocaleString("en-US", {
      maximumFractionDigits: 3,
    });
  };

  const formatOnepointNumber = (number) => {
    if (number === null || number === undefined) {
      return "";
    }

    return number.toLocaleString("en-US", {
      minimumFractionDigits: 1,
    });
  };

  const formatTwopointNumber = (number) => {
    if (number === null || number === undefined) {
      return "";
    }

    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });
  };

  const [docPreviewPath, setDocPreviewPath] = useState(null);

  const onInputPreviewDocPath = (path) => {
    setDocPreviewPath(path);
  };

  useEffect(() => {}, []);

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-5">
      <div className="sm:mb-0 mb-3">
        <div
          className={`bg-cyan-50 shadow-md hover:bg-cyan-100 mb-5 hover:shadow-lg rounded-xl p-6 transition ease-in-out delay-50 hover:translate-y-1 hover:scale-105 duration-200 ${
            solutionSelected &&
            solutionSelected.solutionDetail.panel.documentations.length > 0
              ? "lg:min-h-[620px]"
              : "lg:min-h-[520px]"
          }`}
        >
          <div className="font-bold text-lg border-b-2 p-3 mb-2 rounded-lg">
            {t("inverter")}
          </div>
          <ul className="marker:text-sky-400 list-disc space-x-3 m-0 p-2 pl-5">
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">{t("brand")}:</b>{" "}
              {solutionSelected &&
                solutionSelected.solutionDetail.inverter.brand}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">{t("model_number")}:</b>{" "}
              {solutionSelected &&
                solutionSelected.solutionDetail.inverter.modelNumber}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">{t("phase")}:</b>{" "}
              {solutionSelected &&
                solutionSelected.solutionDetail.inverter.phaseCount}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">{t("string_count")}:</b>{" "}
              {solutionSelected &&
                solutionSelected.solutionDetail.inverter.strings}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">Volts:</b>{" "}
              {solutionSelected &&
                solutionSelected.solutionDetail.inverter.volts}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">Watts:</b>{" "}
              {solutionSelected &&
                formatThousandNumber(
                  solutionSelected.solutionDetail.inverter.kva
                )}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">VOC:</b>{" "}
              {solutionSelected &&
                formatOnepointNumber(
                  solutionSelected.solutionDetail.inverter.voc
                )}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">Max MPPT Volts:</b>{" "}
              {solutionSelected &&
                solutionSelected.solutionDetail.inverter.maxMPPTVolts}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">Max MPPT Watts:</b>{" "}
              {solutionSelected &&
                formatThousandNumber(
                  solutionSelected.solutionDetail.inverter.maxMPPTWatts
                )}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">Max MPPT Amps:</b>{" "}
              {solutionSelected &&
                formatTwopointNumber(
                  solutionSelected.solutionDetail.inverter.maxMPPTAmps
                )}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">Operating Voltage Range:</b>{" "}
              {solutionSelected &&
                solutionSelected.solutionDetail.inverter
                  .pvOperatingVoltageRange}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">{t("efficiency")}:</b>{" "}
              {solutionSelected &&
                `${formatTwopointNumber(
                  solutionSelected.solutionDetail.inverter.efficiency
                )}%`}
            </li>
            {solutionSelected &&
              solutionSelected.solutionDetail.inverter.documentations.length !==
                0 && (
                <li className="text-sm mb-1 pl-2">
                  <b className="font-medium">{t("documentations")}</b>{" "}
                  {solutionSelected.solutionDetail.inverter.documentations
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((documentation, index) => (
                      <>
                        <div
                          className="flex align-middle justify-between items-center p-1 border-1 border-b-gray-500"
                          key={index}
                        >
                          <div className="flex">
                            <i className="fa fa-file-pdf-o"></i>
                            <div className="ml-2">
                              <h6>{documentation.name}</h6>
                            </div>
                          </div>
                          <div className="float-right">
                            <button
                              className="mr-4 text-sm"
                              type="button"
                              data-toggle="modal"
                              data-target="#deviceDocPreviewModal"
                              onClick={() =>
                                onInputPreviewDocPath(documentation.file)
                              }
                            >
                              <span className="fa fa-eye" />
                            </button>
                          </div>
                        </div>
                        <hr />
                      </>
                    ))}
                </li>
              )}
          </ul>
        </div>
      </div>
      <div className="sm:mb-0 mb-3">
        <div
          className={`bg-cyan-50 shadow-md hover:bg-cyan-100 mb-5 hover:shadow-lg rounded-xl p-6 transition ease-in-out delay-50 hover:translate-y-1 hover:scale-105 duration-200 ${
            solutionSelected &&
            solutionSelected.solutionDetail.panel.documentations.length > 0
              ? "lg:min-h-[620px]"
              : "lg:min-h-[520px]"
          }`}
        >
          <div className="font-bold text-lg border-b-2 p-3 mb-2">
            {t("panel")}
          </div>
          <ul className="marker:text-sky-400 list-disc space-x-3 m-0 p-2 pl-5">
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">{t("brand")}:</b>{" "}
              {solutionSelected && solutionSelected.solutionDetail.panel.brand}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">{t("model_number")}:</b>{" "}
              {solutionSelected &&
                solutionSelected.solutionDetail.panel.modelNumber}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">{t("qty")}:</b>{" "}
              {solutionSelected && solutionSelected.solutionDetail.panelCount}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">Watts:</b>{" "}
              {solutionSelected && solutionSelected.solutionDetail.panel.watts}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">VOC:</b>{" "}
              {solutionSelected && solutionSelected.solutionDetail.panel.voc}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">
                Amps(I<span className="text-[8px]">MPP</span>):
              </b>{" "}
              {solutionSelected &&
                formatTwopointNumber(
                  solutionSelected.solutionDetail.panel.amps
                )}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">{t("width")}:</b>{" "}
              {solutionSelected &&
                formatThousandNumber(
                  solutionSelected.solutionDetail.panel.width
                )}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">{t("height")}:</b>{" "}
              {solutionSelected &&
                formatThousandNumber(
                  solutionSelected.solutionDetail.panel.height
                )}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">{t("depth")}:</b>{" "}
              {solutionSelected &&
                formatThousandNumber(
                  solutionSelected.solutionDetail.panel.depth
                )}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">{t("weight")}:</b>{" "}
              {solutionSelected &&
                formatTwopointNumber(
                  solutionSelected.solutionDetail.panel.weight
                )}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">{t("frame_color")}:</b>{" "}
              {solutionSelected &&
                solutionSelected.solutionDetail.panel.frameColor}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">{t("color")}:</b>{" "}
              {solutionSelected && solutionSelected.solutionDetail.panel.color}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">{t("connectors")}:</b>{" "}
              {solutionSelected &&
                solutionSelected.solutionDetail.panel.connectors}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">{t("type")}:</b>{" "}
              {solutionSelected && solutionSelected.solutionDetail.panel.type}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">{t("technology")}:</b>{" "}
              {solutionSelected &&
                solutionSelected.solutionDetail.panel.technology}
            </li>
            <li className="text-sm mb-1 pl-2">
              <b className="font-medium">{t("efficiency")}:</b>{" "}
              {solutionSelected &&
                `${formatTwopointNumber(
                  solutionSelected.solutionDetail.panel.efficiency
                )}%`}
            </li>
            {solutionSelected &&
              solutionSelected.solutionDetail.panel.documentations.length !==
                0 && (
                <li className="text-sm mb-1 pl-2">
                  <b className="font-medium">{t("documentations")}</b>{" "}
                  {solutionSelected.solutionDetail.panel.documentations
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((documentation, index) => (
                      <>
                        <div
                          className="flex align-middle justify-between items-center p-1 border-1 border-b-gray-500"
                          key={index}
                        >
                          <div className="flex">
                            <i className="fa fa-file-pdf-o"></i>
                            <div className="ml-2">
                              <h6>{documentation.name}</h6>
                            </div>
                          </div>
                          <div className="float-right">
                            <button
                              className="mr-4 text-sm"
                              type="button"
                              data-toggle="modal"
                              data-target="#deviceDocPreviewModal"
                              onClick={() =>
                                onInputPreviewDocPath(documentation.file)
                              }
                            >
                              <span className="fa fa-eye" />
                            </button>
                          </div>
                        </div>
                        <hr />
                      </>
                    ))}
                </li>
              )}
          </ul>
        </div>
      </div>
      {(solutionSelected === null ||
        (solutionSelected && solutionSelected.solutionDetail.storage)) && (
          <div className="sm:mb-0 mb-3">
            <div
              className={`bg-cyan-50 shadow-md hover:bg-cyan-100 mb-5 hover:shadow-lg rounded-xl p-6 transition ease-in-out delay-50 hover:translate-y-1 hover:scale-105 duration-200 ${
                solutionSelected &&
                solutionSelected.solutionDetail.panel.documentations.length > 0
                  ? "lg:min-h-[620px]"
                  : "lg:min-h-[520px]"
              }`}
            >
              <div className="font-bold text-lg border-b-2 p-3 mb-2">
                {t("storage")}
              </div>
              <ul className="marker:text-sky-400 list-disc space-x-3 m-0 p-2 pl-5">
                <li className="text-sm mb-1 pl-2">
                  <b className="font-medium">{t("brand")}:</b>{" "}
                  {solutionSelected &&
                    solutionSelected.solutionDetail.storage?.brand}
                </li>
                <li className="text-sm mb-1 pl-2">
                  <b className="font-medium">{t("model_number")}:</b>{" "}
                  {solutionSelected &&
                    solutionSelected.solutionDetail.storage?.modelNumber}
                </li>
                <li className="text-sm mb-1 pl-2">
                  <b className="font-medium">{t("qty")}:</b>{" "}
                  {solutionSelected &&
                    solutionSelected.solutionDetail.storageCount}
                </li>
                <li className="text-sm mb-1 pl-2">
                  <b className="font-medium">Watts:</b>{" "}
                  {solutionSelected &&
                    formatThousandNumber(
                      solutionSelected.solutionDetail.storage?.watts
                    )}
                </li>
                <li className="text-sm mb-1 pl-2">
                  <b className="font-medium">Volts:</b>{" "}
                  {solutionSelected &&
                    solutionSelected.solutionDetail.storage?.volts}
                </li>
                <li className="text-sm mb-1 pl-2">
                  <b className="font-medium">Amps:</b>{" "}
                  {solutionSelected &&
                    solutionSelected.solutionDetail.storage?.amps}
                </li>
                <li className="text-sm mb-1 pl-2">
                  <b className="font-medium">Max Charging Voltage:</b>{" "}
                  {solutionSelected &&
                    formatTwopointNumber(
                      solutionSelected.solutionDetail.storage
                        ?.maxChargingVoltage
                    )}
                </li>
                <li className="text-sm mb-1 pl-2">
                  <b className="font-medium">Float Charging Voltage:</b>{" "}
                  {solutionSelected &&
                    formatTwopointNumber(
                      solutionSelected.solutionDetail.storage
                        ?.floatChargingVoltage
                    )}
                </li>
                <li className="text-sm mb-1 pl-2">
                  <b className="font-medium">Max Charge Amps:</b>{" "}
                  {solutionSelected &&
                    solutionSelected.solutionDetail.storage?.maxChargeAmps}
                </li>
                <li className="text-sm mb-1 pl-2">
                  <b className="font-medium">{t("weight")}:</b>{" "}
                  {solutionSelected &&
                    `${formatTwopointNumber(
                      solutionSelected.solutionDetail.storage?.weight
                    )}(kg)`}
                </li>
                {solutionSelected &&
                  solutionSelected.solutionDetail.storage?.documentations
                    .length !== 0 && (
                    <li className="text-sm mb-1 pl-2">
                      <b className="font-medium">{t("documentations")}</b>{" "}
                      {solutionSelected.solutionDetail.storage?.documentations
                        .slice()
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((documentation, index) => (
                          <>
                            <div
                              className="flex align-middle justify-between items-center p-1 border-1 border-b-gray-500"
                              key={index}
                            >
                              <div className="flex">
                                <i className="fa fa-file-pdf-o"></i>
                                <div className="ml-2">
                                  <h6>{documentation.name}</h6>
                                </div>
                              </div>
                              <div className="float-right">
                                <button
                                  className="mr-4 text-sm"
                                  type="button"
                                  data-toggle="modal"
                                  data-target="#deviceDocPreviewModal"
                                  onClick={() =>
                                    onInputPreviewDocPath(documentation.file)
                                  }
                                >
                                  <span className="fa fa-eye" />
                                </button>
                              </div>
                            </div>
                            <hr />
                          </>
                        ))}
                    </li>
                  )}
              </ul>
            </div>
          </div>
        )}

      <div
        className="modal fade"
        id="deviceDocPreviewModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              {/* <h4 className="modal-title" id="myModalLabel">
                Leave a note for rejected reason
              </h4> */}
            </div>
            <div className="modal-body">
              <iframe
                title="Solution Doc Preview"
                src={
                  docPreviewPath
                    ? `${process.env.REACT_APP_BACKEND_API}/uploads/${docPreviewPath}`
                    : ""
                }
                width="100%"
                height="600px"
              ></iframe>
            </div>
            <div className="modal-footer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionDetailInfo;
