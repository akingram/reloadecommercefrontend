import { useState, useEffect } from "react";
import ProductCard from "../components/reuse/ProductCard";
import {
  SkeletonProductCard,
  SkeletonCollectionCard,
  SkeletonCategoryCard,
} from "../components/reuse/SkeletonComponents";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Star,
  Quote,
  Mail,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react";
import heroImage from "../assets/images/homebg.jpg";
import { Link } from "react-router-dom";
import {
  getAllProduct, // Import the getAllProduct endpoint
  getWhatsHotThisWeek,
  getFeaturedCollections,
  getShopByCategory,
  getStyleInspiration,
} from "../service/userApi";
import { useSelector } from "react-redux";

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [featuredCollections, setFeaturedCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inspirationProducts, setInspirationProducts] = useState([]);
  const [loading, setLoading] = useState({
    trending: true,
    hot: true,
    collections: true,
    categories: true,
    inspiration: true,
  });
const seller = useSelector((state) => state.seller?.seller || null);
const dashboardLink = seller?.seller?._id ? "/seller" : "/seller-login"
  const features = [
    {
      icon: Sparkles,
      title: "Curated Collection",
      description: "Hand-picked items from verified sellers",
    },
    {
      icon: ShieldCheck,
      title: "Secure Shopping",
      description: "Protected payments and buyer guarantee",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Free shipping on orders over ₦50,000",
    },
  ];

  const testimonials = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar:
        "https://i.pinimg.com/736x/ae/f5/ab/aef5ab486f2e361248cde0722fe2fcac.jpg",
      rating: 5,
      comment:
        "Amazing quality and fast shipping! Found my new favorite dress here.",
    },
    {
      id: "2",
      name: "Emma Davis",
      avatar:
        "https://i.pinimg.com/736x/ae/f5/ab/aef5ab486f2e361248cde0722fe2fcac.jpg",
      rating: 5,
      comment:
        "Great platform for discovering unique fashion pieces. Highly recommended!",
    },
    {
      id: "3",
      name: "Maria Garcia",
      avatar:
        "https://i.pinimg.com/736x/ae/f5/ab/aef5ab486f2e361248cde0722fe2fcac.jpg",
      rating: 5,
      comment:
        "Love the variety and the quality of items. Customer service is excellent.",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Trending This Week using getAllProduct
        const trending = await getAllProduct(); // Fetch all products without category filter
        setTrendingProducts(
          trending.map((p) => ({
            ...p,
            isNew:
              (new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24) < 7,
            isSale: p.originalPrice && p.price < p.originalPrice,
          }))
        );
        setLoading((prev) => ({ ...prev, trending: false }));

        // Fetch What's Hot This Week
        const hot = await getWhatsHotThisWeek();
        setHotProducts(
          hot.map((p) => ({
            ...p,
            isNew:
              (new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24) < 7,
            isSale: p.originalPrice && p.price < p.originalPrice,
          }))
        );
        setLoading((prev) => ({ ...prev, hot: false }));

        // Fetch Featured Collections
        const collections = await getFeaturedCollections();
        setFeaturedCollections(
          collections.map((p) => ({
            id: p._id,
            name: p.title,
            image: p.images?.[0] || "https://via.placeholder.com/150",
            itemCount: Math.floor(Math.random() * 20) + 10, // Mock item count
          }))
        );
        setLoading((prev) => ({ ...prev, collections: false }));

        // Fetch Categories (mock categories with counts from products)
        const categoryList = [
          "Dresses",
          "Tops",
          "Bottoms",
          "Outerwear",
          "Accessories",
          "Shoes",
        ];
        const categoryData = await Promise.all(
          categoryList.map(async (cat) => {
            const products = await getShopByCategory(cat.toLowerCase());
            return {
              name: cat,
              image:
                products[0]?.images?.[0] || "https://via.placeholder.com/150",
              count: products.length,
            };
          })
        );
        setCategories(categoryData);
        setLoading((prev) => ({ ...prev, categories: false }));

        // Fetch Style Inspiration
        const inspiration = await getStyleInspiration();
        setInspirationProducts(
          inspiration.map((p) => ({
            ...p,
            isNew:
              (new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24) < 7,
            isSale: p.originalPrice && p.price < p.originalPrice,
          }))
        );
        setLoading((prev) => ({ ...prev, inspiration: false }));
      } catch (error) {
        console.error("Failed to fetch data:", error.message);
        setLoading({
          trending: false,
          hot: false,
          collections: false,
          categories: false,
          inspiration: false,
        });
      }
    };
    fetchData();
  }, []);

  return (
    // ... rest of the component remains unchanged
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6">
            Your Style,
            <span className="block text-accent">Your Story</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light">
            Discover unique fashion pieces and connect with sellers worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-stretch sm:items-center">
            {/* Shop Now Button */}
            <Link
              to="/shop"
              className="group relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground h-12 sm:h-14 px-8 sm:px-10 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <span className="text-base sm:text-lg font-semibold relative z-10">
                Shop Now
              </span>
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
            </Link>

            {/* Start Selling Button */}
            <Link
              to={dashboardLink}
              className="group relative bg-secondary/10 text-secondary-foreground border-2 border-secondary/20 hover:border-secondary/40 hover:bg-secondary/20 h-12 sm:h-14 px-8 sm:px-10 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
            >
              {/* Subtle background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-secondary/5 bg-white group-hover:opacity-100 transition-opacity duration-500" />

              <span className="text-base sm:text-lg font-semibold relative z-10">
                Start Selling
              </span>
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center bg-card rounded-lg shadow-card p-8"
              >
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
              Featured
            </span>
            <h2 className="text-4xl font-playfair font-bold mb-4">
              Trending This Week
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the most loved items from our community of sellers
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {loading.trending
              ? Array(4)
                  .fill()
                  .map((_, i) => <SkeletonProductCard key={i} />)
              : trendingProducts
                  .slice(0, 10)
                  .map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/shop">
              <button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 rounded-md text-lg font-medium flex items-center gap-2 mx-auto transition-colors">
                View All Products
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>


      {/* Featured Collections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold mb-4">
              Featured Collections
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Curated collections for every style and occasion
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {loading.collections
              ? Array(3)
                  .fill()
                  .map((_, i) => <SkeletonCollectionCard key={i} />)
              : featuredCollections.slice(0, 4).map((collection) => (
                  <Link
                    key={collection.id}
                    to="/shop"
                    className="group overflow-hidden rounded-lg bg-card shadow-card hover:shadow-elegant transition-smooth cursor-pointer"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-semibold mb-1">
                          {collection.name}
                        </h3>
                        <p className="text-sm opacity-90">
                          {collection.itemCount} items
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

    

      {/* Special Offers */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                Limited Time
              </span>
              <h2 className="text-4xl font-playfair font-bold mb-6">
                Special Offers Just for You
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Up to 50% off on selected items</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Free shipping on orders over ₦50,000</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Extra 10% off for new customers</span>
                </div>
              </div>
              <Link to="/shop">
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-md text-lg font-medium flex items-center gap-2 transition-colors">
                  Shop Sale Items
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {loading.trending
                ? Array(4)
                    .fill()
                    .map((_, i) => <SkeletonProductCard key={i} />)
                : trendingProducts
                    .slice(0, 4)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Our Customers Say */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real reviews from our fashion community
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-card rounded-lg shadow-card p-6"
              >
                <Quote className="h-8 w-8 text-primary mb-4" />
                <p className="mb-4 text-muted-foreground">
                  {testimonial.comment}
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-primary text-primary"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Style Inspiration */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold mb-4">
              Style Inspiration
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get inspired by the latest fashion trends and styling tips
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading.inspiration
              ? Array(4)
                  .fill()
                  .map((_, i) => <SkeletonProductCard key={i} />)
              : inspirationProducts.slice(0, 4).map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="group overflow-hidden rounded-lg bg-card shadow-card hover:shadow-elegant transition-smooth cursor-pointer"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={
                          product.images?.[0] ||
                          "https://via.placeholder.com/150"
                        }
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-semibold">{product.title}</h3>
                        <p className="text-sm opacity-90">3 min read</p>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
          <div className="text-center mt-12">
            <button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 rounded-md text-lg font-medium flex items-center gap-2 mx-auto transition-colors">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Stay in the Loop */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-playfair font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Subscribe to our newsletter for the latest trends, exclusive
              offers, and styling tips
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                />
              </div>
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-lg text-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
            <div className="flex justify-center gap-6">
              <a
                href="https://instagram.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://facebook.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-playfair font-bold mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of sellers and turn your passion into profit
          </p>
          <Link
            to="/seller-signup"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 h-11 px-8 rounded-md text-lg font-medium transition-colors"
          >
            Create Seller Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
