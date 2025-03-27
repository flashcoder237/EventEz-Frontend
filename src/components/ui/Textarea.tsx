// components/ui/Textarea.tsx
import React, {useState, useId  } from 'react';
import { cn } from '../../lib/utils/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'bordered' | 'underline';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    label, 
    error, 
    variant = 'default', 
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const id = useId();

    // Variant-based styling
    const variantStyles = {
      default: cn(
        "bg-gray-50 dark:bg-gray-800 rounded-xl border-2",
        "border-gray-300 dark:border-gray-600",
        "focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
      ),
      bordered: cn(
        "bg-transparent border-b-2",
        "border-gray-300 dark:border-gray-600",
        "focus:border-blue-500"
      ),
      underline: cn(
        "bg-transparent border-b border-gray-300 dark:border-gray-600",
        "focus:border-blue-500"
      )
    };

    return (
      <div className="w-full group relative">
        {label && (
          <motion.label 
            htmlFor={id}
            className={cn(
              "absolute left-4 top-4 text-gray-500 pointer-events-none z-10",
              "transition-all duration-300 ease-out origin-left",
              isFocused || props.value ? 
                "text-xs top-0 text-blue-600 bg-white dark:bg-gray-900 px-1" : 
                "text-sm"
            )}
            initial={{ scale: 1 }}
            animate={{ 
              scale: isFocused || props.value ? 0.8 : 1,
              y: isFocused || props.value ? -20 : 0
            }}
          >
            {label}
          </motion.label>
        )}
        
        <textarea
          id={id}
          ref={ref}
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus && props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur && props.onBlur(e);
          }}
          className={cn(
            "w-full px-4 py-3 text-sm transition-all duration-300",
            "focus:outline-none",
            "min-h-[120px] resize-y",
            variantStyles[variant],
            error && "border-red-500 focus:ring-red-500/50",
            className
          )}
        />
        
        <AnimatePresence>
          {error && (
            <motion.p 
              className="text-xs text-red-500 mt-1 pl-2 flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Info size={12} /> {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Input, Textarea };