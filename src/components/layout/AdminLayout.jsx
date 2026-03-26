import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Dices, 
  HeartHandshake, 
  Trophy, 
  LogOut, 
  Menu,
  ShieldAlert
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Draws', href: '/admin/draws', icon: Dices },
    { name: 'Charities', href: '/admin/charities', icon: HeartHandshake },
    { name: 'Winners', href: '/admin/winners', icon: Trophy },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <Link to="/admin" className="flex items-center gap-2 group mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700 flex items-center justify-center shadow-lg">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">Admin Portal</span>
        </Link>
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-slate-800 text-white" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon
                  className={cn(
                    "flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors duration-200",
                    isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mt-auto p-6 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 font-medium border border-slate-700">
            A
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Administrator</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800" 
          onClick={signOut}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign out
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity" 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col lg:relative lg:translate-x-0 border-r border-slate-800",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sticky top-0 z-30">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-sm">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-bold text-lg text-slate-900">Admin Portal</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
