// components/ui/Select.tsx
import React, { useState } from "react";
import { cn } from "../../lib/utils/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[] | string[] | string;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    label, 
    error, 
    options, 
    placeholder = "Sélectionnez une option", 
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    // Normaliser les options
    const normalizedOptions = Array.isArray(options) 
      ? options.map(opt => typeof opt === 'string' 
          ? { value: opt, label: opt } 
          : opt
        ) 
      : typeof options === 'string'
        ? options.split(',').map(opt => ({ 
            value: opt.trim(), 
            label: opt.trim() 
          }))
        : [];

    // Truncate long option labels
    const truncateText = (text: string, maxLength: number = 30) => {
      return text.length > maxLength 
        ? `${text.slice(0, maxLength)}...` 
        : text;
    };

    return (
      <div className="w-full group relative">
        {label && (
          <motion.label 
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10",
              "transition-all duration-300 ease-out origin-left",
              (isFocused || props.value) ? 
                "text-xs top-0 -translate-y-1/2 text-blue-600 bg-white dark:bg-gray-900 px-1" : 
                "text-sm"
            )}
            initial={{ scale: 1 }}
            animate={{ 
              scale: (isFocused || props.value) ? 0.8 : 1,
              y: (isFocused || props.value) ? -20 : 0
            }}
          >
            {label}
          </motion.label>
        )}
        
        <div className="relative">
          <select
            value={props.value}
            onChange={(e) => {
              props.onChange && props.onChange(e);
            }}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus && props.onFocus(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur && props.onBlur(e);
            }}
            className={cn(
              "w-full px-4 py-3 text-sm rounded-xl border-2 appearance-none",
              "bg-gray-50 dark:bg-gray-800",
              "border-gray-300 dark:border-gray-600",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
              "focus:border-blue-500",
              "pr-10 truncate", // Space for dropdown icon and truncate long text
              "text-ellipsis overflow-hidden",
              error && "border-red-500 focus:ring-red-500/50",
              className
            )}
            ref={ref}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {normalizedOptions.map((option, index) => (
              <option 
                key={index} 
                value={option.value}
                title={option.label} // Show full text on hover
                className="truncate"
              >
                {truncateText(option.label)}
              </option>
            ))}
          </select>
          
          {/* Custom dropdown icon */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <motion.div
              animate={{ 
                rotate: isFocused ? 180 : 0,
                color: isFocused ? '#3b82f6' : '#6b7280'
              }}
            >
              <ChevronDown size={20} />
            </motion.div>
          </div>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                className="absolute right-12 top-1/2 -translate-y-1/2"
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

Select.displayName = "Select";

export { Select };