import React, { useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { setUserLogout } from "../../redux/slices/userSlices";
import { IoMdLogOut } from "react-icons/io";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state) => state.user?.user || null);
  const seller = useSelector((state) => state.seller?.seller || null);
  const cartItems = useSelector((state) => state.cart.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Safe access to user and seller properties
  const firstLetter = user?.username ? user.username.charAt(0).toUpperCase() : "U";
  const sellerLetter = seller?.storeName ? seller.storeName.charAt(0).toUpperCase() : "S";

  const totalQuantity = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const handleLogout = () => {
    dispatch(setUserLogout());
    setIsMenuOpen(false);
    navigate("/selectpath");
  };

  const handleMobileLinkClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: "Home", path: "/", current: location.pathname === "/" },
    { name: "Shop", path: "/shop", current: location.pathname === "/shop" },
    { name: "About", path: "/about", current: location.pathname === "/about" },
    { name: "Contact", path: "/contact", current: location.pathname === "/contact" },
  ];

  return (
    <header className="flex items-center justify-between w-full h-20 px-5 shadow-lg md:px-14 bg-white sticky top-0 z-50">
      {/* Logo */}
      <div className="md:text-xl text-[20px] font-semibold">
       <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#36d7b7] to-[#2ebfa1] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <span className="text-white font-bold text-lg">EN</span>
            </div>
            <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-800 to-[#36d7b7] bg-clip-text text-transparent">
              Elvana Naturals
            </span>
          </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block" role="navigation">
        <ul className="flex gap-8">
          {navigation.map((item) => (
            <li key={item.name} className="font-semibold">
              <Link
                to={item.path}
                className={`transition-all duration-200 px-3 py-2 rounded-lg ${
                  item.current 
                    ? "text-[#36d7b7] bg-[#36d7b7]/10" 
                    : "text-gray-600 hover:text-[#36d7b7] hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search & Cart */}
        <div className="flex items-center gap-4">
          
          <Link
            to="/cart"
            className="relative p-2 text-gray-600 hover:text-[#36d7b7] transition-all duration-200 rounded-full hover:bg-gray-100 active:scale-95"
            aria-label="Shopping Cart"
          >
            <FaShoppingCart size={20} />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 text-xs text-white bg-[#36d7b7] rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-md">
                {totalQuantity}
              </span>
            )}
          </Link>
        </div>

        {/* User/Seller Profile */}
        <div className="flex items-center gap-1">
          {seller ? (
            <>
              <Link 
                to="/seller" 
                className="p-1 transition-all duration-200 rounded-full hover:bg-gray-100 active:scale-95"
              >
                <div className="font-bold text-lg bg-[#36d7b7] text-white rounded-full h-8 w-8 flex justify-center items-center ring-2 ring-[#36d7b7]/20 hover:ring-[#36d7b7]/40 transition-all">
                  {sellerLetter}
                </div>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-gray-100 active:scale-95 hidden md:block"
                aria-label="Logout"
              >
                <IoMdLogOut size={20} />
              </button>
            </>
          ) : user ? (
            <>
              <Link 
                to="/" 
                className="p-1 transition-all duration-200 rounded-full hover:bg-gray-100 active:scale-95"
              >
                <div className="font-bold text-lg bg-[#36d7b7] text-white rounded-full h-8 w-8 flex justify-center items-center ring-2 ring-[#36d7b7]/20 hover:ring-[#36d7b7]/40 transition-all">
                  {firstLetter}
                </div>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-gray-100 active:scale-95 hidden md:block"
                aria-label="Logout"
              >
                <IoMdLogOut size={20} />
              </button>
            </>
          ) : (
            <Link
              to="/selectpath"
              className="px-4 py-2 bg-[#36d7b7] text-white rounded-lg text-sm hidden md:block hover:bg-[#2ebfa1] transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-gray-600 hover:text-[#36d7b7] transition-all duration-200 rounded-full hover:bg-gray-100 active:scale-95 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <MdMenu size={25} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 w-full bg-white shadow-xl top-20 z-50 md:hidden border-t border-gray-200">
          <div className="p-4">
            <ul className="flex flex-col gap-2">
              {navigation.map((item) => (
                <li key={item.name} className="w-full">
                  <button
                    onClick={() => handleMobileLinkClick(item.path)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 active:scale-95 ${
                      item.current
                        ? "text-[#36d7b7] bg-[#36d7b7]/10"
                        : "text-gray-700 hover:text-[#36d7b7] hover:bg-gray-100"
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
              
              {/* Mobile Auth Buttons */}
              <div className="border-t border-gray-200 mt-3 pt-4">
                {!user && !seller ? (
                  <button
                    onClick={() => handleMobileLinkClick("/selectpath")}
                    className="w-full px-4 py-3 bg-[#36d7b7] text-white rounded-lg font-semibold hover:bg-[#2ebfa1] transition-all duration-200 active:scale-95 text-center"
                  >
                    Get Started
                  </button>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-500 transition-all duration-200 active:scale-95 text-center"
                  >
                    Logout
                  </button>
                )}
              </div>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;