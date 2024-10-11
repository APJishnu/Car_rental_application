import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import styles from "./Modal.module.css"; // Import the CSS Module

interface ModalProps {
    message: string;
    status: "success" | "error";
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, status, onClose }) => {
    const icon = status === "success" ? <FaCheckCircle size={50} /> : <FaTimesCircle size={50} />;
    
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent}>
                <div className={`${styles.modalIcon} ${status === "success" ? styles.success : styles.error}`}>
                    {icon}
                </div>
                <h2 className={styles.modalTitle}>{status === "success" ? "Success!" : "Error!"}</h2>
                <p className={styles.modalMessage}>{message}</p>
                <button className={styles.modalCloseBtn} onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;
