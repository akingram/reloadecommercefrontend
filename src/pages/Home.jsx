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
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  ChevronRight,
  Phone,
  Bell,
} from "lucide-react";
import heroImage from "../assets/images/homebg.jpg";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllProduct,
  getWhatsHotThisWeek,
  getFeaturedCollections,
  getShopByCategory,
  getStyleInspiration,
} from "../service/userApi";
import { useSelector } from "react-redux";

const CATEGORY_LIST = [
  "reload Products for Men",
  "reload Products for Women",
  "reload Products for Kids",
  "reload Specialty",
  "reload Platinum Plus",
];

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [featuredCollections, setFeaturedCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inspirationProducts, setInspirationProducts] = useState([]);
  const [categoryProductMap, setCategoryProductMap] = useState({});
  const [loading, setLoading] = useState({
    trending: true,
    hot: true,
    collections: true,
    categories: true,
    inspiration: true,
  });
  const [flashSeconds, setFlashSeconds] = useState(8 * 3600 + 5 * 60 + 32);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const seller = useSelector((state) => state.seller?.seller || null);
  const dashboardLink = seller?.seller?._id ? "/seller" : "/seller-login";

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
      description: "Free shipping on orders over ₵50,000",
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
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
      rating: 5,
      comment: "After 6 months of daily use, my energy levels and overall wellness improved dramatically.",
    },
  ];

  const navCategories = [
    { name: "reload Products for Men", icon: "🛒" },
    { name: "reload Products for Women", icon: "📱" },
    { name: "reload Products for Kids", icon: "💊" },
    { name: "reload Specialty", icon: "🏠" },
    { name: "Other categories", icon: "•••" },
  ];

  const quickLinks = [
    { label: "Anniversary Sale", icon: "🎉", href: "/shop?promo=anniversary" },
    { label: "Send Packages Securely", icon: "📦", href: "/delivery" },
    { label: "Call to Order", icon: "📞", href: "tel:0302740642" },
    { label: "Donkomi Sales", icon: "🔥", href: "/shop?sale=donkomi" },
    { label: "Recommended For You", icon: "⭐", href: "/shop?recommended=true" },
    { label: "Save Extra Cash buy now", icon: "💰", href: "/shop" },
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setFlashSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setBannerIndex((i) => (i + 1) % 3), 5000);
    return () => clearInterval(id);
  }, []);

  const h = String(Math.floor(flashSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((flashSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(flashSeconds % 60).padStart(2, "0");

  const tagProduct = (p) => ({
    ...p,
    isNew: (new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24) < 7,
    isSale: p.originalPrice && p.price < p.originalPrice,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trending = await getAllProduct();
        setTrendingProducts(trending.map(tagProduct));
        setLoading((prev) => ({ ...prev, trending: false }));

        const hot = await getWhatsHotThisWeek();
        setHotProducts(hot.map(tagProduct));
        setLoading((prev) => ({ ...prev, hot: false }));

        const collections = await getFeaturedCollections();
        setFeaturedCollections(
          collections.map((p) => ({
            id: p._id,
            name: p.title,
            image: p.images?.[0] || "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=300&fit=crop",
            itemCount: Math.floor(Math.random() * 20) + 10,
            product: p,
          }))
        );
        setLoading((prev) => ({ ...prev, collections: false }));

        const categoryResults = await Promise.all(
          CATEGORY_LIST.map(async (cat) => {
            const products = await getShopByCategory(cat.toLowerCase());
            return { cat, products: products.map(tagProduct) };
          })
        );

        const map = {};
        const categoryData = categoryResults.map(({ cat, products }) => {
          map[cat] = products;
          return {
            name: cat,
            image: products[0]?.images?.[0] || "https://images.unsplash.com/photo-1582053433976-0c1ee0d1c01f?w=300&h=200&fit=crop",
            count: products.length,
          };
        });
        setCategories(categoryData);
        setCategoryProductMap(map);
        setLoading((prev) => ({ ...prev, categories: false }));

        const inspiration = await getStyleInspiration();
        setInspirationProducts(inspiration.map(tagProduct));
        setLoading((prev) => ({ ...prev, inspiration: false }));
      } catch (error) {
        console.error("Failed to fetch data:", error.message);
        setLoading({ trending: false, hot: false, collections: false, categories: false, inspiration: false });
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── Top announcement bar ── */}
      <div className="bg-emerald-700 text-white text-xs py-1.5 px-4 flex justify-between items-center">
        <div className="flex gap-6 items-center"></div>
        <div className="flex gap-6 items-center">
          <span className="font-bold text-sm">UP TO 70% OFF</span>
          <span>CALL TO ORDER: <strong>030 274 0642</strong></span>
          <Link to="/shop" className="text-white font-bold border border-white px-3 py-0.5 rounded text-xs hover:bg-white hover:text-emerald-700 transition-colors">
            DISCOVER
          </Link>
        </div>
      </div>

      {/* ── Secondary bar ── */}
      <div className="bg-white border-b border-gray-200 text-xs py-1 px-6 flex justify-between items-center text-gray-500">
        <div className="flex gap-4 items-center">
          <Link to={dashboardLink} className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1">
            ⊕ Buy on Elvana
          </Link>
        </div>
        <div className="flex gap-4">
          <span>ELVANA ○</span>
          <span>⊙PAY</span>
          <span>⊙DELIVERY</span>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto flex items-center gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-1 flex-shrink-0">
            <span className="text-2xl font-black text-emerald-600 tracking-tight">ELVANA</span>
            <Sparkles className="h-5 w-5 text-emerald-500" />
          </Link>
          <div className="flex-1 flex relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products, brands and categories"
              className="w-full pl-9 pr-4 h-10 border border-gray-300 rounded-l text-sm outline-none focus:border-emerald-500 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-r font-semibold text-sm transition-colors"
            >
              Search
            </button>
          </div>
          <div className="flex gap-5 items-center flex-shrink-0">
            <Link to="/account" className="flex flex-col items-center text-gray-600 hover:text-emerald-600 transition-colors text-xs gap-0.5">
              <User className="h-5 w-5" />
              <span className="flex items-center gap-0.5">Account <ChevronDown className="h-3 w-3" /></span>
            </Link>
            <Link to="/help" className="flex flex-col items-center text-gray-600 hover:text-emerald-600 transition-colors text-xs gap-0.5">
              <Bell className="h-5 w-5" />
              <span className="flex items-center gap-0.5">Help <ChevronDown className="h-3 w-3" /></span>
            </Link>
            <Link to="/cart" className="flex flex-col items-center text-gray-600 hover:text-emerald-600 transition-colors text-xs gap-0.5 relative">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
              </div>
              <span>Cart</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section: Sidebar + Featured Products + Right Panel ── */}
      <div className="max-w-screen-xl mx-auto px-4 pt-4 pb-2 grid grid-cols-1 lg:grid-cols-[220px_1fr_180px] gap-3">

        {/* Left: Category sidebar */}
        <div className="bg-white rounded shadow-sm overflow-hidden self-start hidden lg:block">
          {navCategories.map((cat, i) => (
            <Link
              key={i}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-gray-100 text-gray-700 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors last:border-0"
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>

        {/* Center: Featured Products */}
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-base font-black text-gray-900">Featured Products</h2>
            <Link to="/shop" className="text-sm text-emerald-600 font-semibold flex items-center gap-1 hover:underline">
              See All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {loading.trending ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-gray-100">
              {trendingProducts.slice(0, 6).map((product) => (
                <div key={product._id} className="bg-white p-3 hover:shadow-md transition-shadow">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick action cards */}
        <div className="flex flex-col gap-2 hidden lg:flex">
          {[
            { icon: "📞", title: "CALL / WHATSAPP", detail: "0302740642", to: "/contact", bg: "bg-green-50 border-green-100" },
            { icon: "🏪", title: "BUY ON ELVANA", detail: "Make more money", to: "/shop", bg: "bg-blue-50 border-blue-100" },
            { icon: "📦", title: "TRACK YOUR ORDER", detail: "Stay up to date", to: "/orders", bg: "bg-amber-50 border-amber-100" },
          ].map((item, i) => (
            <Link key={i} to={item.to} className={`${item.bg} border rounded p-3 flex items-center gap-2.5 hover:shadow-sm transition-shadow`}>
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="font-bold text-xs text-gray-800">{item.title}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{item.detail}</div>
              </div>
            </Link>
          ))}

          <div className="bg-emerald-600 rounded p-3 text-white text-center">
            <div className="text-[10px] font-semibold mb-1">ELVANA</div>
            <div className="text-3xl font-black leading-none">1</div>
            <div className="text-[11px]">Years with you</div>
            <div className="text-[10px] opacity-80 mt-0.5">COMING SOON</div>
            <div className="text-base font-bold mt-1">Hikers</div>
          </div>

          <Link
            to="/Shop"
            className="bg-emerald-600 hover:bg-emerald-700 rounded p-3 text-white text-center block transition-colors"
          >
            <div className="text-[10px] font-semibold mb-1">ELVANA FORCE</div>
            <div className="text-xl font-black leading-tight">SAVE EXTRA<br />CASH</div>
            <div className="mt-2 font-bold text-sm">BUY NOW →</div>
          </Link>
        </div>
      </div>

      {/* ── Quick category pill strip ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="bg-white rounded shadow-sm px-4 py-3 flex gap-2 flex-wrap">
          {[
            { name: "reload Products for Men", color: "#FF6B35" },
            { name: "reload Products for Women", color: "#00A651" },
            { name: "reload Products for Kids", color: "#F7941D" },
            { name: "reload Specialty", color: "#009FE3" },
            { name: "reload Platinum Plus", color: "#6B4FBB" },
          ].map((cat, i) => (
            <Link
              key={i}
              to={`/shop?category=${encodeURIComponent(cat.name.toLowerCase())}`}
              className="px-4 py-1.5 rounded-full text-xs font-semibold border transition-all hover:text-white"
              style={{ borderColor: cat.color + "60", color: cat.color, background: cat.color + "15" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = cat.color; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = cat.color + "15"; e.currentTarget.style.color = cat.color; }}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Flash Sales ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="bg-white rounded shadow-sm p-4">
          <div className="flex items-center justify-between bg-red-600 text-white rounded px-4 py-2.5 mb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span className="font-bold text-lg">Flash Sales</span>
            </div>
            <span className="text-sm">
              Time Left: <strong>{h}h : {m}m : {s}s</strong>
            </span>
            <Link to="/shop?flash=true" className="text-white font-semibold text-sm border border-white/50 px-3 py-0.5 rounded hover:bg-white/20 transition-colors">
              See All &rsaquo;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {loading.trending
              ? Array(6).fill().map((_, i) => <SkeletonProductCard key={i} />)
              : trendingProducts.slice(6, 12).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
          </div>
        </div>
      </div>

      {/* ── Quick links strip ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {quickLinks.map((item, i) => (
            <Link
              key={i}
              to={item.href}
              className="bg-white rounded shadow-sm flex flex-col items-center justify-center gap-2 py-5 px-2 text-center hover:shadow-md transition-shadow group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="text-xs font-semibold text-gray-700 leading-tight">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Men's Products ── */}
      {(!loading.categories && categoryProductMap["reload Products for Men"]?.length > 0) && (
        <div className="max-w-screen-xl mx-auto px-4 py-2">
          <div className="bg-white rounded shadow-sm p-4">
            <div className="flex items-center justify-between border-b-2 border-orange-400 pb-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛒</span>
                <h2 className="text-lg font-bold text-gray-800">Products for Men</h2>
              </div>
              <Link to={`/shop?category=${encodeURIComponent("reload products for men")}`} className="text-orange-500 text-sm font-semibold flex items-center gap-1 hover:text-orange-600">
                See All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {categoryProductMap["reload Products for Men"].slice(0, 6).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Women's Products ── */}
      {(!loading.categories && categoryProductMap["reload Products for Women"]?.length > 0) && (
        <div className="max-w-screen-xl mx-auto px-4 py-2">
          <div className="bg-white rounded shadow-sm p-4">
            <div className="flex items-center justify-between border-b-2 border-green-500 pb-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">📱</span>
                <h2 className="text-lg font-bold text-gray-800">Products for Women</h2>
              </div>
              <Link to={`/shop?category=${encodeURIComponent("reload products for women")}`} className="text-green-600 text-sm font-semibold flex items-center gap-1 hover:text-green-700">
                See All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {categoryProductMap["reload Products for Women"].slice(0, 6).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Kids Products ── */}
      {(!loading.categories && categoryProductMap["reload Products for Kids"]?.length > 0) && (
        <div className="max-w-screen-xl mx-auto px-4 py-2">
          <div className="bg-white rounded shadow-sm p-4">
            <div className="flex items-center justify-between border-b-2 border-amber-400 pb-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">💊</span>
                <h2 className="text-lg font-bold text-gray-800">Products for Kids</h2>
              </div>
              <Link to={`/shop?category=${encodeURIComponent("reload products for kids")}`} className="text-amber-500 text-sm font-semibold flex items-center gap-1 hover:text-amber-600">
                See All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {categoryProductMap["reload Products for Kids"].slice(0, 6).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Specialty Products ── */}
      {(!loading.categories && categoryProductMap["reload Specialty"]?.length > 0) && (
        <div className="max-w-screen-xl mx-auto px-4 py-2">
          <div className="bg-white rounded shadow-sm p-4">
            <div className="flex items-center justify-between border-b-2 border-sky-400 pb-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏠</span>
                <h2 className="text-lg font-bold text-gray-800">Specialty Products</h2>
              </div>
              <Link to={`/shop?category=${encodeURIComponent("reload specialty")}`} className="text-sky-500 text-sm font-semibold flex items-center gap-1 hover:text-sky-600">
                See All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {categoryProductMap["reload Specialty"].slice(0, 6).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Platinum Plus ── */}
      {(!loading.categories && categoryProductMap["reload Platinum Plus"]?.length > 0) && (
        <div className="max-w-screen-xl mx-auto px-4 py-2">
          <div className="bg-white rounded shadow-sm p-4">
            <div className="flex items-center justify-between border-b-2 border-purple-500 pb-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <h2 className="text-lg font-bold text-gray-800">Platinum Plus</h2>
              </div>
              <Link to={`/shop?category=${encodeURIComponent("reload platinum plus")}`} className="text-purple-600 text-sm font-semibold flex items-center gap-1 hover:text-purple-700">
                See All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {categoryProductMap["reload Platinum Plus"].slice(0, 6).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Trending This Month ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="bg-white rounded shadow-sm p-4">
          <div className="flex items-center justify-between border-b-2 border-emerald-500 pb-2 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-emerald-500" />
              <h2 className="text-lg font-bold text-gray-800">Trending This Month</h2>
            </div>
            <Link to="/shop?sort=trending" className="text-emerald-600 text-sm font-semibold flex items-center gap-1 hover:text-emerald-700">
              See All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {loading.trending
              ? Array(6).fill().map((_, i) => <SkeletonProductCard key={i} />)
              : trendingProducts.slice(12, 22).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/shop" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-full font-semibold text-sm transition-colors">
              View All Supplements <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Features Section ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="bg-white rounded shadow-sm p-6">
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-1.5 bg-emerald-600 text-white rounded-full text-xs font-semibold mb-3">
              Why Choose Us
            </span>
            <h2 className="text-2xl font-playfair font-bold">Premium Wellness Experience</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4 items-start p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all group">
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Wellness Collections ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="bg-white rounded shadow-sm p-4">
          <div className="flex items-center justify-between border-b-2 border-emerald-500 pb-2 mb-4">
            <h2 className="text-lg font-bold text-gray-800">Wellness Collections</h2>
            <Link to="/shop?view=collections" className="text-emerald-600 text-sm font-semibold flex items-center gap-1 hover:text-emerald-700">
              See All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading.collections
              ? Array(4).fill().map((_, i) => <SkeletonCollectionCard key={i} />)
              : featuredCollections.slice(0, 4).map((collection) => (
                  <Link
                    key={collection.id}
                    to="/shop"
                    className="group relative overflow-hidden rounded-lg block border border-gray-100"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="text-base font-bold">{collection.name}</h3>
                        <p className="text-emerald-200 text-xs mt-0.5">{collection.itemCount} premium supplements</p>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
          {/* Products from collections */}
          {!loading.collections && featuredCollections.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 mt-4 pt-4 border-t border-gray-100">
              {featuredCollections.slice(0, 6).map((col) =>
                col.product ? <ProductCard key={col.id} product={col.product} /> : null
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Special Offers + What's Hot ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-3">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded shadow-sm p-6 text-white flex flex-col justify-center">
            <span className="inline-flex items-center gap-1.5 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit">
              <Zap className="h-3.5 w-3.5" /> Limited Time Offer
            </span>
            <h2 className="text-2xl font-playfair font-bold mb-4 leading-tight">Special Wellness Offers</h2>
            <div className="space-y-2.5 mb-6">
              {[
                "Up to 40% off on immune support supplements",
                "Free shipping on orders over ₵50,000",
                "Extra 15% off for subscription orders",
                "Free wellness guide with every purchase",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 mt-1.5 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-6 py-2.5 rounded-full text-sm hover:bg-emerald-50 transition-colors w-fit">
              Shop Wellness Deals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white rounded shadow-sm p-4">
            <div className="flex items-center justify-between border-b-2 border-emerald-500 pb-2 mb-4">
              <h2 className="text-lg font-bold text-gray-800">What's Hot This Week 🔥</h2>
              <Link to="/shop?sort=hot" className="text-emerald-600 text-sm font-semibold flex items-center gap-1 hover:text-emerald-700">
                See All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {loading.hot
                ? Array(4).fill().map((_, i) => <SkeletonProductCard key={i} />)
                : hotProducts.slice(0, 8).map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── More Hot Products ── */}
      {!loading.hot && hotProducts.length > 8 && (
        <div className="max-w-screen-xl mx-auto px-4 py-2">
          <div className="bg-white rounded shadow-sm p-4">
            <div className="flex items-center justify-between border-b-2 border-red-400 pb-2 mb-4">
              <h2 className="text-lg font-bold text-gray-800">More Hot Picks 🔥</h2>
              <Link to="/shop?sort=hot" className="text-red-500 text-sm font-semibold flex items-center gap-1 hover:text-red-600">
                See All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {hotProducts.slice(8, 14).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Shop by Category ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="bg-white rounded shadow-sm p-4">
          <div className="flex items-center justify-between border-b-2 border-emerald-500 pb-2 mb-4">
            <h2 className="text-lg font-bold text-gray-800">Shop By Category</h2>
            <Link to="/shop" className="text-emerald-600 text-sm font-semibold flex items-center gap-1 hover:text-emerald-700">
              See All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {loading.categories
              ? Array(6).fill().map((_, i) => <SkeletonCategoryCard key={i} />)
              : categories.map((cat, i) => (
                  <Link
                    key={i}
                    to={`/shop?category=${encodeURIComponent(cat.name.toLowerCase())}`}
                    className="group flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-100 hover:border-emerald-300 hover:shadow-sm transition-all text-center"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-emerald-300 transition-colors">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-emerald-700 leading-tight">{cat.name}</span>
                    <span className="text-[11px] text-gray-400">{cat.count} items</span>
                  </Link>
                ))}
          </div>

          {/* Products per category */}
          {!loading.categories && (
            <div className="mt-6 space-y-6">
              {CATEGORY_LIST.map((catName) => {
                const products = categoryProductMap[catName];
                if (!products || products.length === 0) return null;
                return (
                  <div key={catName}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-gray-700">{catName}</h3>
                      <Link to={`/shop?category=${encodeURIComponent(catName.toLowerCase())}`} className="text-emerald-600 text-xs font-semibold hover:underline">
                        View all
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                      {products.slice(0, 6).map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="bg-white rounded shadow-sm p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-emerald-500" />
              <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs">Success Stories</span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-emerald-500" />
            </div>
            <h2 className="text-2xl font-playfair font-bold">Health Transformations</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="relative bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all group">
                <Quote className="absolute top-5 right-5 h-6 w-6 text-emerald-200 group-hover:text-emerald-300 transition-colors" />
                <div className="flex gap-0.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic text-sm mb-5 leading-relaxed">"{testimonial.comment}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-100"
                  />
                  <div>
                    <p className="font-bold text-sm text-gray-800">{testimonial.name}</p>
                    <p className="text-emerald-600 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Wellness Education / Style Inspiration ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="bg-white rounded shadow-sm p-4">
          <div className="flex items-center justify-between border-b-2 border-emerald-500 pb-2 mb-4">
            <h2 className="text-lg font-bold text-gray-800">Wellness Education</h2>
            <Link to="/blog" className="text-emerald-600 text-sm font-semibold flex items-center gap-1 hover:text-emerald-700">
              See All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading.inspiration
              ? Array(4).fill().map((_, i) => <SkeletonProductCard key={i} />)
              : inspirationProducts.slice(0, 4).map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="group relative overflow-hidden rounded-lg block border border-gray-100"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop"}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-medium mb-2">
                          <Brain className="h-3 w-3" /> 5 min read
                        </div>
                        <h3 className="text-sm font-bold leading-tight line-clamp-2">{product.title}</h3>
                        <p className="text-emerald-200 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Read article →
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>

          {/* Remaining inspiration products as cards */}
          {!loading.inspiration && inspirationProducts.length > 4 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 mt-4 pt-4 border-t border-gray-100">
              {inspirationProducts.slice(4, 10).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <button className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-2 rounded-full font-semibold text-sm transition-all flex items-center gap-2 mx-auto">
              View All Articles <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── You May Also Like ── */}
      {!loading.trending && trendingProducts.length > 22 && (
        <div className="max-w-screen-xl mx-auto px-4 py-2">
          <div className="bg-white rounded shadow-sm p-4">
            <div className="flex items-center justify-between border-b-2 border-emerald-500 pb-2 mb-4">
              <h2 className="text-lg font-bold text-gray-800">You May Also Like</h2>
              <Link to="/shop" className="text-emerald-600 text-sm font-semibold flex items-center gap-1 hover:text-emerald-700">
                See All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {trendingProducts.slice(22, 34).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Newsletter ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 rounded shadow-sm p-10">
          <div className="max-w-xl mx-auto text-center text-white">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-4">
              <Mail className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl font-playfair font-bold mb-2">Wellness Newsletter</h2>
            <p className="text-emerald-100 text-sm mb-6">Subscribe for health tips, supplement guides, and exclusive wellness offers</p>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-3 rounded-full border-0 text-sm outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <button className="bg-white text-emerald-700 hover:bg-emerald-50 px-7 py-3 rounded-full font-bold text-sm transition-colors flex items-center justify-center gap-2">
                Subscribe <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p className="text-emerald-200 text-xs mb-5">Join 50,000+ wellness enthusiasts. Unsubscribe anytime.</p>
            <div className="flex justify-center gap-4">
              {[
                { Icon: Instagram, hover: "hover:text-pink-300" },
                { Icon: Facebook, hover: "hover:text-blue-300" },
                { Icon: Twitter, hover: "hover:text-sky-300" },
              ].map(({ Icon, hover }, i) => (
                <a key={i} href="#" className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white ${hover} hover:-translate-y-1 transition-all`}>
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Seller CTA ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-2 pb-6">
        <div className="relative overflow-hidden rounded shadow-sm bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 py-14 px-8 text-center text-white">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_20%_50%,white_0%,transparent_50%),radial-gradient(circle_at_80%_50%,white_0%,transparent_50%)]" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-semibold mb-5">
              <Sparkles className="h-4 w-4" /> Join Our Wellness Network
            </div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
              Share Wellness,
              <span className="block text-emerald-100">Earn Rewards</span>
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
              Join our network of wellness advocates and help others achieve better health while earning meaningful rewards
            </p>
            <Link
              to="/seller-signup"
              className="inline-flex items-center gap-3 bg-white text-emerald-700 hover:bg-emerald-50 px-9 py-3.5 rounded-full text-base font-bold transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <Leaf className="h-5 w-5" />
              Become a Wellness Partner
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="mt-6 text-emerald-200 text-sm">No upfront costs · Training provided · Dedicated support</p>
          </div>
        </div>
      </div>

    </div>
  );
};
export default Home;
