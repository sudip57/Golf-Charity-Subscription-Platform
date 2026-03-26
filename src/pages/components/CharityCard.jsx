import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';

const CharityCard = ({ charity, isSelected, isUpdating, onSelect, theme }) => {
  return (
    <motion.div
      layout
      className="group relative flex flex-col bg-white rounded-2xl border-2 transition-all p-3 shadow-sm hover:shadow-md"
      style={{ borderColor: isSelected ? theme.accent : 'transparent' }}
    >
      <div className="relative h-56 w-full overflow-hidden rounded-2xl">
        <img 
          src={charity.image_url} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          alt={charity.name} 
        />
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="font-black text-2xl mb-4" style={{ color: theme.primary }}>{charity.name}</h3>
        <div className="mt-auto space-y-4">
          <Button
            onClick={() => onSelect(charity.id)}
            className="w-full py-4 rounded-2xl font-black transition-all"
            style={{
              backgroundColor: isSelected ? theme.bg : theme.accent,
              color: isSelected ? theme.accent : theme.textOnDark,
              border: isSelected ? `2px solid ${theme.accent}` : 'none'
            }}
            disabled={isUpdating || isSelected}
          >
            {isSelected ? 'Current Choice' : 'Support charity'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CharityCard;