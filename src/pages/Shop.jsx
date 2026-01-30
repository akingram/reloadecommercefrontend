import { useState, useEffect } from "react";
import ProductCard from "../components/reuse/ProductCard";
import { SkeletonProductCard } from "../components/reuse/SkeletonComponents";
import { Search, Filter, Grid, List, Leaf, Pill, Heart, Brain, Zap, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllProduct, getShopByCategory } from "../service/userApi";
import { toast } from "react-toastify";

const Shop = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = [
    "All",
    "Multivitamins",
    "Immune Support",
    "Energy Boosters",
    "Digestive Health",
    "Sleep & Relaxation",
    "Joint Support",
    "Weight Management",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data;
        if (selectedCategory === "All") {
          data = await getAllProduct();
        } else {
          const apiCategory = selectedCategory
            .toLowerCase()
            .replace(/ & /g, "-")
            .replace("multivitamins", "multivitamin");
          data = await getShopByCategory(apiCategory);
        }
        // Ensure data is an array
        const productArray = Array.isArray(data) ? data : data.products || [];
        setProducts(
          productArray.map((p) => ({
            ...p,
            title: p.title || "Untitled Product",
            price: Math.round(p.price || 0),
            images: p.images?.length
              ? p.images
              : ["https://via.placeholder.com/150"],
            seller: p.seller?.storeName
              ? { name: p.seller.storeName }
              : { name: "Elvana Partner" },
            isNew: p.createdAt
              ? (new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24) < 7
              : false,
            isSale: p.originalPrice && p.price < p.originalPrice,
            category:
              p.category.toLowerCase() === "clothes"
                ? "multivitamin"
                : p.category.toLowerCase(),
          }))
        );
      } catch (error) {
        toast.error(error.message || "Failed to load products");
        // Fallback mock data for supplements
        setProducts([
          {
            id: "1",
            name: "Complete Multivitamin Complex",
            price: 89000,
            originalPrice: 120000,
            image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            seller: "Elvana Wellness",
            rating: 4.8,
            isNew: true,
            isSale: true,
            category: "multivitamins",
          },
          {
            id: "2",
            name: "Immune Defense Pro",
            price: 65000,
            image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80",
            seller: "Elvana Wellness",
            rating: 4.6,
            isNew: true,
            category: "immune-support",
          },
          {
            id: "3",
            name: "Energy Boost Capsules",
            price: 45000,
            image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            seller: "Elvana Wellness",
            rating: 4.9,
            category: "energy-boosters",
          },
          {
            id: "4",
            name: "Digestive Enzymes Formula",
            price: 125000,
            originalPrice: 180000,
            image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            seller: "Elvana Wellness",
            rating: 4.7,
            isSale: true,
            category: "digestive-health",
          },
          {
            id: "5",
            name: "Sleep Support Melatonin",
            price: 55000,
            image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            seller: "Elvana Wellness",
            rating: 4.5,
            category: "sleep-relaxation",
          },
          {
            id: "6",
            name: "Joint Support Glucosamine",
            price: 150000,
            originalPrice: 200000,
            image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            seller: "Elvana Wellness",
            rating: 4.9,
            isSale: true,
            category: "joint-support",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  // Function to get icon for each category
  const getCategoryIcon = (category) => {
    switch(category.toLowerCase()) {
      case 'multivitamins':
        return <Pill className="h-4 w-4 mr-1" />;
      case 'immune support':
        return <Heart className="h-4 w-4 mr-1" />;
      case 'energy boosters':
        return <Zap className="h-4 w-4 mr-1" />;
      case 'sleep & relaxation':
        return <Moon className="h-4 w-4 mr-1" />;
      case 'brain function':
      case 'brain support':
        return <Brain className="h-4 w-4 mr-1" />;
      default:
        return <Leaf className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full mb-4">
          <Leaf className="h-4 w-4" />
          <span className="text-sm font-medium">100% Natural Supplements</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Elvana Naturals Shop
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover premium natural supplements for optimal health and wellness
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                placeholder="Search supplements, vitamins..."
                className="w-full pl-10 pr-4 py-3 rounded-full border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white h-9 px-4 rounded-full text-sm font-medium flex items-center gap-2 transition-colors">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <div className="flex border-2 border-emerald-100 rounded-full p-1">
              <button
                className={`px-3 h-9 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                  viewMode === "grid"
                    ? "bg-emerald-600 text-white"
                    : "text-emerald-600 hover:bg-emerald-50"
                }`}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
                Grid
              </button>
              <button
                className={`px-3 h-9 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                  viewMode === "list"
                    ? "bg-emerald-600 text-white"
                    : "text-emerald-600 hover:bg-emerald-50"
                }`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
                List
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
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:shadow-md"
              }`}
            >
              {getCategoryIcon(category)}
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full">
          <p className="text-sm text-emerald-700 font-medium">
            Showing {loading ? 0 : products.length} natural supplements
          </p>
          <div className="h-4 w-px bg-emerald-200"></div>
          <p className="text-xs text-emerald-600">
            {selectedCategory !== "All" ? `Category: ${selectedCategory}` : "All Supplements"}
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
          ? Array(8)
              .fill()
              .map((_, i) => (
                <SkeletonProductCard key={i} viewMode={viewMode} />
              ))
          : products.map((product) => (
              <div key={product._id || product.id} className="group">
                <ProductCard
                  product={product}
                  viewMode={viewMode}
                />
                <div className="mt-2 text-center">
                  <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                    {product.category?.replace(/-/g, ' ') || 'Wellness'}
                  </span>
                </div>
              </div>
            ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-12">
        <button className="group relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 h-12 px-8 rounded-full text-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="relative z-10">Load More Supplements</span>
        </button>
        <p className="text-gray-500 text-sm mt-4">
          Discover more natural solutions for your wellness journey
        </p>
      </div>

      {/* Wellness Banner */}
      <div className="mt-16 mb-8">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 text-center border border-emerald-200">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full mb-6">
            <Heart className="h-5 w-5 text-emerald-600" />
            <span className="text-emerald-700 font-medium">Wellness Guarantee</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Not Sure Which Supplement is Right For You?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our wellness experts can help you choose the perfect supplements for your health goals.
            Schedule a free consultation today.
          </p>
          <Link to="/consultation">
            <button className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white h-11 px-8 rounded-full text-lg font-medium transition-colors">
              Get Free Wellness Consultation
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Shop;