import {
  ChevronDownIcon,
  ChevronUpIcon,
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  LogOutIcon,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setSellerLogout } from "../../redux/slices/sellerSlices";

export const Siderbar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [productsOpen, setProductsOpen] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(setSellerLogout());
    toast.success("Logged out successfully");
    navigate("/seller-login");
    setSidebarOpen(false);
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden ${
          sidebarOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
        onClick={handleOverlayClick}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-auto flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header - removed close button */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <Link to="/" onClick={handleLinkClick}>
            <h1 className="text-xl font-bold text-gray-800">Elvana Naturals™</h1>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <nav className="space-y-2">
            <Link
              to="/seller"
              onClick={handleLinkClick}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                location.pathname === "/seller"
                  ? "bg-[#36d7b7] text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#36d7b7]"
              }`}
            >
              <HomeIcon className="w-5 h-5 mr-3" />
              Dashboard
            </Link>

            {/* Products Section */}
            <div>
              <button
                onClick={() => setProductsOpen(!productsOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname.includes("/seller/product") ||
                  location.pathname.includes("/seller/post-product")
                    ? "bg-[#36d7b7] text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-[#36d7b7]"
                }`}
              >
                <div className="flex items-center">
                  <ShoppingBagIcon className="w-5 h-5 mr-3" />
                  Products
                </div>
                {productsOpen ? (
                  <ChevronUpIcon className="w-4 h-4" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4" />
                )}
              </button>
              
              {productsOpen && (
                <div className="pl-8 mt-1 space-y-1">
                  <Link
                    to="/seller/product"
                    onClick={handleLinkClick}
                    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === "/seller/product"
                        ? "bg-[#36d7b7] text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-[#36d7b7]"
                    }`}
                  >
                    Product List
                  </Link>
                  <Link
                    to="/seller/post-product"
                    onClick={handleLinkClick}
                    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === "/seller/post-product"
                        ? "bg-[#36d7b7] text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-[#36d7b7]"
                    }`}
                  >
                    Create Product
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/seller/seller-orders"
              onClick={handleLinkClick}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                location.pathname.includes("/seller/seller-orders")
                  ? "bg-[#36d7b7] text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#36d7b7]"
              }`}
            >
              <ShoppingCartIcon className="w-5 h-5 mr-3" />
              Orders
            </Link>

            <Link
              to="/seller/seller-profile"
              onClick={handleLinkClick}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                location.pathname.includes("/seller/seller-profile")
                  ? "bg-[#36d7b7] text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#36d7b7]"
              }`}
            >
              <Settings className="w-5 h-5 mr-3" />
              Profile Settings
            </Link>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-lg hover:bg-gray-100 hover:text-red-600"
          >
            <LogOutIcon className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};