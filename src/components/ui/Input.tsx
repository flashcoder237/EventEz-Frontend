// components/ui/Input.tsx
import React, { useState } from 'react';
import { cn } from '../../lib/utils/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="w-full group relative">
        {label && (
          <motion.label 
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none",
              "transition-all duration-300 ease-out origin-left",
              isFocused || props.value ? 
                "text-xs top-0 -translate-y-1/2 text-blue-600 bg-white px-1" : 
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
        
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
          
          <input
            type={type}
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
              "w-full px-4 py-3 text-sm rounded-xl border-2 transition-all duration-300",
              "bg-gray-50 dark:bg-gray-800",
              "border-gray-300 dark:border-gray-600",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
              "focus:border-blue-500",
              icon && "pl-12",
              error && "border-red-500 focus:ring-red-500/50",
              className
            )}
          />
          
          <AnimatePresence>
            {error && (
              <motion.div 
                className="absolute right-4 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Info className="text-red-500" size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
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
Input.displayName = "Input";

export { Input };