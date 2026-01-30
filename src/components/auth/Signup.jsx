import React, { use, useState } from "react";
import { Sliding } from "../common/Sliding";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createUser } from "../../service/userApi";
import { toast } from "react-toastify";
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await createUser(data);
      console.log("User created successfully:", response);
      toast.success(response.message || "User created successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
      console.error("Signup error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="flex flex-col w-full h-screen lg:pl-[500px] items-center justify-center">
      <Sliding />
      {/* Form Path */}
      <div className="w-full max-w-md px-4">
        <h1 className="mb-6 text-xl font-bold text-center sm:text-2xl sm:mb-8">
          User Sign-Up
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-500"
            >
              Username
            </label>
            <input
              type="text"
              className={` w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#36d7b7]  ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

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
            className="w-full px-5 py-3 mt-4 text-white rounded-md bg-[#36d7b7] text-lg font-bold hover:bg-[#2ebfa1] flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin"></div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-4">
          <p className="mt-3 text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className=" text-[#36d7b7] hover:underline">
              Login
            </Link>
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Login as a seller?{" "}
            <Link
              to="/seller-login"
              className=" text-[#36d7b7] hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Signup;
