import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const SearchInputListDropdown = (props) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState([]);
  const [label, setLabel] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const { disabled, selectedVal, optioncase, searchInputVal, placeholder } =
    props;
  let { datas } = props;

  const handleSelect = (option) => {
    props.handleOptionClick(option);
    setIsOpen(false);
  };

  useEffect(() => {
    setLabel(props.label);
    if (optioncase === "supplier") {
      if (searchInputVal !== "") {
        for (let i = datas.length - 1; i >= 0; i--) {
          if (
            !datas[i].companyName
              .toLowerCase()
              .includes(searchInputVal.toLocaleLowerCase())
          ) {
            datas.splice(i, 1);
          }
        }
      }

      datas.sort((a, b) =>
        a.companyName.toLowerCase().localeCompare(b.companyName.toLowerCase())
      );
    } else {
      if (searchInputVal !== "") {
        for (let i = datas.length - 1; i >= 0; i--) {
          if (
            !datas[i].name
              .toLowerCase()
              .includes(searchInputVal.toLocaleLowerCase())
          ) {
            datas.splice(i, 1);
          }
        }
      }

      datas.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    }
    setOptions(datas);

    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [datas, props.label, optioncase, selectedVal, searchInputVal]);

  return (
    <>
      <div
        className="form-group"
        ref={wrapperRef}
        style={{ marginBottom: "0px" }}
      >
        <label>{label}</label>
        <div className="custom-dropdown text-left">
          <div className="flex justify-between">
            <input
              className="form-control"
              onClick={() => setIsOpen(!isOpen)}
              onChange={props.handleChangeName}
              value={!selectedVal ? "" : selectedVal}
              disabled={disabled}
              placeholder={placeholder ? placeholder : t("select_option_label")}
            />
          </div>
          {isOpen && (
            <ul className="z-10 absolute left-0 w-full bg-white border border-[#efefef] rounded-lg m-0 max-h-60 overflow-y-scroll">
              {optioncase === "all" && (
                <li
                  className="py-2 px-4 text-left cursor-pointer hover:text-slate-500 hover:bg-gray-100 border-b"
                  onClick={(event) => handleSelect("")}
                >
                  All
                </li>
              )}
              {options &&
                options.map((option, index) => (
                  <li
                    className="py-2 px-4 text-left cursor-pointer hover:text-slate-500 hover:bg-gray-100 border-b"
                    key={option.id || index}
                    onClick={(event) => handleSelect(option)}
                  >
                    {optioncase === "supplier" ? (
                      <>{option.companyName}</>
                    ) : (
                      <>{option.name}</>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchInputListDropdown;
