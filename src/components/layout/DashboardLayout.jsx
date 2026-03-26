import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Target,
  HeartHandshake,
  Trophy,
  LogOut,
  Menu,
  Heart,
  CreditCard,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { THEMES } from '../../components/ui/theme'; // Imported Themes

const DashboardLayout = () => {
  const theme = THEMES.forestEthos; // Accessing theme
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Scores', href: '/dashboard/scores', icon: Target },
    { name: 'Charity Impact', href: '/dashboard/charities', icon: HeartHandshake },
    { name: 'Winnings', href: '/dashboard/winnings', icon: Trophy },
    { name: 'Membership', href: '/dashboard/membership', icon: CreditCard },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r transition-colors duration-500" style={{ borderColor: theme.border }}>
      {/* LOGO AREA */}
      <div className="p-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
               style={{ backgroundColor: theme.accent, boxShadow: `0 10px 15px -3px ${theme.accent}40` }}>
            <Heart className="w-5 h-5 fill-white text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter" style={{ color: theme.primary }}>
            ImpactLinks
          </span>
        </Link>
      </div>

      {/* NAV LINKS */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-200 group",
                isActive ? "shadow-sm" : "hover:bg-slate-50"
              )}
              style={{ 
                backgroundColor: isActive ? `${theme.accent}15` : 'transparent',
                color: isActive ? theme.accent : 'rgba(0,0,0,0.5)',
              }}
            >
              <item.icon
                className={cn("mr-3 h-5 w-5 transition-colors")}
                style={{ color: isActive ? theme.accent : 'rgba(0,0,0,0.3)' }}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* USER PROFILE & LOGOUT */}
      <div className="p-6 mt-auto border-t bg-slate-50/30" style={{ borderColor: theme.border }}>
        <div className="bg-white p-4 rounded-2xl border shadow-sm mb-4 flex items-center gap-3" style={{ borderColor: theme.border }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs"
               style={{ backgroundColor: theme.primary }}>
            {user?.email?.[0].toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black truncate" style={{ color: theme.primary }}>
              {user?.user_metadata?.first_name || 'Player'}
            </p>
            <p className="text-[10px] font-bold opacity-40 truncate uppercase tracking-tighter" style={{ color: theme.primary }}>
              {user?.email}
            </p>
          </div>
        </div>

        <button
          className="w-full flex items-center justify-center gap-2 py-3 text-xs font-black opacity-40 hover:opacity-100 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all uppercase tracking-widest"
          style={{ color: theme.primary }}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex overflow-hidden transition-colors duration-500" style={{ backgroundColor: theme.bg }}>
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex lg:flex-shrink-0 w-80 h-full">
        <SidebarContent />
      </aside>

      {/* 2. MOBILE SIDEBAR */}
      <div className={cn(
        "fixed inset-0 z-[100] lg:hidden transition-opacity duration-300",
        mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        
        <div className={cn(
          "absolute inset-y-0 left-0 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <button 
            className="absolute top-6 right-[-50px] p-2 bg-white rounded-xl shadow-xl"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" style={{ color: theme.primary }} />
          </button>
          <SidebarContent />
        </div>
      </div>

      {/* 3. MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        
        {/* MOBILE HEADER */}
        <header className="lg:hidden h-20 bg-white border-b flex items-center justify-between px-6 flex-shrink-0 transition-colors"
                style={{ borderColor: theme.border }}>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: theme.accent }}>
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-black tracking-tighter text-lg" style={{ color: theme.primary }}>ImpactLinks</span>
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl transition-colors"
            style={{ backgroundColor: theme.bg, color: theme.primary }}
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <div className="py-8 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto">
            <div className="min-h-full">
              <Outlet />
            </div>
          </div>
          
          {/* Subtle decorative background element linked to theme accent */}
          <div className="fixed top-0 right-0 -z-10 w-[40%] h-[40%] blur-[120px] rounded-full transition-colors duration-1000" 
               style={{ backgroundColor: `${theme.accent}15` }} />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;