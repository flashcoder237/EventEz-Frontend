import React, { useState } from 'react';
import { cn } from '../../lib/utils/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, AlertCircle, CheckCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    success,
    helperText,
    icon, 
    rightIcon,
    containerClassName,
    disabled,
    required,
    placeholder,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== '';
    
    // Animation variants - ajustées pour que le label ne monte pas trop
    const labelVariants = {
      default: { 
        y: 0, 
        scale: 1, 
        top: '50%',
        color: 'rgb(107, 114, 128)' // text-gray-500
      },
      active: { 
        y: -18, // Réduit de -28 à -18 pour moins de déplacement
        scale: 0.85, 
        top: '10%', // Changé de 0% à 10% pour descendre légèrement le label
        color: isFocused 
          ? 'rgb(59, 130, 246)' // text-indigo-500 
          : error 
            ? 'rgb(239, 68, 68)' // text-red-500
            : success 
              ? 'rgb(34, 197, 94)' // text-green-500
              : 'rgb(107, 114, 128)' // text-gray-500
      }
    };

    // N'afficher le placeholder que si le label est flottant ou s'il n'y a pas de label
    const shouldShowPlaceholder = !label || isFocused || hasValue;

    return (
      <div className={cn("w-full relative", containerClassName)}>
        <div 
          className={cn(
            "group relative rounded-xl transition-all duration-300 ease-out",
            disabled ? "opacity-70" : "hover:shadow-sm",
            error ? "shadow-red-100" : success ? "shadow-green-100" : "shadow-indigo-50"
          )}
        >
          {/* Background decoration */}
          <div 
            className={cn(
              "absolute inset-0 rounded-xl transition-all duration-300",
              "opacity-0 pointer-events-none",
              isFocused && !error && !disabled && "opacity-10 bg-indigo-100",
              error && "opacity-10 bg-red-100",
              success && "opacity-10 bg-green-100"
            )}
          />
          
          {/* Label avec espacement ajusté */}
          {label && (
            <motion.label 
              className={cn(
                "absolute left-4 px-1 z-10 pointer-events-none",
                "transition-all duration-300 ease-out origin-left",
                "-translate-y-1/2 font-medium",
                required && "after:content-['*'] after:ml-0.5 after:text-red-500", 
                (isFocused || hasValue) ? "text-xs bg-white" : "text-sm",
                disabled && "text-gray-400 bg-gray-50"
              )}
              initial={false}
              animate={(isFocused || hasValue) ? "active" : "default"}
              variants={labelVariants}
            >
              {label}
            </motion.label>
          )}
          
          {/* Input container */}
          <div className="relative">
            {/* Left icon */}
            {icon && (
              <div className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
                isFocused && !error ? "text-indigo-500" : "text-gray-400",
                error && "text-red-500",
                success && "text-green-500"
              )}>
                {icon}
              </div>
            )}
            
            {/* Input element avec padding-top ajusté pour plus d'espace en haut */}
            <input
              type={type}
              ref={ref}
              disabled={disabled}
              required={required}
              placeholder={shouldShowPlaceholder ? placeholder : ''}
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
                "w-full pt-4 pb-2 text-sm rounded-xl border-2 transition-all duration-300", // Augmentation du padding top
                "bg-white dark:bg-gray-800 backdrop-blur-sm",
                disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "",
                "placeholder:text-gray-400 placeholder:font-light",
                icon ? "pl-12" : "pl-4",
                rightIcon || error || success ? "pr-12" : "pr-4",
                isFocused && !error 
                  ? "border-indigo-400 ring-2 ring-indigo-100" 
                  : "border-gray-200 dark:border-gray-700",
                error 
                  ? "border-red-400 ring-2 ring-red-100 focus:border-red-500 focus:ring-red-100" 
                  : success 
                    ? "border-green-400 ring-2 ring-green-100 focus:border-green-500 focus:ring-green-100" 
                    : "",
                "focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400",
                disabled && "border-gray-100",
                className
              )}
            />
            
            {/* Right elements (error icon, success icon, or custom icon) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {rightIcon && !error && !success && (
                <span className="text-gray-400">{rightIcon}</span>
              )}
              
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    key="error-icon"
                    initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 20 }}
                    transition={{ duration: 0.2 }}
                    className="text-red-500"
                  >
                    <AlertCircle size={18} />
                  </motion.div>
                )}
                
                {success && !error && (
                  <motion.div 
                    key="success-icon"
                    initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 20 }}
                    transition={{ duration: 0.2 }}
                    className="text-green-500"
                  >
                    <CheckCircle size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Helper text or error message */}
        <div className="min-h-[1.5rem] mt-1 px-1">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.p 
                key="error-message"
                className="text-xs text-red-500 flex items-center gap-1 font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Info size={12} className="flex-shrink-0" /> {error}
              </motion.p>
            ) : helperText ? (
              <motion.p 
                key="helper-text"
                className="text-xs text-gray-500 pl-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {helperText}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };