import React, { use, useState } from "react";
import { Sliding } from "../common/Sliding";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createrSeller, createUser } from "../../service/userApi";
import { toast } from "react-toastify";
const SignupSeller = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const allCategories = [
    "Clothing",
    "Footwear",
    "Bags & Accessories",
    "Undergarments",
    "Kids & Baby Fashion",
  ];
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await createrSeller(data);
      console.log("User created successfully:", response);
      toast.success(response.message || "User created successfully");
      navigate("/seller-login");
    } catch (error) {
      toast.error(error.message);
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="flex flex-col w-full h-screen lg:pl-[500px] items-center justify-center">
      <Sliding />
      {/* Form Path */}
      <div className="w-full max-w-2xl px-4">
        <h1 className="mb-6 text-xl font-bold text-center sm:text-2xl sm:mb-8">
          Seller Sign-Up
        </h1>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          {/* store Name */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-500"
            >
              Business Name
            </label>
            <input
              type="text"
              className={` w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#36d7b7]  ${
                errors.storeName ? "border-red-500" : "border-gray-300"
              }`}
              {...register("storeName", {
                required: "Business name is required",
              })}
            />
            {errors.storeName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.storeName.message}
              </p>
            )}
          </div>
          {/* seller email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-500"
            >
              Email Address
            </label>
            <input
              type="email"
              className={` w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#36d7b7]  ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* seller number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-500"
            >
              Phone Number
            </label>
            <input
              type="text"
              className={` w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#36d7b7]  ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              {...register("phoneNumber", {
                required: "Phone number is required",
              })}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-500"
            >
              Address
            </label>
            <input
              type="text"
              className={` w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#36d7b7]  ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              {...register("address", { required: "address is required" })}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* categories */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-500"
            >
              Business Category
            </label>
            <select
              name="categories"
              id=""
              className={` w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#36d7b7]  ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              {...register("categories", { required: "Pick a category" })}
            >
              <option value="">--/--</option>
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {errors.categories && (
              <p className="mt-1 text-sm text-red-500">
                {errors.categories.message}
              </p>
            )}
          </div>

          {/* password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-500"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={` w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#36d7b7] ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                {...register("password", { required: "Password is required" })}
              />
              <span
                className="absolute text-gray-500 transform cursor-pointer right-5 top-4"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            className="w-full  px-5 py-3 mt-4 text-white rounded-md bg-[#36d7b7] text-lg font-bold hover:bg-[#2ebfa1] flex justify-center items-center md:col-span-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin"></div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-3">
          <p className="mt-3 text-sm text-center text-gray-500">
            Already a seller?{" "}
            <Link
              to="/seller-login"
              className=" text-[#36d7b7] hover:underline"
            >
              Login
            </Link>
          </p>

          <p className="mt-3 text-sm text-gray-500">
            Become a Buyer?{" "}
            <Link to="/signup" className=" text-[#36d7b7] hover:underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignupSeller;
