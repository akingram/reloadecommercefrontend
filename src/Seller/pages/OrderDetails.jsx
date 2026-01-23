import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { toast } from "react-toastify";
import { getSellerOrderDetails } from "../../service/sellerApi";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { seller } = useSelector((state) => state.seller); // Get current seller from Redux
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId && seller) {
      fetchOrderDetails();
    }
  }, [orderId, seller]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await getSellerOrderDetails(orderId);
      setOrder(response.order);
    } catch (error) {
      toast.error("Failed to load order details");
      console.error("Order details error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(price || 0));

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // ✅ FIXED: Filter items that belong to the current seller
  const sellerItems =
    order?.items?.filter((item) => {
      // Check if the product's seller matches the current logged-in seller
      const productSellerId =
        item.productId?.seller?._id || item.productId?.seller;
      return (
        productSellerId &&
        productSellerId.toString() === seller?._id?.toString()
      );
    }) || [];

  const totalSellerAmount = sellerItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-gray-200 h-64 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">❌</div>
          <p className="text-gray-500 text-lg">Order not found</p>
          <Link
            to="/seller/seller-orders"
            className="text-[#36d7b7] hover:text-[#2abca0] mt-2 inline-block"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/seller/seller-orders"
          className="inline-flex items-center text-[#36d7b7] hover:text-[#2abca0] mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-600 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                order.paymentStatus === "paid"
                  ? "bg-green-100 text-green-800"
                  : order.paymentStatus === "hold"
                  ? "bg-blue-100 text-blue-800"
                  : order.paymentStatus === "failed"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.paymentStatus?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-[#36d7b7]" />
              Your Products in This Order
            </h2>

            {sellerItems.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No products from your store in this order
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  This order contains products from other sellers
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {sellerItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-4"
                    >
                      <div className="flex items-center space-x-4">
                        {item.productId?.images?.[0] && (
                          <img
                            src={item.productId.images[0]}
                            alt={item.productId.title}
                            className="h-16 w-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.productId?.title || `Product ${index + 1}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity} × ₦
                            {formatPrice(item.price)}
                          </p>
                          {item.productId?.seller && (
                            <p className="text-xs text-gray-400 mt-1">
                              Your Product
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ₦{formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className=" pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      Your Earnings:
                    </span>
                    <span className="text-xl font-bold text-[#36d7b7]">
                      ₦{formatPrice(totalSellerAmount)}
                    </span>
                  </div>
                  {order.sellerPaidAt ? (
                    <p className="text-sm text-green-600 mt-2">
                      ✅ Paid on {formatDate(order.sellerPaidAt)}
                    </p>
                  ) : (
                    <p className="text-sm text-blue-600 mt-2">
                      ⏳ Payment pending customer delivery confirmation
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-[#36d7b7]" />
              Customer Information
            </h2>

            <div className="space-y-3">
              <div className="flex items-start">
                <User className="h-4 w-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">
                    {order.shippingInfo?.firstName}{" "}
                    {order.shippingInfo?.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-4 w-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                <p className="text-gray-900">{order.shippingInfo?.email}</p>
              </div>

              <div className="flex items-start">
                <Phone className="h-4 w-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                <p className="text-gray-900">{order.shippingInfo?.phone}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-[#36d7b7]" />
              Shipping Address
            </h2>

            <div className="space-y-2">
              <p className="text-gray-900">{order.shippingInfo?.address}</p>
              <p className="text-gray-600">
                {order.shippingInfo?.city}, {order.shippingInfo?.state},{" "}
                {order.shippingInfo?.country}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-[#36d7b7]" />
              Order Summary
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className="font-medium capitalize">
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentConfirmedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Date:</span>
                  <span className="font-medium">
                    {formatDate(order.paymentConfirmedAt)}
                  </span>
                </div>
              )}
              {order.sellerPaidAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid to You:</span>
                  <span className="font-medium text-green-600">
                    {formatDate(order.sellerPaidAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
