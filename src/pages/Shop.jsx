import { useState, useEffect } from "react";
import ProductCard from "../components/reuse/ProductCard";
import { SkeletonProductCard } from "../components/reuse/SkeletonComponents";
import { Search, Filter, Grid, List } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllProduct, getShopByCategory } from "../service/userApi";
import { toast } from "react-toastify";

const Shop = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  // const categories = [
  //   "All",
  //   "Clothing",
  //   "Footwear",
  //   "Bags & Accessories",
  //   "Undergarments",
  //   "Kids & Baby Fashion",
  // ];

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
            .replace("clothes", "clothing");
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
              : { name: "Unknown Seller" },
            isNew: p.createdAt
              ? (new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24) < 7
              : false,
            isSale: p.originalPrice && p.price < p.originalPrice,
            category:
              p.category.toLowerCase() === "clothes"
                ? "clothing"
                : p.category.toLowerCase(),
          }))
        );
      } catch (error) {
        toast.error(error.message || "Failed to load products");
        // Fallback mock data
        setProducts([
          {
            id: "1",
            name: "Elegant Summer Dress",
            price: 89000,
            originalPrice: 120000,
            image:
              "https://i.pinimg.com/1200x/91/21/1d/91211d8810be0fb4456aca94730515f7.jpg",
            seller: "Boutique Style",
            rating: 4.8,
            isNew: true,
            isSale: true,
            category: "clothing",
          },
          {
            id: "2",
            name: "Classic Sneakers",
            price: 65000,
            image:
              "https://i.pinimg.com/1200x/91/21/1d/91211d8810be0fb4456aca94730515f7.jpg",
            seller: "Urban Fashion",
            rating: 4.6,
            isNew: true,
            category: "footwear",
          },
          {
            id: "3",
            name: "Minimalist Tote Bag",
            price: 45000,
            image:
              "https://i.pinimg.com/1200x/91/21/1d/91211d8810be0fb4456aca94730515f7.jpg",
            seller: "Eco Accessories",
            rating: 4.9,
            category: "bags-accessories",
          },
          {
            id: "4",
            name: "Luxury Briefs",
            price: 125000,
            originalPrice: 180000,
            image:
              "https://i.pinimg.com/1200x/91/21/1d/91211d8810be0fb4456aca94730515f7.jpg",
            seller: "Retro Vibes",
            rating: 4.7,
            isSale: true,
            category: "undergarments",
          },
          {
            id: "5",
            name: "Kids Denim Jacket",
            price: 55000,
            image:
              "https://i.pinimg.com/1200x/91/21/1d/91211d8810be0fb4456aca94730515f7.jpg",
            seller: "Boho Chic",
            rating: 4.5,
            category: "kids-baby-fashion",
          },
          {
            id: "6",
            name: "Designer Sunglasses",
            price: 150000,
            originalPrice: 200000,
            image:
              "https://i.pinimg.com/1200x/91/21/1d/91211d8810be0fb4456aca94730515f7.jpg",
            seller: "Luxury Finds",
            rating: 4.9,
            isSale: true,
            category: "bags-accessories",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-playfair font-bold mb-4">Shop Fashion</h1>
        <p className="text-muted-foreground">
          Discover unique pieces from our community of sellers
        </p>
      </div>

      {/* Search and Filters
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <div className="flex border rounded-lg p-1">
              <button
                className={`px-3 h-9 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                className={`px-3 h-9 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Categories */}
      {/* <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/categories/${category.toLowerCase().replace(/ & /g, "-")}`}
              onClick={() => setSelectedCategory(category)}
              className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-smooth ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>
      </div> */}

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {loading ? 0 : products.length} results
        </p>
      </div>

      {/* Products Grid/List */}
      <div
        className={`grid gap-4 ${
          viewMode === "grid"
            ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            : "grid-cols-1 lg:grid-cols-3"
        }`}
      >
        {loading
          ? Array(6)
              .fill()
              .map((_, i) => (
                <SkeletonProductCard key={i} viewMode={viewMode} />
              ))
          : products.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                viewMode={viewMode}
              />
            ))}
      </div>

      <div className="text-center mt-12">
        <button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 rounded-md text-lg font-medium transition-colors">
          Load More Products
        </button>
      </div>
    </div>
  );
};

export default Shop;
