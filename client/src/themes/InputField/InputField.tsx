import React from 'react';
import styles from './InputField.module.css';

interface InputProps {
  type: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  name?: string;
}

const InputField: React.FC<InputProps> = ({ type, id, value, onChange, placeholder, required, className ,name}) => {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`${styles.input} ${className || ''}`}
      name={name}
    />
  );
};

export default InputField;
