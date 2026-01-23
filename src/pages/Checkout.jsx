import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ShoppingBag, CreditCard, Shield, Truck } from "lucide-react";
import { toast } from "react-toastify";
import { syncCartToBackend, clearCart } from "../redux/slices/cartSlices";
import { createOrder } from "../service/cartApi";
import OrderSummary from "./OrderSummary";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const { status, sessionId } = useSelector((state) => state.cart);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // Default payment method

  // Get user information for pre-filling form if available
  const user = useSelector((state) => state.user.user);
  const seller = useSelector((state) => state.seller.seller);
  const currentUser = user || seller;

  // react-hook-form setup with user data if available
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      email: currentUser?.email || "",
      address: "",
      country: "NG", // Default to Nigeria
      state: "",
      city: "",
      phone: currentUser?.phone || "",
    },
  });

  // Watch country and state for dynamic dropdowns
  const selectedCountry = watch("country");
  const selectedState = watch("state");

  // Get country, state, and city data
  const countries = Country.getAllCountries();
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry)
    : [];
  const cities = selectedState
    ? City.getCitiesOfState(selectedCountry, selectedState)
    : [];

  // Calculate total price
  const totalPrice = cartItems.reduce(
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

  // Handle form submission
  const onSubmit = async (data) => {
    if (isSubmitting || cartItems.length === 0) return;
    setIsSubmitting(true);

    try {
      // Step 1: Sync cart if not already synced
      if (status !== "succeeded") {
        await dispatch(syncCartToBackend()).unwrap();
      }

      // Step 2: Prepare order data
      const orderData = {
        shippingInfo: data,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: totalPrice,
        paymentMethod: paymentMethod, // Use the selected payment method
        sessionId,
      };

      // Step 3: Create order
      const response = await createOrder(orderData);

      if (response.paymentRequired) {
        // Redirect to Paystack for payment
        window.location.href = response.authorizationUrl;
      } else {
        // For pay on delivery, show success immediately
        toast.success(
          `Order placed successfully! Order ID: ${response.orderId}`
        );

        // Clear cart and redirect
        dispatch(clearCart());
        navigate("/order-confirmation", {
          state: {
            orderId: response.orderId,
            orderTotal: totalPrice,
            shippingInfo: data,
          },
        });
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If cart is empty, show empty state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-playfair font-bold text-center mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-last lg:order-first">
            <OrderSummary items={cartItems} />

            {/* Security Badges */}
            <div className="bg-white shadow-card rounded-lg p-6 mt-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-[#36d7b7]" />
                Secure Checkout
              </h3>
              <div className="flex justify-between">
                <div className="text-center">
                  <Truck className="h-8 w-8 mx-auto text-gray-600" />
                  <p className="text-xs mt-1">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 mx-auto text-gray-600" />
                  <p className="text-xs mt-1">SSL Secure</p>
                </div>
                <div className="text-center">
                  <CreditCard className="h-8 w-8 mx-auto text-gray-600" />
                  <p className="text-xs mt-1">Safe Payments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-card rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">
                Shipping Information
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* First Name and Last Name */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <input
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#36d7b7] focus:border-[#36d7b7] outline-none"
                      placeholder="First Name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <input
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#36d7b7] focus:border-[#36d7b7] outline-none"
                      placeholder="Last Name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Invalid email address",
                        },
                      })}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#36d7b7] focus:border-[#36d7b7] outline-none"
                      placeholder="Email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone *
                    </label>
                    <Controller
                      name="phone"
                      control={control}
                      rules={{
                        required: "Phone number is required",
                        pattern: {
                          value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
                          message: "Please enter a valid phone number",
                        },
                      }}
                      render={({ field }) => (
                        <PhoneInput
                          country={"ng"}
                          value={field.value}
                          onChange={field.onChange}
                          inputClass="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#36d7b7] focus:border-[#36d7b7] outline-none"
                          containerClass="mt-1"
                          buttonClass="border border-gray-300"
                        />
                      )}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <input
                    {...register("address", {
                      required: "Address is required",
                    })}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#36d7b7] focus:border-[#36d7b7] outline-none"
                    placeholder="Street Address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Country *
                    </label>
                    <Controller
                      name="country"
                      control={control}
                      rules={{ required: "Country is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#36d7b7] focus:border-[#36d7b7] outline-none"
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option
                              key={country.isoCode}
                              value={country.isoCode}
                            >
                              {country.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.country.message}
                      </p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      State *
                    </label>
                    <Controller
                      name="state"
                      control={control}
                      rules={{ required: "State is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#36d7b7] focus:border-[#36d7b7] outline-none"
                          disabled={!selectedCountry}
                        >
                          <option value="">Select State</option>
                          {states.map((state) => (
                            <option key={state.isoCode} value={state.isoCode}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City *
                    </label>
                    <Controller
                      name="city"
                      control={control}
                      rules={{ required: "City is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#36d7b7] focus:border-[#36d7b7] outline-none"
                          disabled={!selectedState}
                        >
                          <option value="">Select City</option>
                          {cities.map((city) => (
                            <option key={city.name} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`border rounded-md p-4 cursor-pointer transition-all ${
                        paymentMethod === "card"
                          ? "border-[#36d7b7] bg-[#36d7b7]/10"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="h-4 w-4 text-[#36d7b7] focus:ring-[#36d7b7]"
                        />
                        <label className="ml-2 block text-sm font-medium text-gray-700">
                          Card Payment
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Pay securely with card
                      </p>
                    </div>

                    <div
                      className={`border rounded-md p-4 cursor-pointer transition-all ${
                        paymentMethod === "bank_transfer"
                          ? "border-[#36d7b7] bg-[#36d7b7]/10"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={() => setPaymentMethod("bank_transfer")}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          checked={paymentMethod === "bank_transfer"}
                          onChange={() => setPaymentMethod("bank_transfer")}
                          className="h-4 w-4 text-[#36d7b7] focus:ring-[#36d7b7]"
                        />
                        <label className="ml-2 block text-sm font-medium text-gray-700">
                          Bank Transfer
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Transfer directly from your bank
                      </p>
                    </div>

                    <div
                      className={`border rounded-md p-4 cursor-pointer transition-all ${
                        paymentMethod === "pay_on_delivery"
                          ? "border-[#36d7b7] bg-[#36d7b7]/10"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={() => setPaymentMethod("pay_on_delivery")}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          checked={paymentMethod === "pay_on_delivery"}
                          onChange={() => setPaymentMethod("pay_on_delivery")}
                          className="h-4 w-4 text-[#36d7b7] focus:ring-[#36d7b7]"
                        />
                        <label className="ml-2 block text-sm font-medium text-gray-700">
                          Pay on Delivery
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Pay when your order arrives
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <Link
                    to="/cart"
                    className="text-[#36d7b7] hover:underline font-medium"
                  >
                    &larr; Back to Cart
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting || status === "loading"}
                    className="px-8 py-3 bg-[#36d7b7] text-white rounded-md text-base font-medium hover:bg-[#2abca0] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      `Place Order - ₦${formatPrice(totalPrice)}`
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
