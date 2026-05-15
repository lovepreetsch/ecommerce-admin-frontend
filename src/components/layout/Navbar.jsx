import { Bell, Search, Menu, UserCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-surfaceHover flex items-center justify-between px-6 z-10 sticky top-0 shadow-sm">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-textMuted hover:text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-textMuted" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 pr-4 py-1.5 bg-background border border-surfaceHover rounded-full text-sm text-white placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-textMuted hover:text-white transition-colors rounded-full hover:bg-surfaceHover">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full border-2 border-surface"></span>
        </button>
        
        <div className="h-8 w-px bg-surfaceHover mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-sm font-medium text-white">{user?.email || 'Admin User'}</span>
            <span className="text-xs text-primary font-medium">Administrator</span>
          </div>
          <div className="relative group cursor-pointer">
            <UserCircle className="w-9 h-9 text-textMuted hover:text-white transition-colors" />
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-surface border border-surfaceHover rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
              <div className="p-2">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10 rounded-md transition-colors font-medium"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
