import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Users
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
      name: "Total Products",
      value: stats.totalProducts,
      icon: Package,
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
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to your Fashion Hub store Seller Dashboard
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {dashboardStats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {stat.value}
                </p>
              </div>
              <div className="rounded-full bg-[#87CEEB] bg-opacity-20 p-3">
                <stat.icon className="h-6 w-6 text-[#2196F3]" />
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
                className={`text-sm ml-1 ${
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Orders
            </h2>
          </div>
          <div className="p-3">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No orders yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-[#2196F3]">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.shippingInfo?.firstName} {order.shippingInfo?.lastName}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                order.paymentStatus === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : order.paymentStatus === "hold"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.paymentStatus === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {order.paymentStatus?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
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
        <div className="bg-white rounded-lg shadow">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Top Selling Products
            </h2>
          </div>
          <div className="p-3">
            {topProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No products sold yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topProducts.map((product) => (
                      <tr key={product._id}>
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.totalSold} units
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
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
    </div>
  );
};

export default Dashboard; 