import { ShoppingBag } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white  shadow-sm dark:bg-[#36d7b7] md:px-14 px-4">
      <div className="w-full max-w-screen-xl mx-auto  md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <ShoppingBag color="white" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Elvana Naturals
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-white sm:mb-0 dark:text-white">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-white sm:text-center dark:text-white">
          © 2025{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            Elvana Natural™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
