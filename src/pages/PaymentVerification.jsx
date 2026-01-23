import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyPayment } from "../service/cartApi";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/slices/cartSlices"; // Import clearCart action

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("verifying");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const verify = async () => {
      const reference =
        searchParams.get("reference") || searchParams.get("trxref");
      const orderId = searchParams.get("orderId");

      console.log("Payment verification params:", { reference, orderId });

      if (!reference || !orderId) {
        setStatus("error");
        toast.error("Missing payment verification parameters");
        return;
      }

      try {
        const response = await verifyPayment(reference, orderId);

        if (response.success) {
          setOrder(response.order);
          setStatus("success");
          toast.success("Payment verified successfully!");

          // Clear cart from Redux store
          dispatch(clearCart());

          // Get the full order details with shipping info
          const orderDetails = response.order;
          
          // Redirect to order confirmation with ALL order data
          setTimeout(() => {
            navigate("/order-confirmation", {
              state: {
                orderId: orderDetails._id,
                orderTotal: orderDetails.totalAmount,
                shippingInfo: orderDetails.shippingInfo, // Pass shipping info
                paymentStatus: orderDetails.paymentStatus,
                items: orderDetails.items,
                createdAt: orderDetails.createdAt
              },
            });
          }, 2000);
        } else {
          setStatus("error");
          toast.error(response.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        toast.error(error.message || "Payment verification failed");
      }
    };

    verify();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full mx-4">
        {status === "verifying" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#36d7b7] mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold mb-4">Verifying Payment</h2>
            <p className="text-gray-600">
              Please wait while we verify your payment...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-500 text-6xl mb-6">✓</div>
            <h2 className="text-2xl font-semibold mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your cart has been cleared and we're redirecting you to order confirmation...
            </p>
            {order && (
              <div className="bg-gray-50 p-4 rounded-md text-left">
                <p className="text-sm">Order ID: {order._id}</p>
                <p className="text-sm">Amount: ₦{order.totalAmount}</p>
              </div>
            )}
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 text-6xl mb-6">✗</div>
            <h2 className="text-2xl font-semibold mb-4">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              There was an issue with your payment. Please try again.
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="px-6 py-3 bg-[#36d7b7] text-white rounded-md hover:bg-[#2abca0] transition-colors"
            >
              Return to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentVerification;