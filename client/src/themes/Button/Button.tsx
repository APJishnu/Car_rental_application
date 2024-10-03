import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset' ;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean; // Add this line
  loading?:boolean
}

const Button: React.FC<ButtonProps> = ({ onClick, type = 'button', children, className ,disabled}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`${styles.button} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
