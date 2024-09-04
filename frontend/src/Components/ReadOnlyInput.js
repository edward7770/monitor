import React from "react";

const ReadOnlyInput = (props) => {

    return (
        <div className="form-group row" style={{ width: props.width }}>
            <label htmlFor="input-readonly" className="col-sm-1 control-label">
                {props.label}
            </label>
            <div className="col-sm-11">
                <input
                    type="text"
                    className="form-control"
                    id="input-readonly"
                    placeholder="This is readonly input..."
                    value={props.value}
                    readOnly
                />
            </div>
        </div>
    );
};

export default ReadOnlyInput;
