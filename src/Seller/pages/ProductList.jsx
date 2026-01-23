import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FilterIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  SearchIcon,
  Package2Icon,
} from "lucide-react";
import {
  getSellerProducts,
  updateProduct,
  deleteProduct,
} from "../../service/userApi";

const categories = [
  "Clothing",
  "Footwear",
  "Bags & Accessories",
  "Undergarments",
  "Kids & Baby Fashion",
];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = useSelector((state) => state.seller.token || null);
  console.log("....token...", token);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    isFeatured: false,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        toast.error("You must be logged in to view your products.");
        navigate("/seller-login");
        return;
      }

      try {
        const data = await getSellerProducts(token, selectedCategory);
        setProducts(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token, navigate, selectedCategory]);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      isFeatured: product.isFeatured,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (productId) => {
    setDeleteProductId(productId);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const response = await updateProduct(
        token,
        selectedProduct._id,
        formData
      );
      setProducts(
        products.map((p) =>
          p._id === selectedProduct._id ? response.product : p
        )
      );
      toast.success(response.message || "Product updated successfully!");
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProductId) return;

    try {
      const response = await deleteProduct(token, deleteProductId);
      setProducts(products.filter((p) => p._id !== deleteProductId));
      toast.success(response.message || "Product deleted successfully!");
      setIsDeleteModalOpen(false);
      setDeleteProductId(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetFilters = () => {
    setSelectedCategory("");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package2Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Seller Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your fashion products
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-4 md:mt-0 sm:flex-row">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary hover:bg-secondary-hover border border-border rounded-md shadow-sm transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <FilterIcon className="w-4 h-4 mr-2" />
              Filters
            </button>
            <button
              onClick={() => navigate("/seller/post-product")}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary-hover border border-transparent rounded-md shadow-sm transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg shadow-sm border border-border mb-6 overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-fast"
              />
            </div>
          </div>
          {filterOpen && (
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-fast"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary hover:bg-secondary-hover border border-border rounded-md transition-colors duration-fast"
                >
                  Reset
                </button>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary-hover border border-transparent rounded-md transition-colors duration-fast"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex justify-center items-center">
            <svg
              className="animate-spin h-8 w-8 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-muted-foreground text-center">
            No products found.
          </p>
        ) : (
          <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Sales
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-muted/30 transition-colors duration-fast"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              product.images[0] ||
                              "https://via.placeholder.com/150"
                            }
                            alt={product.title}
                            className="w-12 h-12 rounded-lg object-cover border border-border"
                          />
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {product.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium  capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        ₦
                        {new Intl.NumberFormat("en-NG", {
                          style: "decimal",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(product.price)}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {product.views}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {product.sales}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {product.isFeatured ? "Yes" : "No"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="p-2 text-primary hover:text-primary-hover hover:bg-primary/10 rounded-md transition-colors duration-fast"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product._id)}
                            className="p-2 text-destructive hover:text-destructive-hover hover:bg-destructive/10 rounded-md transition-colors duration-fast"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {isEditModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-card rounded-lg shadow-lg border border-border m-4">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Edit Product
                </h2>
                <form onSubmit={handleUpdateProduct} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Product Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-fast"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-fast"
                      rows="4"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-fast"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors duration-fast"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isFeatured: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-primary focus:ring-ring border-input rounded"
                      />
                      <span className="ml-2 text-sm text-foreground">
                        Mark as Featured
                      </span>
                    </label>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary hover:bg-secondary-hover border border-border rounded-md transition-colors duration-fast"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary-hover border border-transparent rounded-md transition-colors duration-fast"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-card rounded-lg shadow-lg border border-border m-4">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Confirm Deletion
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Are you sure you want to delete this product? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary hover:bg-secondary-hover border border-border rounded-md transition-colors duration-fast"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive-hover border border-transparent rounded-md transition-colors duration-fast"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
