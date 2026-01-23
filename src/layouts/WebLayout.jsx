import { useEffect, useState } from "react";
import { Spinner } from "../components/common/Spinner";
import Header from "../components/static/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/static/Footer";

// import { useEffect } from "react";

// useEffect(() => {
//   // Code to run after render

//   return () => {
//     // Cleanup code (runs before component unmount or before next effect)
//   };
// }, [dependencies]);

const useLoading = (delay = 2000) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return loading;
};

export const WebLayout = () => {
  const loading = useLoading();
  return loading ? (
    <Spinner />
  ) : (
    <div className="overflow-hidden ">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};
