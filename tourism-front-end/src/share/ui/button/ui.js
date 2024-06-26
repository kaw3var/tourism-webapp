import React from "react"

const Button = ({ name, type="button", onClick }) => (
    <button type={type} onClick={onClick}>
        {name}
    </button>
);

export default Button;