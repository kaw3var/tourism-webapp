import React from "react";

const FormInput = ({ value, label, name, required = false, placeholder, onChange }) => (
    <div className="form-card__info">
        <label>{label}</label>
        <input
            value={value}
            type="text"
            name={name}
            placeholder={placeholder}
            required={required}
            onChange={onChange}
        />
    </div>
);

export default FormInput;
