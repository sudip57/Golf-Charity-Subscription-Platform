import { Heart } from 'lucide-react';
import { THEMES } from '../ui/theme';
const Footer = () => {
  const theme = THEMES.forestEthos;

  return (
    <footer 
      className="py-16 border-t transition-colors duration-500" 
      style={{ backgroundColor: theme.primary, borderColor: `${theme.accent}10` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `${theme.accent}20` }}
              >
                <Heart className="w-5 h-5 fill-current" style={{ color: theme.accent }} />
              </div>
              <span className="font-black text-2xl tracking-tighter text-white">
                ImpactLinks
              </span>
            </div>
            <p className="max-w-sm text-sm font-medium leading-relaxed opacity-60 text-white">
              The premier platform where competitive spirit fuels global impact. 
              Track progress, win rewards, and support the charities you love—all 
              through the power of purposeful play.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6 opacity-40">
              Platform
            </h3>
            <ul className="space-y-4">
              {['How it works', 'Charities', 'Monthly Draw', 'Leaderboards'].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-sm font-bold opacity-60 hover:opacity-100 transition-all"
                    style={{ color: '#fff' }}
                    onMouseOver={(e) => e.target.style.color = theme.accent}
                    onMouseOut={(e) => e.target.style.color = '#fff'}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6 opacity-40">
              Legal & Support
            </h3>
            <ul className="space-y-4">
              {['Terms of Service', 'Privacy Policy', 'Contact Support', 'Cookie Settings'].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-sm font-bold opacity-60 hover:opacity-100 transition-all"
                    style={{ color: '#fff' }}
                    onMouseOver={(e) => e.target.style.color = theme.accent}
                    onMouseOut={(e) => e.target.style.color = '#fff'}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="pt-8 border-t flex flex-col md:flex-row items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-30" 
          style={{ borderColor: 'rgba(255,255,255,0.05)', color: '#fff' }}
        >
          <p>
            &copy; {new Date().getFullYear()} ImpactLinks. Built for Founders & Players.
          </p>
          <p className="mt-4 md:mt-0 flex items-center gap-2">
            Developed with <Heart className="w-3 h-3 fill-current" style={{ color: theme.accent }} /> by the Community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;