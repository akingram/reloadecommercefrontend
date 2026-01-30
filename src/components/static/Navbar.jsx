import { BellIcon, MenuIcon, UserCircleIcon, X } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const seller = useSelector((state) => state.seller?.seller);
  const sellerFirstLetter = seller?.storeName?.charAt(0)?.toUpperCase() || "S";

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleCloseClick = () => {
    setSidebarOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 bg-white shadow">
      {/* Menu/Close button - always visible on mobile */}
      <div className="flex items-center">
        {sidebarOpen ? (
          // Close button when sidebar is open
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none  md:hidden"
            onClick={handleCloseClick}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="w-6 h-6" />
          </button>
        ) : (
          // Menu button when sidebar is closed
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none  md:hidden"
            onClick={handleMenuClick}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex justify-between flex-1 px-4">
        <div className="flex items-center flex-1">
          <h1 className="hidden text-xl font-semibold text-gray-800 md:block">
            Dashboard
          </h1>
          <h1 className="text-xl font-semibold text-gray-800 md:hidden">
            <Link to="/">Elvana Naturals</Link>
          </h1>
        </div>
        <div className="flex items-center ml-4 md:ml-6">
          <button
            type="button"
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#36d7b7]"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* Profile dropdown */}
          <div className="relative ml-3">
            <div>
              {sellerFirstLetter ? (
                <div
                  className="cursor-pointer font-bold text-lg bg-[#36d7b7] text-white rounded-full h-8 w-8 flex justify-center items-center ring-2"
                >
                  {sellerFirstLetter}
                </div>
              ) : (
                <div
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#36d7b7]"
                >
                  <span className="sr-only">Open user menu</span>
                  <UserCircleIcon
                    className="w-8 h-8 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};