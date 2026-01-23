import React, { use, useState } from "react";
import { Sliding } from "../common/Sliding";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoginUser, sellerLogin } from "../../service/userApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setSellerLogin } from "../../redux/slices/sellerSlices";
const LoginSeller = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await sellerLogin(data);
      localStorage.setItem("authToken", response.token);
      dispatch(
        setSellerLogin({
          seller: response.data,
          token: response.token,
        })
      );
      toast.success(response.message || "Login successfully");
      navigate("/seller");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage);
      console.error("Login error:", error);
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
          Seller Sign-In
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
              "Sign In"
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-4">
          <p className="mt-3 text-sm text-gray-500">
            Want to be seller?{" "}
            <Link
              to="/seller-signup"
              className=" text-[#36d7b7] hover:underline"
            >
              Signup
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

export default LoginSeller;
