// pages/Cart.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  removeItem,
  decreaseQuantity,
  addItem,
  syncCartToBackend,
} from "../redux/slices/cartSlices";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const { status } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.user);
  const seller = useSelector((state) => state.seller.seller);
  const isAuthenticated = !!user || !!seller;

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  // Redirect to login if cart has items but user is not authenticated
  useEffect(() => {
    if (cartItems.length > 0 && !isAuthenticated) {
      toast.info("Please log in to proceed to checkout");
      navigate("/selectpath");
    }
  }, [cartItems.length, isAuthenticated, navigate]);

  // Format price in NGN
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(price));

  // Handle increasing quantity
  const handleIncreaseQuantity = (item) => {
    dispatch(
      addItem({
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
      })
    );
    toast.success(`Increased quantity for ${item.name}`);
  };

  // Handle decreasing quantity
  const handleDecreaseQuantity = (productId, itemName) => {
    dispatch(decreaseQuantity(productId));
    toast.success(`Decreased quantity for ${itemName}`);
  };

  // Handle removing item
  const handleRemoveItem = (productId, itemName) => {
    dispatch(removeItem(productId));
    toast.success(`${itemName} removed from cart`);
  };

  // Handle proceeding to checkout
  const handleProceedToCheckout = () => {
    if (status === "loading") return;

    // Check authentication
    if (!isAuthenticated) {
      toast.info("Please log in to proceed to checkout");
      navigate("/selectpath");
      return;
    }

    // Sync cart to backend before checkout
    dispatch(syncCartToBackend())
      .unwrap()
      .then(() => {
        navigate("/checkout");
      })
      .catch((error) => {
        toast.error(`Sync failed: ${error}`);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-playfair font-bold text-center mb-8">
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-6">
              Your cart is empty
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 bg-[#36d7b7] text-white rounded-md text-sm font-medium hover:bg-[#2abca0] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-card rounded-lg overflow-hidden">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center border-b border-gray-200 p-4 last:border-b-0"
                  >
                    {/* Item Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.image || "https://via.placeholder.com/150"}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 ml-4">
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <p className="text-sm font-semibold mt-1">
                        ₦{formatPrice(item.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Seller: {item.seller}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleDecreaseQuantity(item.productId, item.name)
                        }
                        className="h-8 w-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => handleIncreaseQuantity(item)}
                        className="h-8 w-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() =>
                        handleRemoveItem(item.productId, item.name)
                      }
                      className="ml-4 text-red-500 hover:text-red-600 transition-colors"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-card rounded-lg p-6 sticky top-4">
                <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₦{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₦{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full mt-6 bg-[#36d7b7] text-white py-3 rounded-md text-sm font-medium hover:bg-[#2abca0] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={cartItems.length === 0 || status === "loading"}
                >
                  {status === "loading"
                    ? "Syncing Cart..."
                    : "Proceed to Checkout"}
                </button>

                <Link
                  to="/shop"
                  className="block text-center mt-4 text-[#36d7b7] hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
