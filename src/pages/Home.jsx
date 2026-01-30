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
  Leaf,
  Heart,
  Brain,
  Zap,
  Pill,
  Droplets,
} from "lucide-react";
import heroImage from "../assets/images/homebg.jpg";
import { Link } from "react-router-dom";
import {
  getAllProduct,
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
  const dashboardLink = seller?.seller?._id ? "/seller" : "/seller-login";

  const features = [
    {
      icon: Leaf,
      title: "100% Natural Ingredients",
      description: "Pure plant-based supplements with no artificial additives",
      color: "from-emerald-500 to-green-400",
      bgColor: "bg-emerald-50",
    },
    {
      icon: ShieldCheck,
      title: "Lab Tested & Certified",
      description: "Third-party tested for purity and potency guarantee",
      color: "from-blue-500 to-cyan-400",
      bgColor: "bg-blue-50",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Free shipping on orders over ₦50,000",
      color: "from-amber-500 to-orange-400",
      bgColor: "bg-amber-50",
    },
  ];

  const testimonials = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      role: "Nutrition Specialist",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
      rating: 5,
      comment: "Elvana Naturals supplements transformed my patients' health journeys. Exceptional quality!",
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "Fitness Coach",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      rating: 5,
      comment: "As a fitness coach, I recommend these supplements to all my clients. Visible results!",
    },
    {
      id: "3",
      name: "Maria Garcia",
      role: "Wellness Advocate",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w-200&h=200&fit=crop&crop=face",
      rating: 5,
      comment: "After 6 months of daily use, my energy levels and overall wellness improved dramatically.",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trending = await getAllProduct();
        setTrendingProducts(
          trending.map((p) => ({
            ...p,
            isNew: (new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24) < 7,
            isSale: p.originalPrice && p.price < p.originalPrice,
          }))
        );
        setLoading((prev) => ({ ...prev, trending: false }));

        const hot = await getWhatsHotThisWeek();
        setHotProducts(
          hot.map((p) => ({
            ...p,
            isNew: (new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24) < 7,
            isSale: p.originalPrice && p.price < p.originalPrice,
          }))
        );
        setLoading((prev) => ({ ...prev, hot: false }));

        const collections = await getFeaturedCollections();
        setFeaturedCollections(
          collections.map((p) => ({
            id: p._id,
            name: p.title,
            image: p.images?.[0] || "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=300&fit=crop",
            itemCount: Math.floor(Math.random() * 20) + 10,
          }))
        );
        setLoading((prev) => ({ ...prev, collections: false }));

        const categoryList = [
          "Multivitamins",
          "Immune Support",
          "Energy Boosters",
          "Digestive Health",
          "Sleep & Relaxation",
          "Joint Support",
        ];
        const categoryData = await Promise.all(
          categoryList.map(async (cat) => {
            const products = await getShopByCategory(cat.toLowerCase());
            return {
              name: cat,
              image: products[0]?.images?.[0] || "https://images.unsplash.com/photo-1582053433976-0c1ee0d1c01f?w=300&h=200&fit=crop",
              count: products.length,
            };
          })
        );
        setCategories(categoryData);
        setLoading((prev) => ({ ...prev, categories: false }));

        const inspiration = await getStyleInspiration();
        setInspirationProducts(
          inspiration.map((p) => ({
            ...p,
            isNew: (new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24) < 7,
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-emerald-50/20">
      {/* Hero Section - Enhanced with floating elements */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/85 via-teal-900/75 to-emerald-900/85" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-emerald-300/20 rounded-full blur-xl" />
        <div className="absolute bottom-32 right-20 w-24 h-24 bg-teal-400/10 rounded-full blur-xl" />
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-white/10 rounded-full blur-lg" />

        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <Leaf className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="text-base font-semibold tracking-wide">Premium Natural Supplements</span>
            <Sparkles className="h-4 w-4 ml-1 opacity-70" />
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold mb-6 leading-tight">
            Elevate Your
            <span className="block mt-2">
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-200 bg-clip-text text-transparent">
                Wellness Journey
              </span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 font-light max-w-3xl mx-auto leading-relaxed">
            Discover scientifically-backed natural supplements crafted for optimal health, vitality, and holistic wellness
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/shop"
              className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white h-14 px-10 rounded-full font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="text-lg font-semibold relative z-10 tracking-wide">
                Explore Supplements
              </span>
              <ArrowRight className="h-5 w-5 transition-all duration-300 group-hover:translate-x-2 relative z-10" />
            </Link>

            <Link
              to={dashboardLink}
              className="group relative bg-transparent text-white border-2 border-white/40 hover:border-white/80 hover:bg-white/10 h-14 px-10 rounded-full font-semibold transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 backdrop-blur-sm"
            >
              <span className="text-lg font-semibold tracking-wide">Start Selling</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <span>Certified Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-emerald-300" />
              <span>100% Natural</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-300" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-emerald-300" />
              <span>5-Star Rated</span>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced with gradient cards */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/20 to-white" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-semibold mb-4">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
              Premium Wellness Experience
            </h2>
            <p className="text-lg text-gray-600">
              We combine nature's wisdom with scientific research to deliver exceptional supplements
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-8"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${feature.color}`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-10 w-10 bg-gradient-to-br ${feature.color} text-transparent bg-clip-text`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Enhanced with modern layout */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-500" />
              <span className="text-emerald-600 font-semibold tracking-widest uppercase text-sm">
                Best Sellers
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-500" />
            </div>
            <h2 className="text-5xl font-playfair font-bold mb-6">
              Trending This Month
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Discover our most effective supplements, loved by thousands for visible results
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {loading.trending
              ? Array(5)
                  .fill()
                  .map((_, i) => <SkeletonProductCard key={i} />)
              : trendingProducts
                  .slice(0, 10)
                  .map((product) => (
                    <div key={product._id} className="hover:-translate-y-2 transition-transform duration-300">
                      <ProductCard product={product} />
                    </div>
                  ))}
          </div>
          
          <div className="text-center mt-16">
            <Link to="/shop">
              <button className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 text-white h-12 px-10 rounded-full text-lg font-semibold flex items-center gap-3 mx-auto transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30">
                <span>View All Supplements</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collections - Enhanced with hover effects */}
      <section className="py-24 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-playfair font-bold mb-6">
              Wellness Collections
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Curated supplement bundles designed for specific health goals and optimal results
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading.collections
              ? Array(4)
                  .fill()
                  .map((_, i) => <SkeletonCollectionCard key={i} />)
              : featuredCollections.slice(0, 4).map((collection) => (
                  <Link
                    key={collection.id}
                    to="/shop"
                    className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/30 to-transparent" />
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2 group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                          {collection.name}
                        </h3>
                        <p className="text-emerald-200 group-hover:translate-y-0 translate-y-2 transition-transform duration-500">
                          {collection.itemCount} premium supplements
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Special Offers - Enhanced with modern design */}
      <section className="py-24 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-emerald-300/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-teal-300/10 rounded-full blur-xl" />
              
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <Zap className="h-4 w-4" />
                  Limited Time Offer
                </span>
                
                <h2 className="text-4xl font-playfair font-bold mb-6 leading-tight">
                  Special Wellness Offers
                </h2>
                
                <div className="space-y-4 mb-8">
                  {[
                    "Up to 40% off on immune support supplements",
                    "Free shipping on orders over ₦50,000",
                    "Extra 15% off for subscription orders",
                    "Free wellness guide with every purchase"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 group-hover:scale-150 transition-transform" />
                      <span className="text-lg group-hover:text-emerald-600 transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
                
                <Link to="/shop">
                  <button className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 text-white h-12 px-8 rounded-full text-lg font-semibold flex items-center gap-3 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30">
                    <span>Shop Wellness Deals</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {loading.trending
                ? Array(4)
                    .fill()
                    .map((_, i) => (
                      <div key={i} className="col-span-1">
                        <SkeletonProductCard />
                      </div>
                    ))
                : trendingProducts
                    .slice(0, 4)
                    .map((product) => (
                      <div key={product._id} className="hover:-translate-y-2 transition-transform duration-300">
                        <ProductCard product={product} />
                      </div>
                    ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced with beautiful cards */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-500" />
              <span className="text-emerald-600 font-semibold tracking-widest uppercase text-sm">
                Success Stories
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-500" />
            </div>
            <h2 className="text-5xl font-playfair font-bold mb-6">
              Health Transformations
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Real results and testimonials from our wellness community members
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 border border-emerald-100 hover:border-emerald-200 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Quote icon */}
                <Quote className="absolute top-6 right-6 h-8 w-8 text-emerald-500/20 group-hover:text-emerald-500/30 transition-colors" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                
                {/* Comment */}
                <p className="text-gray-700 italic text-lg mb-8 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                
                {/* User info */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover ring-4 ring-emerald-100 group-hover:ring-emerald-200 transition-all"
                  />
                  <div>
                    <p className="font-bold text-lg">{testimonial.name}</p>
                    <p className="text-emerald-600 text-sm font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wellness Tips - Enhanced with gradient overlays */}
      <section className="py-24 bg-gradient-to-b from-white to-emerald-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-playfair font-bold mb-6">
              Wellness Education
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Expert insights and research-backed articles on supplementation and holistic health
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
                    className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop"}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/20 to-transparent" />
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-4">
                          <Brain className="h-3 w-3" />
                          <span>5 min read</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                          {product.title}
                        </h3>
                        <p className="text-emerald-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          Read article →
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
          
          <div className="text-center mt-16">
            <button className="group relative overflow-hidden border-2 border-emerald-500 text-emerald-500 hover:text-white h-12 px-10 rounded-full text-lg font-semibold flex items-center gap-3 mx-auto transition-all duration-300 hover:bg-emerald-500">
              <span>View All Articles</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter - Enhanced with modern design */}
      <section className="py-24 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-200/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 border border-white/20">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-6">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                
                <h2 className="text-4xl font-playfair font-bold mb-4">
                  Wellness Newsletter
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Subscribe for health tips, supplement guides, and exclusive wellness offers
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <button className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 h-12 px-8 rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 flex items-center justify-center">
                    <span>Subscribe</span>
                    <ArrowRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-500 mb-8">
                  Join 50,000+ wellness enthusiasts. Unsubscribe anytime.
                </p>
                
                <div className="flex justify-center gap-6">
                  {[
                    { icon: Instagram, color: "hover:text-pink-600" },
                    { icon: Facebook, color: "hover:text-blue-600" },
                    { icon: Twitter, color: "hover:text-sky-500" },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href="#"
                      className="group relative w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-gray-600 hover:bg-emerald-100 transition-all duration-300 hover:-translate-y-1"
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced with gradient */}
      <section className="py-24 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700" />
        
        {/* Floating elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/10 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">Join Our Wellness Network</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-playfair font-bold mb-6">
              Share Wellness,
              <span className="block text-emerald-100">Earn Rewards</span>
            </h2>
            
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Join our network of wellness advocates and help others achieve better health while earning meaningful rewards
            </p>
            
            <Link
              to="/seller-signup"
              className="group inline-flex items-center gap-3 bg-white text-emerald-700 hover:bg-emerald-50 h-14 px-10 rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <Leaf className="h-6 w-6" />
              <span>Become a Wellness Partner</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
            
            <p className="mt-8 text-emerald-200 text-sm">
              No upfront costs • Training provided • Dedicated support
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;