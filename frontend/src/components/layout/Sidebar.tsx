import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileCheck, 
  History, 
  User, 
  LogOut,
  ChevronLeft 
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Sidebar() {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  // Exact colors from the screenshot
  const ACTIVE_BG = 'bg-[#343b4c]'; // The dark navy for the active "Home" button
  const TEXT_INACTIVE = 'text-[#5f6368]'; // The greyish color for inactive text/icons

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Validate XML', icon: FileCheck, path: '/validate' },
    { name: 'History', icon: History, path: '/history' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-200 transition-all duration-300">
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Main menu
        </span>
        <button className="p-1 rounded-full border border-gray-200 hover:bg-gray-100">
          <ChevronLeft className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? `${ACTIVE_BG} text-white shadow-md` 
                  : `${TEXT_INACTIVE} hover:bg-gray-50 hover:text-gray-900`
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              <span className="text-[15px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className={`flex items-center space-x-4 w-full px-4 py-3 ${TEXT_INACTIVE} hover:bg-red-50 hover:text-red-600 rounded-lg transition-all`}
        >
          <LogOut className="h-5 w-5" />
          <span className="text-[15px] font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}