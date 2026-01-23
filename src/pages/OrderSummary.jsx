import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

const OrderSummary = ({
  items,
  showCheckoutButton = false,
  onCheckout,
  checkoutLoading = false,
}) => {
  // Calculate total price
  const totalPrice = items.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  // Format price in NGN
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(price));

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="bg-white shadow-card rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        <div className="text-center py-8">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground mb-6">Your cart is empty</p>
          <Link
            to="/shop"
            className="inline-flex items-center px-4 py-2 bg-[#36d7b7] text-white rounded-md text-sm font-medium hover:bg-[#2abca0] transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-card rounded-lg p-6 sticky top-4">
      <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

      {/* Order Items */}
      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-start border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
          >
            {/* Product Image */}
            <div className="w-16 h-16 flex-shrink-0 mr-3">
              <img
                src={item.image || "https://via.placeholder.com/150"}
                alt={item.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{item.name}</h3>
              <p className="text-xs text-muted-foreground truncate">
                Seller: {item.seller}
              </p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm font-semibold">
                  ₦{formatPrice(item.price)}
                </span>
                <span className="text-sm text-muted-foreground">
                  Qty: {item.quantity || 1}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Totals */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₦{formatPrice(totalPrice)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-green-600">Free</span>
        </div>

        {totalPrice > 100000 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Discount</span>
            <span className="text-green-600">
              -₦{formatPrice(totalPrice * 0.1)}
            </span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>
              ₦
              {formatPrice(totalPrice > 100000 ? totalPrice * 0.9 : totalPrice)}
            </span>
          </div>

          {totalPrice > 100000 && (
            <p className="text-sm text-green-600 mt-1">
              You saved ₦{formatPrice(totalPrice * 0.1)}! (10% discount)
            </p>
          )}
        </div>
      </div>

      {/* Checkout Button */}
      {showCheckoutButton && (
        <button
          onClick={onCheckout}
          className="w-full mt-6 bg-[#36d7b7] text-white py-3 rounded-md text-sm font-medium hover:bg-[#2abca0] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={items.length === 0 || checkoutLoading}
        >
          {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
        </button>
      )}

      {/* Continue Shopping Link */}
      {showCheckoutButton && (
        <Link
          to="/shop"
          className="block text-center mt-4 text-[#36d7b7] hover:underline text-sm"
        >
          Continue Shopping
        </Link>
      )}
    </div>
  );
};

export default OrderSummary;
