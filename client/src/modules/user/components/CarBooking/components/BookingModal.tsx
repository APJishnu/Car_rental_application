import React, { useState, useEffect } from "react";
import { Input, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useBooking } from "../../../services/booking-services";
import { RentableVehicle } from "../../../../../interfaces/user-interfaces/types";
import styles from "./BookingModal.module.css";
import Modal from "../../../../../themes/Modal/Modal";
import confetti from "canvas-confetti"; // Import the Confetti component

// Payment gateway images
const paymentGateways = [
  { value: "razorpay", imgSrc: "/razorpay-logo.svg" },
  { value: "paypal", imgSrc: "/paypal.svg" },
];

interface BookingModalProps {
  car: RentableVehicle;
  onClose: () => void;
  pickupDate: string | null;
  dropoffDate: string | null;
}

const GST_PERCENTAGE = 0.18;

export const BookingModal: React.FC<BookingModalProps> = ({
  car,
  onClose,
  pickupDate,
  dropoffDate,
}) => {
  const [userContact, setUserContact] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [numberOfDays, setNumberOfDays] = useState<number>(0);
  const [gstAmount, setGstAmount] = useState<number>(0);
  const [selectedPaymentGateway, setSelectedPaymentGateway] =
    useState<string>(""); // Razorpay or other
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  

  // Error state variables
  const [contactError, setContactError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [agreementError, setAgreementError] = useState<string | null>(null);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalStatus, setModalStatus] = useState<"success" | "error">(
    "success"
  );
  const { handleBooking } = useBooking();

  useEffect(() => {
    if (pickupDate && dropoffDate) {
      const startDate = new Date(pickupDate);
      const endDate = new Date(dropoffDate);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setNumberOfDays(days);

      const basePrice = parseFloat(car.pricePerDay) * days;
      const gst = basePrice * GST_PERCENTAGE;

      setGstAmount(gst);
      setTotalPrice(basePrice + gst);
    }
  }, [pickupDate, dropoffDate, car.pricePerDay]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not selected";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleConfirmRent = async () => {
    // Reset error messages
    setContactError(null);
    setPaymentError(null);
    setAgreementError(null);

    // Validation
    let hasError = false;

    if (!userContact) {
      setContactError("Please enter your contact information.");
      hasError = true;
    }

    if (!selectedPaymentGateway) {
      setPaymentError(" Please select any payment method.");
      hasError = true;
    } else if (selectedPaymentGateway !== "razorpay") {
      setPaymentError(
        "Razorpay service is only currently available. Please select that payment method."
      );
      hasError = true;
    }

    if (!isAgreed) {
      setAgreementError("You must agree to the terms to proceed.");
      hasError = true;
    }

    // If there are errors, do not proceed with booking
    if (hasError) return;

    try {
      const bookingData = {
        vehicleId: car.vehicleId,
        pickupDate: pickupDate!,
        dropoffDate: dropoffDate!,
        totalPrice,
        userContact,
      };

      const handleBookingSuccess = (data: any) => {
        if (data?.verifyPaymentAndCreateBooking?.status === "success") {
          setModalMessage(
            data.verifyPaymentAndCreateBooking.message ||
              "Booking created successfully!"
          );
          setModalStatus("success");
        } else {
          setModalMessage(
            data?.verifyPaymentAndCreateBooking?.message ||
              "Something went wrong!"
          );
          setModalStatus("error");
        }
      };

      const response = await handleBooking(bookingData, handleBookingSuccess);

      if (response) {
        if (response.status === "success") {
            onClose();
          setModalMessage(response.message || "Booking created successfully!");
          setModalStatus("success");
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          }); // Show confetti on success
          setTimeout(() => {
            window.history.go(-1); 
        }, 1000);
        
        } else {
          setModalMessage(response.message || "Something went wrong!");
          setModalStatus("error");
        }
      }
    } catch (error) {
      console.error("Error during booking:", error);
      setModalMessage("Error occurred while creating the booking.");
      setModalStatus("error");
    }
  };

  return (
    <>
      <div className={`${styles.confirmOverlay} ${styles.visible}`}>
        <div className={styles.cardDiv}>
          <div className={styles.confirmOverlayContent}>
            <CloseOutlined className={styles.closeButton} onClick={onClose} />

            <div className={styles.leftSection}>
              <div className={styles.cardModal}>
                <div className={styles.modalContent}>
                  <div className={styles.carImageContainer}>
                    <img
                      src={car.vehicle.primaryImageUrl}
                      alt={car.vehicle.name}
                      className={styles.carImage}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.secondCard}>
                <div className={styles.rideInfo}>
                  <table className={styles.priceTable}>
                    <tbody>
                      <tr>
                        <td>
                          <strong>Price per Day:</strong>
                        </td>
                        <td>₹{car.pricePerDay}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Number of Days:</strong>
                        </td>
                        <td>{numberOfDays} Days</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Base Price:</strong>
                        </td>
                        <td>
                          ₹
                          {(parseFloat(car.pricePerDay) * numberOfDays).toFixed(
                            2
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>
                            GST ({(GST_PERCENTAGE * 100).toFixed(2)}%):
                          </strong>
                        </td>
                        <td>₹{gstAmount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Total Price:</strong>
                        </td>
                        <td>
                          <strong>₹{totalPrice.toFixed(2)}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className={styles.rightSection}>
              {/* Radio Button Payment Gateway Selection */}
              <div className={styles.paymentSelection}>
                <div className={styles.dateModalMainDiv}>
                  <div className={styles.dateModal}>
                    <div className={styles.dateModalDotDiv}>
                      <p>
                        <span>{formatDate(pickupDate)}</span>
                      </p>
                      <p>
                        <span style={{ color: "white" }}>TO</span>
                      </p>
                      <p>
                        <span>{formatDate(dropoffDate)}</span>
                      </p>
                    </div>
                    <div className={styles.ticketCornerFold}></div>{" "}
                    {/* Folded corner */}
                  </div>
                </div>

                <div className={styles.payementMethodDiv}>
                  <h3>Select Payment Method:</h3>
                  {paymentGateways.map((gateway) => (
                    <div key={gateway.value} className={styles.paymentOption}>
                      <input
                        type="radio"
                        id={gateway.value}
                        name="paymentMethod"
                        value={gateway.value}
                        checked={selectedPaymentGateway === gateway.value}
                        onChange={() =>
                          setSelectedPaymentGateway(gateway.value)
                        }
                      />
                      <label
                        htmlFor={gateway.value}
                        className={styles.radioLabel}
                      >
                        <img
                          src={gateway.imgSrc}
                          alt={gateway.value}
                          className={styles.paymentImage}
                        />
                      </label>
                    </div>
                  ))}

                  {paymentError && (
                    <div className={styles.errorMessage}>{paymentError}</div>
                  )}
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className={styles.agreementCheckbox}>
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={() => setIsAgreed(!isAgreed)}
                  style={{marginRight:'10px'}}
                />
                <label>I agree to the terms and conditions</label>
                {agreementError && (
                  <div className={styles.errorMessage}>{agreementError}</div>
                )}
              </div>

              <div className={styles.inputWithButton}>
                <div>
                  <Input
                    className={styles.confirmInput}
                    type="text"
                    placeholder="Enter your contact number"
                    value={userContact}
                    onChange={(e) => setUserContact(e.target.value)}
                    maxLength={10}
                  />
                  {contactError && (
                    <div className={styles.errorMessage}>{contactError}</div>
                  )}
                </div>
                <Button
                  onClick={handleConfirmRent}
                  className={styles.confirmButton}
                >
                  Confirm Rent
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalMessage && (
        <Modal
          message={modalMessage}
          onClose={() => setModalMessage(null)}
          status={modalStatus}
        />
      )}
    </>
  );
};

export default BookingModal;
