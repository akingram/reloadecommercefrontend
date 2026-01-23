import React from "react";
import { Sliding } from "../common/Sliding";
import { Link } from "react-router-dom";

const Selectpath = () => {
  return (
    <section className="flex flex-col w-full h-screen lg:pl-[500px] items-center justify-center">
        <Sliding />


        {/* Optional path */}
        <div className="w-full max-w-md px-4">
          <h1 className="mb-6 text-xl font-bold text-center sm:text-2xl sm:mb-8">
            Choose Your Option
          </h1>
          <div className="flex flex-col items-center justify-center ">
            <Link
              to="/login"
              className="w-full px-5 py-6 mb-4 text-white rounded-md bg-[#36d7b7] text-xl font-bold text-center"
            >
              Login as User
            </Link>
            <Link to="/seller-login" className="w-full px-5 py-6 mb-4 text-white rounded-md bg-[#36d7b7] text-xl font-bold text-center">
              Login as Seller
            </Link>
          </div>
        </div>
      
    </section>
  );
};

export default Selectpath;
