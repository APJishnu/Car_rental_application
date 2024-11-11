import { gql, useMutation } from "@apollo/client";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

// Mutation for creating the Razorpay payment order
const CREATE_PAYMENT_ORDER_MUTATION = gql`
  mutation CreatePaymentOrder(
    $totalPrice: Float!
    $bookingInput: CreateBookingInput!
  ) {
    createPaymentOrder(totalPrice: $totalPrice, bookingInput: $bookingInput) {
      status
      message
      statusCode
      data {
        razorpayOrderId
        amount
        currency
      }
    }
  }
`;

const VERIFY_PAYMENT_AND_CREATE_BOOKING_MUTATION = gql`
  mutation VerifyPaymentAndCreateBooking(
    $paymentDetails: PaymentInput!
    $bookingInput: CreateBookingInput!
  ) {
    verifyPaymentAndCreateBooking(
      paymentDetails: $paymentDetails
      bookingInput: $bookingInput
    ) {
      status
      message
      data {
        id
        rentableId
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
    status: boolean; // Change this to boolean as per your backend
    message: string;
    statusCode: number; // Include statusCode
    data: {
      razorpayOrderId: string;
      amount: number;
      currency: string;
    };
  };
}

// Define the input variables for verifying payment and creating the booking
interface BookingVariables {
  rentableId: string;
  pickupDate: string;
  dropoffDate: string;
  totalPrice: number;
  userContact: string;
}

// Define the structure of the verify payment and booking response
interface BookingResponse {
  verifyPaymentAndCreateBooking: {
    status: boolean; // Change this to boolean as per your backend
    message: string;
    data: {
      id: string;
      rentableId: string;
      pickupDate: string;
      dropoffDate: string;
      totalPrice: number;
      status: string;
    };
  };
}

interface Error {
  status: boolean;
  message: string;
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
  const [
    createPaymentOrder,
    { loading: loadingPaymentOrder, error: paymentOrderError },
  ] = useMutation<PaymentOrderResponse, PaymentOrderVariables>(
    CREATE_PAYMENT_ORDER_MUTATION,
    {
      context: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    }
  );

  const [
    verifyPaymentAndCreateBooking,
    { loading: loadingBooking, error: bookingError, data: bookingData },
  ] = useMutation<
    BookingResponse,
    { paymentDetails: any; bookingInput: BookingVariables }
  >(VERIFY_PAYMENT_AND_CREATE_BOOKING_MUTATION, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  });

  // Function to initiate the booking and payment process
  const handleBooking = async (
    bookingInput: BookingVariables,
    handlerfunction: any
  ) => {
    try {
      if (!razorpayLoaded) return { message: "Razorpay SDK is not loaded." };

      // Step 1: Create the Razorpay payment order along with booking details
      const paymentOrderResponse = await createPaymentOrder({
        variables: {
          totalPrice: bookingInput.totalPrice,
          bookingInput,
        },
      });

      if (paymentOrderResponse.data?.createPaymentOrder.status) {
        // Check for boolean status
        const { razorpayOrderId, amount, currency } =
          paymentOrderResponse.data.createPaymentOrder.data;

        // Step 2: Process the Razorpay payment on the frontend
        const razorpay = new (window as any).Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID||"rzp_test_37TZNY8cnWgUm8",
          amount: amount,
          name: "LUXEDRIVE", // Updated company name
          description: "Book your favorite vehicle for a smooth ride!",
          currency: currency,
          order_id: razorpayOrderId,
          handler: async (response: any) => {
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
                handlerfunction(bookingResponse.data);
              }

              // Check the booking creation status
              if (bookingResponse.data?.verifyPaymentAndCreateBooking.status) {
                return {
                  status:
                    bookingResponse.data.verifyPaymentAndCreateBooking.status,
                  message:
                    bookingResponse.data.verifyPaymentAndCreateBooking.message,
                  data: bookingResponse.data.verifyPaymentAndCreateBooking.data,
                };
              } else {
                return {
                  status: "error",
                  message:
                    bookingResponse.data?.verifyPaymentAndCreateBooking
                      .message || "Booking creation failed.",
                  data: {},
                };
              }
            } catch (error) {
              return {
                status: "error",
                message: "Payment verification failed.",
                data: null,
              };
            }
          },
          prefill: {
            contact: bookingInput.userContact,
          },
          theme: {
            color: "#007BFF", // Starting color (Deep Blue)
          },
          layout: {
            // Optionally change layout styles
            header: {
              title: "Your Payment Details",
              backgroundColor: "#2980b9", // Header background
              textColor: "#ffffff", // Header text color
            },
            footer: {
              backgroundColor: "#bdc3c7", // Footer background
              textColor: "#2c3e50", // Footer text color
            },
          },
          button: {
            style: {
              backgroundColor: "#27ae60", // Green button background
              color: "#ffffff", // White button text
              borderRadius: "8px", // Rounded corners
              padding: "10px 20px", // Padding around the button
              hover: {
                backgroundColor: "#1e7e34", // Darker green on hover
              },
            },
          },
          image: "/carLoading1.svg", // URL of your logo
          modal: {
            ondismiss: () => {
              return {
                status: "error",
                message: "The payment process was cancelled. Please try again.",
                data: null,
              };
            },
          },
        });

        razorpay.open(); // Open Razorpay payment modal
      } else {
        return {
          status: "error",
          message: paymentOrderResponse.data?.createPaymentOrder.message,
          data: null,
        };
      }
    } catch (error) {
      const Error = error as Error;
      return {
        status: "error",
        message:
          Error.message || "Error occurred while processing the booking.",
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
