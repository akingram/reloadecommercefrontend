import React from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle, Truck, User, MapPin, Phone, Mail, Package } from "lucide-react";

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId, orderTotal, shippingInfo, items, paymentStatus, createdAt } = location.state || {};

  // Format price in NGN
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(price || 0));

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="mb-6">Unable to retrieve order details.</p>
          <Link
            to="/shop"
            className="px-6 py-3 bg-[#36d7b7] text-white rounded-md hover:bg-[#2abca0]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-[#36d7b7]" />
                Order Details
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{orderId}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">{createdAt ? formatDate(createdAt) : 'N/A'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">₦{formatPrice(orderTotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="font-medium capitalize text-green-600">{paymentStatus || 'hold'}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-[#36d7b7]" />
                Shipping Information
              </h2>
              
              {shippingInfo ? (
                <div className="space-y-3">
                  <div className="flex items-start">
                    <User className="h-4 w-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{shippingInfo.address}</p>
                      <p className="text-sm text-gray-600">
                        {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-4 w-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                    <p className="font-medium">{shippingInfo.phone}</p>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-4 w-4 mr-2 mt-1 text-gray-400 flex-shrink-0" />
                    <p className="font-medium">{shippingInfo.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Shipping information not available</p>
              )}
            </div>
          </div>

          {/* Order Items with Product Details */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-[#36d7b7]" />
              Order Items
            </h2>
            
            {items && items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      {item.productDetails?.images?.[0] && (
                        <img 
                          src={item.productDetails.images[0]} 
                          alt={item.productDetails.title}
                          className="h-16 w-16 object-cover rounded-md"
                        />
                      )}
                      
                      <div>
                        {/* Product Title */}
                        <p className="font-medium text-gray-900">
                          {item.productDetails?.title || `Product ${index + 1}`}
                        </p>
                        
                        {/* Product Details */}
                        <div className="text-sm text-gray-600 mt-1">
                          <p>Quantity: {item.quantity}</p>
                          <p>Unit Price: ₦{formatPrice(item.price)}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Item Total */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₦{formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Order Total */}
                <div className="flex justify-between items-center  pt-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold text-[#36d7b7]">
                    ₦{formatPrice(orderTotal)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No items found in this order</p>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">What's Next?</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-[#36d7b7] rounded-full h-6 w-6 flex items-center justify-center text-white text-sm font-bold mr-3 flex-shrink-0">
                1
              </div>
              <p>Order processing (within 24 hours)</p>
            </div>

            <div className="flex items-start">
              <div className="bg-[#36d7b7] rounded-full h-6 w-6 flex items-center justify-center text-white text-sm font-bold mr-3 flex-shrink-0">
                2
              </div>
              <p>Shipping confirmation email</p>
            </div>

            <div className="flex items-start">
              <div className="bg-[#36d7b7] rounded-full h-6 w-6 flex items-center justify-center text-white text-sm font-bold mr-3 flex-shrink-0">
                3
              </div>
              <p>Delivery within 3-5 business days</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              to="/orders"
              className="px-6 py-3 bg-[#36d7b7] text-white rounded-md hover:bg-[#2abca0] transition-colors text-center"
            >
              View My Orders
            </Link>

            <Link
              to="/shop"
              className="px-6 py-3 border border-[#36d7b7] text-[#36d7b7] rounded-md hover:bg-[#36d7b7] hover:text-white transition-colors text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;