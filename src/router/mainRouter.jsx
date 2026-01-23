import { lazy, Suspense } from "react";
import { Spinner } from "../components/common/Spinner";
import { createBrowserRouter } from "react-router-dom";
import { WebLayout } from "../layouts/WebLayout";
import { SellerLayout } from "../layouts/Seller";
// import { Dashboard } from "../Seller/pages/Dashboard";
// import { Product } from "../Seller/pages/Product";
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const Shop = lazy(() => import("../pages/Shop"));
const ProductDetails = lazy(() => import("../pages/ProductDetails"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Signup = lazy(() => import("../components/auth/Signup"));
const Login = lazy(() => import("../components/auth/Signin"));
const SignupSeller = lazy(() => import("../components/auth/SignupSeller"));
const LoginSeller = lazy(() => import("../components/auth/LoginSeller"));
const Selectpath = lazy(() => import("../components/auth/Selectpath"));
const Cart = lazy(() => import("../pages/Cart"));
const Orders = lazy(() => import("../pages/Orders"));
// seller pages
const Dashboard = lazy(() => import("../Seller/pages/Dashboard"));
const ProductFrom = lazy(() => import("../Seller/pages/ProductForm"));
const ProductList = lazy(() => import("../Seller/pages/ProductList"));
const PaymentVerification = lazy(() => import("../pages/PaymentVerification"));
const OrderConfirmation = lazy(() => import("../pages/OrderConfirmation"));
const SellerOrder = lazy(() => import("../Seller/pages/Orders"));
const SellerOrderDetails = lazy(() => import("../Seller/pages/OrderDetails"));
const Profile = lazy(() => import("../Seller/pages/Profile"));

const withSuspense = (Component) => (
  <Suspense fallback={<Spinner />}>
    <Component />
  </Suspense>
);

const rotuerConfig = [
  {
    path: "/",
    element: <WebLayout />,
    children: [
      {
        index: true,
        element: withSuspense(Home),
      },
      {
        path: "about",
        element: withSuspense(About),
      },
      {
        path: "contact",
        element: withSuspense(Contact),
      },
      {
        path: "checkout",
        element: withSuspense(Checkout),
      },
      {
        path: "shop",
        element: withSuspense(Shop),
      },
      { path: "/cart", element: withSuspense(Cart) },
      // In your App.js or routing file
      { path: "/order-confirmation", element: withSuspense(OrderConfirmation) },
      {
        path: "/orders",
        element: withSuspense(Orders),
      },
      {
        path: "/orders/:id",
        element: withSuspense(Orders),
      },
      {
        path: "product/:id",
        element: withSuspense(ProductDetails),
      },
    ],
  },
  {
    path: "/seller",
    element: <SellerLayout />,
    children: [
      {
        index: true,
        element: withSuspense(Dashboard),
      },
      {
        path: "post-product",
        element: withSuspense(ProductFrom),
      },
      {
        path: "product",
        element: withSuspense(ProductList),
      },
      {
        path: "post-product",
        element: withSuspense(ProductFrom),
      },
      {
        path: "seller-orders", element: withSuspense(SellerOrder)
      },
      {
        path: "seller-profile", element: withSuspense(Profile)
      },
      {
        path: "orders/:orderId", // Use orderId instead of id for clarity
        element: withSuspense(SellerOrderDetails) // This shows specific order details
      },
    ],
  },

  { path: "/signup", element: withSuspense(Signup) },
  { path: "/login", element: withSuspense(Login) },

  { path: "/seller-signup", element: withSuspense(SignupSeller) },
  { path: "/seller-login", element: withSuspense(LoginSeller) },
  { path: "/selectpath", element: withSuspense(Selectpath) },
  { path: "/payment-success", element: withSuspense(PaymentVerification) },
  { path: "/payment-verify", element: withSuspense(PaymentVerification) },
];

export const mainRouter = createBrowserRouter(rotuerConfig);
