import React, { useState } from 'react';

const FloatingLabelInput = ({ label, type, name, required, value, onChange }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    let labelClass = '';
    if (value !== '' || isFocused) {
        labelClass = 'active';
        if (isFocused) {
            labelClass += ' highlight';
        }
    }

    return (
        <div className="field-wrap">
            <label className={labelClass}>
                {label}
                {required && <span className="req">*</span>}
            </label>
            <input
                type={type}
                name={name}
                required={required}
                autoComplete="off"
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
        </div>
    );
};

export default FloatingLabelInput;
