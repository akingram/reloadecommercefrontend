import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Users,
  Leaf,
  Heart,
  Pill,
  Brain
} from 'lucide-react';
import { getSellerStats, getSellerOrders, getTopSellingProducts } from '../../service/sellerApi';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    pendingRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, ordersResponse, productsResponse] = await Promise.all([
        getSellerStats(),
        getSellerOrders({ limit: 5 }),
        getTopSellingProducts()
      ]);
      
      setStats(statsResponse.data);
      setRecentOrders(ordersResponse.orders || []);
      setTopProducts(productsResponse.products || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format price in NGN
  const formatPrice = (price) => 
    new Intl.NumberFormat('en-NG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(price || 0));

  // Mock stats for trends (you can replace with real data later)
  const dashboardStats = [
    {
      name: "Total Supplements",
      value: stats.totalProducts,
      icon: Pill,
      change: "+12%",
      trend: TrendingUp
    },
    {
      name: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      change: "+8%",
      trend: TrendingUp
    },
    {
      name: "Pending Orders",
      value: stats.pendingOrders,
      icon: Users,
      change: "+5%",
      trend: TrendingUp
    },
    {
      name: "Total Revenue",
      value: `₦${formatPrice(stats.totalRevenue)}`,
      icon: DollarSign,
      change: "+15%",
      trend: TrendingUp
    }
  ];

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-b from-emerald-50 to-white min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-emerald-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-emerald-100 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-emerald-50 to-white min-h-screen">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full mb-4">
          <Leaf className="h-4 w-4" />
          <span className="text-sm font-medium">Wellness Partner Dashboard</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Wellness Dashboard</h1>
        <p className="text-gray-600">
          Welcome to your Elvana Naturals Wellness Partner Dashboard
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className="rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 p-3">
                <stat.icon className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <stat.trend
                className={`h-4 w-4 ${
                  stat.change.startsWith("+")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              />
              <span
                className={`text-sm ml-1 font-medium ${
                  stat.change.startsWith("+")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {stat.change} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Wellness Badge */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Wellness Impact Score</h3>
                <p className="text-emerald-100 text-sm">Based on customer satisfaction and repeat orders</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">92%</div>
              <div className="text-emerald-200 text-sm">Excellent</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                Recent Wellness Orders
              </h2>
            </div>
          </div>
          <div className="p-4">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No wellness orders yet
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-emerald-100">
                <table className="min-w-full divide-y divide-emerald-100">
                  <thead className="bg-emerald-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-emerald-100">
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-emerald-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-emerald-700">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {order.shippingInfo?.firstName} {order.shippingInfo?.lastName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                order.paymentStatus === "paid"
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : order.paymentStatus === "hold"
                                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                                  : order.paymentStatus === "failed"
                                  ? "bg-red-100 text-red-800 border border-red-200"
                                  : "bg-gray-100 text-gray-800 border border-gray-200"
                              }`}
                          >
                            {order.paymentStatus?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-700">
                          ₦{formatPrice(order.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Brain className="h-4 w-4 text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                Top Selling Supplements
              </h2>
            </div>
          </div>
          <div className="p-4">
            {topProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No supplements sold yet
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-emerald-100">
                <table className="min-w-full divide-y divide-emerald-100">
                  <thead className="bg-emerald-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                        Supplement
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                        Sales
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-emerald-100">
                    {topProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-emerald-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded flex items-center justify-center">
                              <Pill className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {product.category || 'Wellness'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          <span className="font-semibold">{product.totalSold}</span> units
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-emerald-700">
                          ₦{formatPrice(product.totalRevenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <div className="bg-gradient-to-r from-emerald-600/5 to-teal-600/5 rounded-2xl p-6 border border-emerald-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white border border-emerald-200 hover:border-emerald-400 text-emerald-700 hover:bg-emerald-50 py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <Package className="h-4 w-4" />
              Add New Supplement
            </button>
            <button className="bg-white border border-emerald-200 hover:border-emerald-400 text-emerald-700 hover:bg-emerald-50 py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              View All Orders
            </button>
            <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Generate Wellness Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;