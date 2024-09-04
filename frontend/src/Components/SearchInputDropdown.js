import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const SearchInputDropdown = (props) => {
    const { t } = useTranslation();
    const [options, setOptions] = useState([]);
    const [label, setLabel] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const { disabled, selectedVal, optioncase } = props;

    const handleSelect = (option) => {
        props.handleOptionClick(option);
        setIsOpen(false);
    };

    useEffect(() => {
        setLabel(props.label);
        // console.log(props.datas);
        setOptions(props.datas);

        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        window.document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [props.datas, props.label, optioncase]);


    return (
        <>
            <div className="form-group" ref={wrapperRef}>
                <label>{label}</label>
                <div className="custom-dropdown text-left">
                    <div className="flex justify-between">
                        <input className="form-control" onClick={() => setIsOpen(!isOpen)} onChange={props.handleChangeName} value={selectedVal} disabled={disabled} placeholder={t("select_option_label")}/>
                        {/* <span className="float-right">
                            {!isOpen ? <i className="fa fa-chevron-down"></i> : <i className="fa fa-chevron-up"></i>}
                        </span> */}
                    </div>
                    {isOpen && (
                        <ul className="z-10 absolute left-0 w-full bg-white border border-[#efefef] rounded-lg m-0">
                            {options.map((option, index) => (
                                <li className="py-2 px-4 text-left cursor-pointer hover:text-slate-500 hover:bg-gray-100 border-b"
                                    key={option.id || index}
                                    onClick={(event) => handleSelect(option)}
                                >
                                    {option}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default SearchInputDropdown;
