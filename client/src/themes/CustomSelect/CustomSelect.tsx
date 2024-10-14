// components/CustomSelect.tsx
import React from "react";
import styles from "./CustomSelect.module.css"; // Create a CSS module for styles

interface Option<T> {
    value: T;
    label: string;
}

interface CustomSelectProps<T extends string | number> { // Constrain T to string | number
    options: Option<T>[];
    placeholder?: string;
    onChange: (value: T | undefined) => void; // Allow undefined
    value?: T; // Generic type for value
}

const CustomSelect = <T extends string | number>({
    options,
    placeholder,
    onChange,
    value,
}: CustomSelectProps<T>) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value === "" || 0 ? undefined : (e.target.value as T);
        onChange(selectedValue); // Pass selectedValue directly
    };

    return (
        <select value={value ?? "" ?? 0 } onChange={handleChange} className={styles.customSelect}>
            <option value="" disabled>
                {placeholder}
            </option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default CustomSelect;
