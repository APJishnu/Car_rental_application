import { gql, useMutation } from "@apollo/client";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";


// Mutation for creating the Razorpay payment order
const CREATE_PAYMENT_ORDER_MUTATION = gql`
  mutation CreatePaymentOrder($totalPrice: Float!,$bookingInput: CreateBookingInput!) {
    createPaymentOrder(totalPrice: $totalPrice,bookingInput: $bookingInput) {
      status
      message
      razorpayOrderId
      amount
      currency
      
    
    }
  }
`;

const VERIFY_PAYMENT_AND_CREATE_BOOKING_MUTATION = gql`
  mutation VerifyPaymentAndCreateBooking($paymentDetails: PaymentInput!, $bookingInput: CreateBookingInput!) {
    verifyPaymentAndCreateBooking(paymentDetails: $paymentDetails, bookingInput: $bookingInput) {
      status
      message
      data {
        id
        vehicleId
        userId
        pickupDate
        dropoffDate
        totalPrice
        status
      }
    }
  }
`;

// Define the input variables for creating the payment order
interface PaymentOrderVariables {
    totalPrice: number;
    bookingInput: BookingVariables;

}

// Define the structure of the payment order response
interface PaymentOrderResponse {
    createPaymentOrder: {
        status: string;
        message: string;

        userName: string;
        userEmail: string;
        razorpayOrderId: string;
        amount: number;
        currency: string;


    };
}

// Define the input variables for verifying payment and creating the booking
interface BookingVariables {
    vehicleId: string;
    pickupDate: string;
    dropoffDate: string;
    totalPrice: number;
    userContact: string;
}

// Define the structure of the verify payment and booking response
interface BookingResponse {
    verifyPaymentAndCreateBooking: {
        status: string;
        message: string;
        data: {
            id: string;
            vehicleId: string;
            pickupDate: string;
            dropoffDate: string;
            totalPrice: number;
            status: string;
        };
    };
}

// Custom hook for managing the booking process
export const useBooking = () => {
    const token = Cookies.get("userToken");
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    useEffect(() => {
        const loadRazorpayScript = async () => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => setRazorpayLoaded(true);
            document.body.appendChild(script);
        };
        loadRazorpayScript();
    }, []);

    // Apollo Client's useMutation hooks for creating a payment order and verifying payment/creating a booking
    const [createPaymentOrder, { loading: loadingPaymentOrder, error: paymentOrderError }] = useMutation<PaymentOrderResponse, PaymentOrderVariables>(
        CREATE_PAYMENT_ORDER_MUTATION,
        {
            context: {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            },
        }
    );

    const [verifyPaymentAndCreateBooking, { loading: loadingBooking, error: bookingError, data: bookingData }] = useMutation<BookingResponse, { paymentDetails: any, bookingInput: BookingVariables }>(
        VERIFY_PAYMENT_AND_CREATE_BOOKING_MUTATION,
        {
            context: {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            },
        }
    );

    // Function to initiate the booking and payment process
    const handleBooking = async (bookingInput: BookingVariables, handlerfunction: any) => {



        try {
            if (!razorpayLoaded) return { message: "Razorpay SDK is not loaded." };

            // Step 1: Create the Razorpay payment order along with booking details
            const paymentOrderResponse = await createPaymentOrder({
                variables: {
                    totalPrice: bookingInput.totalPrice,
                    bookingInput, // Add bookingInput here
                },
            });

            if (paymentOrderResponse.data?.createPaymentOrder.status === "success") {
                const { razorpayOrderId, amount, currency } = paymentOrderResponse.data.createPaymentOrder;


                // Step 2: Process the Razorpay payment on the frontend
                const razorpay = new (window as any).Razorpay({
                    key: 'rzp_test_37TZNY8cnWgUm8',
                    amount: amount,
                    currency: currency,
                    order_id: razorpayOrderId,
                    handler: async (response: any) => {

                        console.log("Razorpay Response:", response);
                        try {
                            const bookingResponse = await verifyPaymentAndCreateBooking({
                                variables: {
                                    paymentDetails: {
                                        razorpayPaymentId: response.razorpay_payment_id,
                                        razorpayOrderId: response.razorpay_order_id,
                                        razorpaySignature: response.razorpay_signature,
                                    },
                                    bookingInput,
                                },
                            });

                            if (bookingResponse?.data) {
                                handlerfunction(bookingResponse.data)
                            }

                            // Check the booking creation status
                            if (bookingResponse.data?.verifyPaymentAndCreateBooking.status === "success") {

                                return {
                                    status: bookingResponse.data.verifyPaymentAndCreateBooking.status,
                                    message: bookingResponse.data.verifyPaymentAndCreateBooking.message,
                                    data: bookingResponse.data.verifyPaymentAndCreateBooking.data,
                                };
                            } else {
                                return {
                                    status: "error",
                                    message: bookingResponse.data?.verifyPaymentAndCreateBooking.message || "Booking creation failed.",
                                    data: {},
                                };
                            }
                        } catch (error) {
                            console.error("Error during payment verification:", error);
                            return {
                                status: "error",
                                message: "Payment verification failed.",
                                data: null,
                            };
                        }
                    },
                    prefill: {
                        email: paymentOrderResponse.data.createPaymentOrder.userEmail,
                        contact: bookingInput.userContact,
                    },
                });

                razorpay.open(); // Open Razorpay payment modal

                console.log("in handle booking razorpay", razorpay)
            } else {
                return {
                    status: paymentOrderResponse.data?.createPaymentOrder.status,
                    message: paymentOrderResponse.data?.createPaymentOrder.message,
                    data: null,
                };
            }


        } catch (error) {
            console.error("Error handling booking:", error);
            return {
                status: "error",
                message: "Error occurred while processing the booking.",
                data: null,
            };
        }
    };

    // Return the booking handling function, loading state, errors, and booking data
    return {
        handleBooking,
        loading: loadingPaymentOrder || loadingBooking, // Combine loading states
        error: paymentOrderError || bookingError, // Combine errors
        data: bookingData,
    };
};
