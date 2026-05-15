import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Users, 
  Archive, 
  Ticket, 
  MessageSquare,
  Settings
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'Products', path: '/products' },
  { icon: Tags, label: 'Categories', path: '/categories' },
  { icon: ShoppingCart, label: 'Orders', path: '/orders' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: Archive, label: 'Inventory', path: '/inventory' },
  { icon: Ticket, label: 'Coupons', path: '/coupons' },
  { icon: MessageSquare, label: 'Reviews', path: '/reviews' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-surface border-r border-surfaceHover hidden md:flex flex-col shadow-2xl z-20">
      <div className="h-16 flex items-center px-6 border-b border-surfaceHover">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-xl font-bold text-white tracking-wide">ShopAdmin</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(29,78,216,0.15)]' 
                    : 'text-textMuted hover:bg-surfaceHover hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-surfaceHover">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive ? 'bg-primary/10 text-primary' : 'text-textMuted hover:bg-surfaceHover hover:text-white'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}
