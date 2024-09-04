import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const SearchClientListDropdown = (props) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState([]);
  const [label, setLabel] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const { disabled, selectedVal, optioncase, searchInputVal} = props;
  let { datas } = props;

  const handleSelect = (option) => {
    props.handleOptionClick(option);
    setIsOpen(false);
  };

  useEffect(() => {
    setLabel(props.label);
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
      <div className="form-group" ref={wrapperRef}>
        <label>{label}</label>
        <div className="custom-dropdown text-left">
          <div className="flex justify-between">
            <input
              className="form-control"
              onClick={() => setIsOpen(!isOpen)}
              onChange={props.handleChangeName}
              value={!selectedVal ? "" : selectedVal}
              disabled={disabled}
              placeholder={t("select_option_label")}
            />
          </div>
          {isOpen && (
            <ul className="z-10 absolute left-0 w-full bg-white border border-[#efefef] rounded-lg m-0">
              <li
                className="py-2 px-4 text-left cursor-pointer hover:text-slate-500 hover:bg-gray-100 border-b"
                onClick={() => handleSelect("All")}
              >
                All
              </li>
              {options &&
                options.map((option, index) => (
                  <li
                    className="py-2 px-4 text-left cursor-pointer hover:text-slate-500 hover:bg-gray-100 border-b"
                    key={option.id || index}
                    onClick={(event) => handleSelect(option)}
                  >
                    {option.name}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchClientListDropdown;
