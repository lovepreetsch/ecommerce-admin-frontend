import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
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

const StatCard = ({ title, value, icon: Icon, trend, isPositive }) => (
  <div className="glass-panel p-6 rounded-xl flex items-start justify-between group hover:shadow-primary/5 transition-all duration-300">
    <div>
      <p className="text-textMuted text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-white mb-2">{value}</h3>
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
        <StatCard title="Total Revenue" value="$45,231.89" icon={DollarSign} trend="+20.1%" isPositive={true} />
        <StatCard title="Active Users" value="2,350" icon={Users} trend="+15.2%" isPositive={true} />
        <StatCard title="Total Orders" value="12,234" icon={ShoppingBag} trend="+12.4%" isPositive={true} />
        <StatCard title="Bounce Rate" value="4.23%" icon={TrendingUp} trend="-2.4%" isPositive={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
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
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart */}
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
      
      {/* Recent Orders Table Skeleton Placeholder */}
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-lg font-bold text-white mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surfaceHover text-sm text-textMuted">
                <th className="pb-3 font-medium px-4">Order ID</th>
                <th className="pb-3 font-medium px-4">Customer</th>
                <th className="pb-3 font-medium px-4">Date</th>
                <th className="pb-3 font-medium px-4">Amount</th>
                <th className="pb-3 font-medium px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-surfaceHover/50 hover:bg-surfaceHover/30 transition-colors">
                  <td className="py-4 px-4 text-sm text-white font-medium">#ORD-{9000 + i}</td>
                  <td className="py-4 px-4 text-sm text-textMuted">User {i}</td>
                  <td className="py-4 px-4 text-sm text-textMuted">Today, 10:{i}0 AM</td>
                  <td className="py-4 px-4 text-sm text-white font-medium">${((i * 123.45) % 500).toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-success/10 text-success border border-success/20">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
