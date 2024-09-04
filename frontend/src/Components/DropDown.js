import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const DropDown = (props) => {
    const { t } = useTranslation();
    const [options, setOptions] = useState([]);
    const [label, setLabel] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const { disabled, selectedVal, optioncase, scroll } = props;

    const handleSelect = (option) => {
        props.handleOptionClick(option);
        setIsOpen(false);
    };

    useEffect(() => {
        setLabel(props.label);
        // console.log(props.datas);
        let uniqueOptions = [];
        if (optioncase === "inverterkva" || optioncase === "brand") {
            props.datas && props.datas.forEach(data => {
                const key = optioncase === "inverterkva" ? "kva" : "brand";
                const findId = uniqueOptions.findIndex(option => option[key] === data[key]);
                if (findId === -1) {
                    uniqueOptions.push(data);
                }
            });

            if (optioncase === "inverterkva") {
                uniqueOptions.sort((a, b) => a.kva - b.kva);
            }
        }

        const optionsToSet = uniqueOptions.length === 0 ? props.datas : uniqueOptions;
        setOptions(optionsToSet);

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
                    {optioncase === "solution-dropdown" ? <>
                        <button onClick={() => setIsOpen(!isOpen)} disabled={disabled}>
                            {selectedVal || t("select_option_label")}
                            <span className="float-right">
                                {!isOpen ? <i className="fa fa-chevron-down"></i> : <i className="fa fa-chevron-up"></i>}
                            </span>
                        </button>
                        {isOpen && (
                            <ul className={`z-10 absolute left-0 w-full bg-white border border-[#efefef] rounded-lg m-0 ${scroll !== false && "max-h-80 overflow-y-scroll" }`}>
                                {options.map((option, index) => (
                                    <li className="py-2 px-4 text-left cursor-pointer hover:text-slate-500 hover:bg-gray-100 border-b"
                                        key={option.id || index}
                                        onClick={(event) => handleSelect(option)}
                                    >
                                        {option.name}
                                        {option.status === 1 && <span className="float-right rounded-2xl bg-[#50d71e] w-[15px] h-[15px] mt-1"></span>}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </> : <>
                        <button onClick={() => setIsOpen(!isOpen)} disabled={disabled}>
                            {selectedVal || t("select_option_label")}
                            <span className="float-right">
                                {!isOpen ? <i className="fa fa-chevron-down"></i> : <i className="fa fa-chevron-up"></i>}
                            </span>
                        </button>
                        {isOpen && (
                            <ul className={`z-10 absolute left-0 w-full bg-white border border-[#efefef] rounded-lg m-0 ${scroll !== false && "max-h-80 overflow-y-scroll" }`}>
                                {options && options.map((option, index) => (
                                    <li className="py-2 px-4 text-left cursor-pointer hover:text-slate-500 hover:bg-gray-100 border-b"
                                        key={option.id || index}
                                        onClick={(event) => handleSelect(option)}
                                    >
                                        {optioncase === "supplierName" ? <>{option.companyName}</> : optioncase === "name" ? <>{option.name}</> : optioncase === "inverterkva" ? <>{option.kva}kVA</> : optioncase === "brand" ? <>{option.brand}</> : optioncase === "inverterModelNum" ? <>{option.modelNumber}</> : optioncase === "wizardInvertKva" ? <>{option}kVA</> : <>{option}</>}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>}
                </div>
            </div>
        </>
    );
};

export default DropDown;
