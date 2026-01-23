import { useEffect, useState } from "react";
import { Spinner } from "../components/common/Spinner";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/static/Navbar";
import { Siderbar } from "../components/static/Siderbar";

const useLoading = (delay = 1000) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return loading;
};

export const SellerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loading = useLoading(500); // Reduced loading time for better UX

  // Debug effect to log sidebar state changes
  useEffect(() => {
    console.log('SellerLayout - sidebarOpen changed:', sidebarOpen);
  }, [sidebarOpen]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Siderbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 overflow-y-auto md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};