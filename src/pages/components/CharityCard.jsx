import { motion } from 'framer-motion';
import { ShieldCheck, Info, ArrowUpRight } from 'lucide-react';
import Button from '../../components/ui/Button';

const CharityCard = ({ charity, isSelected, isUpdating, onSelect, theme }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col bg-white rounded-2xl border transition-all p-4 shadow-xl shadow-black/5 hover:shadow-2xl hover:-translate-y-1"
      style={{ borderColor: isSelected ? theme.accent : theme.border }}
    >
      {/* 🟢 TOP IMAGE & CATEGORY BADGE */}
      <div className="relative h-64 w-full overflow-hidden rounded-[2rem]">
        <img 
          src={charity.image_url} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
          alt={charity.name} 
        />
        
        {/* Category Overlay */}
        <div className="absolute top-4 left-4 flex gap-2">
           <span className="px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/90 backdrop-blur-md shadow-sm border border-black/5" style={{ color: theme.primary }}>
             {charity.category || "Mission"}
           </span>
           {isSelected && (
             <span className="px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-white shadow-lg flex items-center gap-2">
               <ShieldCheck className="w-3 h-3" /> Active
             </span>
           )}
        </div>

        {/* Impact Transparency Badge */}
        <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-black/20 backdrop-blur-md border border-white/20 text-[9px] font-bold text-white uppercase tracking-tighter">
          {charity.efficiency || "98%"} Impact Score
        </div>
      </div>

      {/* 🟢 CONTENT SECTION */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-black text-2xl tracking-tighter uppercase leading-none" style={{ color: theme.primary }}>
            {charity.name}
          </h3>
          <a href={charity.website_url} target="_blank" rel="noreferrer" className="opacity-20 hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>

        {/* Full Card Description */}
        <p className="text-sm font-medium leading-relaxed opacity-50 mb-8 line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
          {charity.description || "Dedicated to making a measurable difference through community-led initiatives and sustainable development projects worldwide."}
        </p>

        {/* 🟢 FOOTER ACTIONS */}
        <div className="mt-auto pt-6 border-t border-dashed flex items-center justify-between gap-4" style={{ borderColor: `${theme.primary}10` }}>
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-30" style={{ color: theme.primary }}>Verification</span>
            <div className="flex items-center gap-1 mt-1">
               <Info className="w-3 h-3" style={{ color: theme.accent }} />
               <span className="text-[10px] font-bold" style={{ color: theme.primary }}>Certified NGO</span>
            </div>
          </div>

          <Button
            onClick={() => onSelect(charity.id)}
            className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-95"
            style={{
              backgroundColor: isSelected ? theme.primary : theme.accent,
              color: isSelected ? 'white' : theme.primary,
            }}
            disabled={isUpdating}
          >
            {isUpdating ? '...' : isSelected ? 'Active Mission' : 'Select Mission'}
          </Button>
        </div>
      </div>

      {/* Subtle selection ring for active state */}
      {isSelected && (
        <div className="absolute inset-0 rounded-2xl border-4 pointer-events-none ring-4 ring-emerald-500/10" style={{ borderColor: theme.accent }} />
      )}
    </motion.div>
  );
};

export default CharityCard;