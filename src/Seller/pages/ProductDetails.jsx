import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  PhotographIcon,
  TagIcon,
  CurrencyDollarIcon,
  CubeIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../util/slices/productSlice";


function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch(); // Get dispatch function
  const { currentProduct, loading, error } = useSelector((state) => state.product); // Select from Redux state

  const [activeImage, setActiveImage] = useState(0);

  // Fetch product when component mounts or when id changes
  useEffect(() => {
    dispatch(fetchProductById(id)); // Dispatch the thunk to fetch product by ID
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2196F3]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800">Error</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <Link
          to="/products"
          className="mt-4 inline-flex items-center text-sm font-medium text-[#2196F3] hover:text-[#1976D2]"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back to Products
        </Link>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800">Product not found</h2>
        <p className="mt-2 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/products"
          className="mt-4 inline-flex items-center text-sm font-medium text-[#2196F3] hover:text-[#1976D2]"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back to Products
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div>
      <div className="flex flex-col mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/products"
            className="inline-flex items-center text-sm font-medium text-[#2196F3] hover:text-[#1976D2]"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Products
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-gray-800">{currentProduct.name}</h1>
          <p className="text-gray-600">SKU: {currentProduct.sku}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Product Images */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Product Images</h2>
            </div>
            <div className="p-4">
              <div className="mb-4 overflow-hidden bg-gray-100 rounded-lg aspect-square">
                {currentProduct.images && currentProduct.images.length > 0 ? (
                  <img
                    src={currentProduct.images[activeImage] || "/placeholder.svg"}
                    alt={currentProduct.name}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <PhotographIcon className="w-16 h-16 text-gray-400" />
                    <span className="sr-only">No image available</span>
                  </div>
                )}
              </div>
              {currentProduct.images && currentProduct.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {currentProduct.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`aspect-square rounded-md overflow-hidden border-2 ${
                        activeImage === index ? "border-[#2196F3]" : "border-transparent"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Product thumbnail ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 overflow-hidden bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Product Status</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">Published</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    currentProduct.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {currentProduct.published ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Yes
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-4 h-4 mr-1" />
                      No
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">Featured</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    currentProduct.featured ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {currentProduct.featured ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Yes
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-4 h-4 mr-1" />
                      No
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">Created</span>
                <span className="text-sm text-gray-500">{formatDate(currentProduct.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">Last Updated</span>
                <span className="text-sm text-gray-500">{formatDate(currentProduct.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Basic Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Product Name</h3>
                  <p className="mt-1 text-sm text-gray-900">{currentProduct.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">SKU</h3>
                  <p className="mt-1 text-sm text-gray-900">{currentProduct.sku}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <div className="flex items-center mt-1">
                    <TagIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                    <span className="text-sm text-gray-900">{currentProduct.category}</span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-sm text-gray-900">{currentProduct.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Pricing & Inventory</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Price</h3>
                  <div className="flex items-center mt-1">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                    <span className="text-sm text-gray-900">${currentProduct.price.toFixed(2)}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Cost Price</h3>
                  <div className="flex items-center mt-1">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                    <span className="text-sm text-gray-900">${currentProduct.costPrice.toFixed(2)}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Stock Quantity</h3>
                  <div className="flex items-center mt-1">
                    <ShoppingCartIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                    <span className="text-sm text-gray-900">{currentProduct.stock} units</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Weight</h3>
                  <div className="flex items-center mt-1">
                    <CubeIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                    <span className="text-sm text-gray-900">{currentProduct.weight} grams</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Brand Information</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                  <div className="w-40 h-20 overflow-hidden bg-gray-100 rounded-md">
                    <img
                      src={currentProduct.brandLogo || "/placeholder.svg"}
                      alt={`${currentProduct.brandName} logo`}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Brand Name</h3>
                  <p className="mt-1 text-sm text-gray-900">{currentProduct.brandName}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Product Details</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Container Type</h3>
                  <p className="mt-1 text-sm text-gray-900">{currentProduct.containerType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Product Form</h3>
                  <p className="mt-1 text-sm text-gray-900">{currentProduct.productForm}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;