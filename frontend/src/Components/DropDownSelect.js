import React, { useEffect, useRef, useState } from "react";
// import { useTranslation } from "react-i18next";

const DropDownSelect = (props) => {
    // const { t } = useTranslation();
    const [options, setOptions] = useState([]);
    const [label, setLabel] = useState("");
    const [placeholder, setPlaceholder] = useState("Select an option");
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const { disabled, selectedVal, isAll, optioncase } = props;

    const handleSelect = (option) => {
        props.handleOptionClick(option);
        setIsOpen(false);
    }

    const formatThousandNumber = (number) => {
        return number.toLocaleString("en-US", {
            maximumFractionDigits: 3,
        });
    };

    useEffect(() => {
        setLabel(props.label);
        let uniqueOptions = [];
        if (optioncase === "inverterkva" || optioncase === "brand") {
            props.datas && props.datas.forEach(data => {
                const findId = optioncase === "inverterkva" ?
                    uniqueOptions.findIndex(option => option.kva === data.kva) :
                    uniqueOptions.findIndex(option => option.brand === data.brand);
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
        setPlaceholder(props.placeholder);

        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        window.document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [props.datas, optioncase, props.label, props.placeholder]);



    return (
        <>
            <div className="form-group" ref={wrapperRef}>
                <label style={{ fontSize: "15px" }}><b>{label}</b></label>
                <div className="custom-dropdown text-left">
                    <button onClick={() => setIsOpen(!isOpen)} disabled={disabled}>
                        {selectedVal || placeholder}
                        <span className="float-right">
                            {!isOpen ? <i className="fa fa-chevron-down"></i> : <i className="fa fa-chevron-up"></i>}
                        </span>
                    </button>
                    {isOpen && (
                        <ul className="z-10 absolute left-0 w-full bg-white border border-[#efefef] rounded-lg m-0 max-h-80 overflow-y-scroll">
                            {isAll === undefined && <><li className="py-2 px-4 text-left cursor-pointer hover:text-slate-500 hover:bg-gray-200"
                                    onClick={() => handleSelect("")}
                                >
                                    All
                                </li>
                                <hr /></>
                            }
                            {options && options.map((option, index) => (
                                <React.Fragment key={option.id ? option.id : index}>
                                    <li className={`py-2 px-4 cursor-pointer hover:text-slate-500 hover:bg-gray-200 ${optioncase === "" ? "text-right" : "text-left" }`}
                                        onClick={(event) => handleSelect(option)}
                                    >
                                        {optioncase === "name" ? <>{option.name}</> : optioncase === "inverterkva" ? <>{option.kva} watts</> : optioncase === "brand" ? <>{option.brand}</> : optioncase === "inverterModelNum" ? <>{option.modelNumber}</> : optioncase === "wizardInvertKva" ? <>{option}kVA</> : optioncase === "modelNumber" ? option : <>{formatThousandNumber(option)}</>}
                                    </li>
                                    <hr />
                                </React.Fragment>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default DropDownSelect;
