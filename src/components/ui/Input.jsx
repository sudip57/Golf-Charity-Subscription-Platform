import React from 'react';
import { cn } from '../../lib/utils';
import { THEMES } from '../../components/ui/theme'; // Imported Themes

const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
  const theme = THEMES.cherryBlossom; // Accessing theme

  return (
    <div className="w-full space-y-1.5 transition-colors duration-500">
      {label && (
        <label 
          className="block text-xs font-black uppercase tracking-widest ml-1"
          style={{ color: theme.primary, opacity: 0.6 }}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full h-12 px-4 rounded-xl border bg-white shadow-sm transition-all outline-none",
          "placeholder:text-slate-400 placeholder:font-medium",
          className
        )}
        style={{ 
          borderColor: error ? '#ef4444' : theme.border,
          color: theme.primary,
          // Inline dynamic focus ring using CSS variables or manual style injection
          "--focus-color": theme.accent,
          "--focus-ring": `${theme.accent}30`
        }}
        // Applying the dynamic focus behavior
        onFocus={(e) => {
          e.target.style.borderColor = error ? '#ef4444' : theme.accent;
          e.target.style.boxShadow = `0 0 0 4px ${error ? 'rgba(239, 68, 68, 0.2)' : `${theme.accent}30`}`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#ef4444' : theme.border;
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
      {error && (
        <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;