import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { Heart, Menu, X, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { THEMES } from '../ui/theme';

const Navbar = () => {
  const theme = THEMES.forestEthos;
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'How it Works', path: '/#how-it-works' },
    { name: 'Charity Impact', path: '#' },
  ];

  // Helper to determine text color based on scroll and route
  const getTextColor = () => {
    if (isScrolled) return theme.primary; // Obsidian when scrolled
    if (location.pathname === '/') return '#ffffff'; // White on transparent home hero
    return theme.primary;
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
        isScrolled 
          ? "bg-white/70 backdrop-blur-xl shadow-lg border-b py-3" 
          : "bg-transparent py-6"
      )}
      style={{ borderColor: isScrolled ? `${theme.primary}10` : 'transparent' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div 
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:rotate-6 shadow-lg" 
              style={{ backgroundColor: theme.primary }}
            >
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>
            <span 
              className="font-black text-2xl tracking-tighter transition-colors duration-300"
              style={{ color: getTextColor() }}
            >
              ImpactLinks
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path}
                className="text-xs font-black uppercase tracking-[0.2em] transition-all hover:opacity-100 opacity-70"
                style={{ color: getTextColor() }}
              >
                {link.name}
              </a>
            ))}
            
            <div className="flex items-center gap-3 ml-6 border-l pl-6" style={{ borderColor: `${getTextColor()}20` }}>
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-xs font-black uppercase tracking-widest mr-4 transition-opacity hover:opacity-70"
                    style={{ color: getTextColor() }}
                  >
                    Dashboard
                  </Link>
                  <Button 
                    size="sm" 
                    onClick={signOut}
                    className="rounded-xl font-black uppercase tracking-widest text-[10px]"
                    style={{ backgroundColor: theme.primary, color: '#fff' }}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button 
                      className="text-xs font-black uppercase tracking-widest px-4 py-2 transition-all hover:opacity-70"
                      style={{ color: getTextColor() }}
                    >
                      Log In
                    </button>
                  </Link>
                  <Link to="/register">
                    <Button 
                      className="shadow-xl rounded-xl font-black uppercase tracking-widest text-[10px] py-2.5 px-6"
                      style={{ backgroundColor: theme.accent, color: '#fff' }}
                    >
                      Join Club
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 rounded-xl transition-colors"
            style={{ backgroundColor: isScrolled ? `${theme.primary}05` : 'transparent' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" style={{ color: getTextColor() }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: getTextColor() }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white shadow-2xl md:hidden overflow-hidden border-t"
            style={{ borderColor: `${theme.primary}05` }}
          >
            <div className="p-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.path}
                  className="text-sm font-black uppercase tracking-widest p-2"
                  style={{ color: theme.primary }}
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px w-full bg-slate-100 my-2" />
              <div className="flex flex-col gap-4">
                {user ? (
                  <Link to="/dashboard" className="w-full">
                    <Button className="w-full rounded-xl py-4 font-black uppercase tracking-widest" style={{ backgroundColor: theme.primary, color: '#fff' }}>
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="w-full text-center py-2 font-black uppercase tracking-widest text-xs" style={{ color: theme.primary }}>
                      Log In
                    </Link>
                    <Link to="/register" className="w-full">
                      <Button className="w-full rounded-xl py-4 font-black uppercase tracking-widest shadow-lg" style={{ backgroundColor: theme.accent, color: '#fff' }}>
                        Join the Club
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;