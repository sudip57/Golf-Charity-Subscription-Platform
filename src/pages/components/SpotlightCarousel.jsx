import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../components/ui/Button';

const SpotlightCarousel = ({ featuredCharities, userProfile, isUpdating, onUpdateCharity, theme }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % featuredCharities.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + featuredCharities.length) % featuredCharities.length);

  if (!featuredCharities.length) return null;

  const current = featuredCharities[currentIndex];
  const isSelected = userProfile?.selected_charity_id === current.id;

  return (
    <section className="relative group overflow-hidden rounded-[3rem] shadow-2xl min-h-[450px] flex items-center" style={{ backgroundColor: theme.primary }}>
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex} 
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          exit={{ opacity: 0, x: -50 }} 
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative z-10 grid md:grid-cols-2 gap-12 items-center p-8 md:p-16 w-full"
        >
          <div style={{ color: theme.textOnDark }}>
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5" style={{ color: theme.accent, fill: theme.accent }} />
              <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: theme.accent }}>Featured Spotlight</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{current.name}</h2>
            <p className="opacity-80 text-lg mb-10 leading-relaxed line-clamp-4">{current.description}</p>
            <Button
              onClick={() => onUpdateCharity(current.id)}
              disabled={isUpdating || isSelected}
              className="px-8 py-4 rounded-2xl font-black transition-all hover:scale-105"
              style={{ backgroundColor: theme.bg, color: theme.primary }}
            >
              {isSelected ? 'Currently Supporting' : 'Support this charity'}
            </Button>
          </div>
          <div className="hidden md:block h-[350px] rounded-[2rem] overflow-hidden border relative" style={{ borderColor: `${theme.bg}20` }}>
            <img src={current.image_url} className="w-full h-full object-cover" alt="Featured" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 right-8 z-20 flex gap-3">
        <button onClick={prevSlide} className="p-4 rounded-2xl backdrop-blur-md transition-all hover:scale-110 active:scale-95"
          style={{ backgroundColor: `${theme.bg}20`, border: `1px solid ${theme.bg}40`, color: theme.textOnDark }}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="p-4 rounded-2xl backdrop-blur-md transition-all hover:scale-110 active:scale-95"
          style={{ backgroundColor: `${theme.bg}20`, border: `1px solid ${theme.bg}40`, color: theme.textOnDark }}>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] rounded-full" style={{ backgroundColor: `${theme.accent}30` }} />
    </section>
  );
};

export default SpotlightCarousel;