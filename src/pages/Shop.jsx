import { useState, useEffect } from "react";
import ProductCard from "../components/reuse/ProductCard";
import { SkeletonProductCard } from "../components/reuse/SkeletonComponents";
import { Search, Filter, Grid, List, Leaf, Heart, Zap, Users, Baby, Gem, Sparkles } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllProduct, getShopByCategory } from "../service/userApi";
import { toast } from "react-toastify";

const Shop = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Read category from URL param (set by Home page category clicks)
  const selectedCategory = searchParams.get("category") || "All";

  const setSelectedCategory = (cat) => {
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  // Exact category names matching what is stored in DB (lowercase due to schema)
  const categories = [
    { name: "All", label: "All", icon: Grid },
    { name: "reload products for men", label: "For Men", icon: Users },
    { name: "reload products for women", label: "For Women", icon: Heart },
    { name: "reload products for kids", label: "For Kids", icon: Baby },
    { name: "reload specialty", label: "Specialty", icon: Sparkles },
    { name: "reload platinum plus", label: "Platinum Plus", icon: Gem },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data;
        if (selectedCategory === "All") {
          data = await getAllProduct();
        } else {
          // Pass category name exactly as-is — no transformation
          data = await getShopByCategory(selectedCategory);
        }
        const productArray = Array.isArray(data) ? data : data.products || [];
        setProducts(productArray);
      } catch (error) {
        toast.error(error.message || "Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const activeCategory = categories.find((c) => c.name === selectedCategory) || categories[0];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full mb-4">
          <Leaf className="h-4 w-4" />
          <span className="text-sm font-medium">100% Natural Products</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          {selectedCategory === "All" ? "All Products" : activeCategory.label}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {selectedCategory === "All"
            ? "Browse all our premium natural products"
            : `Showing products in: ${activeCategory.label}`}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 rounded-full border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex border-2 border-emerald-100 rounded-full p-1">
              <button
                className={`px-3 h-9 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${viewMode === "grid" ? "bg-emerald-600 text-white" : "text-emerald-600 hover:bg-emerald-50"}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" /> Grid
              </button>
              <button
                className={`px-3 h-9 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${viewMode === "list" ? "bg-emerald-600 text-white" : "text-emerald-600 hover:bg-emerald-50"}`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" /> List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === category.name
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:shadow-md"
              }`}
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full">
          <p className="text-sm text-emerald-700 font-medium">
            Showing {loading ? "..." : products.length} products
          </p>
          <div className="h-4 w-px bg-emerald-200" />
          <p className="text-xs text-emerald-600">
            {selectedCategory !== "All" ? `Category: ${activeCategory.label}` : "All Products"}
          </p>
        </div>
      </div>

      {/* Products Grid/List */}
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1 lg:grid-cols-2"
        }`}
      >
        {loading
          ? Array(8).fill().map((_, i) => <SkeletonProductCard key={i} viewMode={viewMode} />)
          : products.length > 0
            ? products.map((product) => (
                <div key={product._id} className="group">
                  <ProductCard product={product} viewMode={viewMode} />
                </div>
              ))
            : (
              <div className="col-span-4 text-center py-16">
                <Leaf className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No products found in this category</p>
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  View All Products
                </button>
              </div>
            )
        }
      </div>

      {/* Wellness Banner */}
      <div className="mt-16 mb-8">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 text-center border border-emerald-200">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full mb-6">
            <Heart className="h-5 w-5 text-emerald-600" />
            <span className="text-emerald-700 font-medium">Quality Guarantee</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Not Sure Which Product is Right For You?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Our team can help you find the perfect product for your needs.</p>
          <Link to="/contact">
            <button className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white h-11 px-8 rounded-full text-lg font-medium transition-colors">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Shop;