import { useEffect } from 'react';
import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../store/slices/orderSlice';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchAllUsers } from '../store/slices/userSlice';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, orders: 240 },
  { name: 'Feb', revenue: 3000, orders: 139 },
  { name: 'Mar', revenue: 2000, orders: 980 },
  { name: 'Apr', revenue: 2780, orders: 390 },
  { name: 'May', revenue: 1890, orders: 480 },
  { name: 'Jun', revenue: 2390, orders: 380 },
  { name: 'Jul', revenue: 3490, orders: 430 },
];

const StatCard = ({ title, value, icon: Icon, trend, isPositive, loading }) => (
  <div className="glass-panel p-6 rounded-xl flex items-start justify-between group hover:shadow-primary/5 transition-all duration-300">
    <div>
      <p className="text-textMuted text-sm font-medium mb-1">{title}</p>
      {loading ? (
        <div className="h-8 w-24 bg-surfaceHover animate-pulse rounded mt-2"></div>
      ) : (
        <h3 className="text-2xl font-bold text-white mb-2">{value}</h3>
      )}
      <div className={`flex items-center text-xs font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        <span>{trend}</span>
        <span className="text-textMuted ml-2">vs last month</span>
      </div>
    </div>
    <div className={`p-3 rounded-lg ${isPositive ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'} group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { totalElements: totalOrders, items: recentOrders, loading: ordersLoading } = useSelector(state => state.orders);
  const { totalElements: totalProducts, loading: productsLoading } = useSelector(state => state.products);
  const { items: users, loading: usersLoading } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchAllOrders({ page: 0, size: 5 }));
    dispatch(fetchProducts({ page: 0, size: 1 }));
    dispatch(fetchAllUsers({ page: 0, size: 50 }));
  }, [dispatch]);

  const totalRevenue = recentOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
  const activeUsersCount = users.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-textMuted mt-1">Welcome back, here's what's happening with your store today.</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Revenue (Recent)" value={`₹${totalRevenue.toLocaleString()}`} icon={DollarSign} trend="+12.5%" isPositive={true} loading={ordersLoading} />
        <StatCard title="Total Users" value={activeUsersCount} icon={Users} trend="+5.2%" isPositive={true} loading={usersLoading} />
        <StatCard title="Total Orders" value={totalOrders} icon={ShoppingBag} trend="+18.4%" isPositive={true} loading={ordersLoading} />
        <StatCard title="Total Products" value={totalProducts} icon={Package} trend="+2.1%" isPositive={true} loading={productsLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Revenue Analytics</h2>
            <select className="bg-background border border-surfaceHover text-sm rounded-lg px-3 py-1.5 text-textMuted focus:outline-none focus:border-primary">
              <option>Last 7 months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Orders Status</h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.4}}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="orders" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-lg font-bold text-white mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surfaceHover text-sm text-textMuted">
                <th className="pb-3 font-medium px-4">Order ID</th>
                <th className="pb-3 font-medium px-4">Customer ID</th>
                <th className="pb-3 font-medium px-4">Date</th>
                <th className="pb-3 font-medium px-4">Amount</th>
                <th className="pb-3 font-medium px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {ordersLoading && <tr><td colSpan="5" className="py-8 text-center text-textMuted">Loading recent orders...</td></tr>}
              {!ordersLoading && recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-surfaceHover/50 hover:bg-surfaceHover/30 transition-colors">
                  <td className="py-4 px-4 text-sm text-white font-medium">#{order.orderNumber}</td>
                  <td className="py-4 px-4 text-sm text-textMuted">User #{order.userId}</td>
                  <td className="py-4 px-4 text-sm text-textMuted">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-sm text-white font-medium">₹{order.totalAmount?.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                      order.status === 'DELIVERED' ? 'bg-success/10 text-success border-success/20' : 
                      order.status === 'CANCELLED' ? 'bg-danger/10 text-danger border-danger/20' : 
                      'bg-warning/10 text-warning border-warning/20'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!ordersLoading && recentOrders.length === 0 && <tr><td colSpan="5" className="py-8 text-center text-textMuted">No recent orders.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
