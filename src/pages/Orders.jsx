import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, CheckCircle, Truck, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { getOrders, confirmOrderDelivery } from "../service/cartApi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingOrder, setConfirmingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      setOrders(response.orders || []);
    } catch (error) {
      toast.error(error.message);
      console.error('Fetch orders error:', error);
    } finally {
      setLoading(false);
    }
  };

const handleConfirmDelivery = async (orderId) => {
  try {
    setConfirmingOrder(orderId);
    const response = await confirmOrderDelivery(orderId);
    
    // Check if it's test mode
    const isTestMode = response.mode === 'test';
    
    if (response.payments?.every(p => p.success)) {
      if (isTestMode) {
        toast.success("Delivery confirmed! (Test Mode - Payments Simulated)");
      } else {
        toast.success("Delivery confirmed! Sellers have been paid.");
      }
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order._id === orderId 
          ? { ...order, paymentStatus: 'paid', sellerPaidAt: new Date() }
          : order
      ));
    } else {
      // Some payments failed
      const failedCount = response.payments?.filter(p => !p.success).length || 0;
      toast.warning(`${failedCount} payment(s) failed. Please try again.`);
    }
  } catch (error) {
    console.error('Confirm delivery error:', error);
    toast.error(error.message);
  } finally {
    setConfirmingOrder(null);
  }
};

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(price || 0));

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'hold': return <Package className="h-5 w-5 text-blue-500" />;
      case 'paid': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'hold': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow p-6 mb-4">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-2">
            My Orders
          </h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link
              to="/shop"
              className="px-6 py-3 bg-[#36d7b7] text-white rounded-md hover:bg-[#2abca0] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    {getStatusIcon(order.paymentStatus)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus?.toUpperCase()}
                    </span>
                    <span className="text-lg font-bold text-[#36d7b7]">
                      ₦{formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-4 mb-4">
                  <h4 className="font-semibold mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {item.productId?.images?.[0] && (
                            <img 
                              src={item.productId.images[0]} 
                              alt={item.productId.title}
                              className="h-12 w-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.productId?.title || `Product ${index + 1}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity} × ₦{formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold">
                          ₦{formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center border-t pt-4">
                  <div className="text-sm text-gray-600">
                    {order.sellerPaidAt ? (
                      <span className="text-green-600 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Sellers paid on {formatDate(order.sellerPaidAt)}
                      </span>
                    ) : order.paymentStatus === 'hold' ? (
                      <span className="text-blue-600 flex items-center">
                        <Truck className="h-4 w-4 mr-1" />
                        Confirm delivery to pay sellers
                      </span>
                    ) : null}
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link
                      to={`/orders/${order._id}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </Link>
                    
                    {order.paymentStatus === 'hold' && !order.sellerPaidAt && (
                      <button
                        onClick={() => handleConfirmDelivery(order._id)}
                        disabled={confirmingOrder === order._id}
                        className="px-4 py-2 bg-[#36d7b7] text-white rounded-md hover:bg-[#2abca0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {confirmingOrder === order._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Confirming...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Confirm Delivery
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;