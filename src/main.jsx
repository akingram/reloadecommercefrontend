import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { mainRouter } from "./router/mainRouter";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ToastContainer position="top-right" autoClose={4000} />
      <RouterProvider router={mainRouter} />
    </PersistGate>
  </Provider>
);
