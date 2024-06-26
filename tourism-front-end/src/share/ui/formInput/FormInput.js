import React from "react";

const FormInput = ({ label, name, value, onChange, required = false }) => (
    <div className="form-card__info">
        <label>{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            required={required}
        />
    </div>
);

export default FormInput;
