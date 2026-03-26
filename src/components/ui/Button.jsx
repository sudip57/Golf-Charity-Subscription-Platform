import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';
import { THEMES } from '../../components/ui/theme'; // Imported Themes

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading = false, children, ...props }, ref) => {
  const theme = THEMES.cherryBlossom; // Accessing theme

  const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95';
  
  // Mapping variants to dynamic theme colors
  const variants = {
    primary: 'shadow-lg transition-all',
    secondary: 'bg-slate-900 text-white hover:bg-black shadow-lg',
    outline: 'border-2 transition-all',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    glass: 'bg-white/20 text-white backdrop-blur-md border border-white/30 hover:bg-white/30'
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  };

  // Dynamic Styles for Theme-dependent variants
  const dynamicStyles = {
    primary: {
      backgroundColor: theme.accent,
      color: theme.textOnDark,
      boxShadow: `0 10px 15px -3px ${theme.accent}40`,
    },
    outline: {
      borderColor: theme.border,
      color: theme.primary,
    }
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      style={variant === 'primary' ? dynamicStyles.primary : variant === 'outline' ? dynamicStyles.outline : {}}
      // Hover effects for dynamic colors
      onMouseEnter={(e) => {
        if (variant === 'primary') e.currentTarget.style.filter = 'brightness(1.1)';
        if (variant === 'outline') {
          e.currentTarget.style.borderColor = theme.accent;
          e.currentTarget.style.color = theme.accent;
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') e.currentTarget.style.filter = 'none';
        if (variant === 'outline') {
          e.currentTarget.style.borderColor = theme.border;
          e.currentTarget.style.color = theme.primary;
        }
      }}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;