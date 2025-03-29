import React, {useState, useId } from 'react';
import { cn } from '../../lib/utils/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, AlertCircle, CheckCircle } from 'lucide-react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
  variant?: 'default' | 'bordered' | 'underline';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    label, 
    error, 
    success,
    helperText,
    icon,
    containerClassName,
    variant = 'default', 
    disabled,
    required,
    placeholder,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const id = useId();
    const hasValue = props.value !== undefined && props.value !== '';
    
    // N'afficher le placeholder que si le label est flottant ou s'il n'y a pas de label
    const shouldShowPlaceholder = !label || isFocused || hasValue;

    // Variant-based styling
    const variantStyles = {
      default: cn(
        "rounded-xl border-2",
        isFocused && !error && !success
          ? "border-blue-400 ring-2 ring-blue-100" 
          : "border-gray-200 dark:border-gray-700",
        error 
          ? "border-red-400 ring-2 ring-red-100 focus:border-red-500 focus:ring-red-100" 
          : success 
            ? "border-green-400 ring-2 ring-green-100 focus:border-green-500 focus:ring-green-100" 
            : ""
      ),
      bordered: cn(
        "bg-transparent border-b-2 rounded-none",
        isFocused && !error && !success
          ? "border-blue-400" 
          : "border-gray-200 dark:border-gray-700",
        error 
          ? "border-red-400" 
          : success 
            ? "border-green-400" 
            : ""
      ),
      underline: cn(
        "bg-transparent border-b border-gray-300 dark:border-gray-600 rounded-none",
        isFocused && !error && !success
          ? "border-blue-400" 
          : "border-gray-200 dark:border-gray-700",
        error 
          ? "border-red-400" 
          : success 
            ? "border-green-400" 
            : ""
      )
    };

    // Animation variants - ajustées pour que le label ne monte pas trop
    const labelVariants = {
      default: { 
        y: 0, 
        scale: 1, 
        top: '1.5rem', // Positionné en haut du textarea, pas au milieu
        color: 'rgb(107, 114, 128)' // text-gray-500
      },
      active: { 
        y: -18, 
        scale: 0.85, 
        top: '0%',
        color: isFocused 
          ? 'rgb(59, 130, 246)' // text-blue-500 
          : error 
            ? 'rgb(239, 68, 68)' // text-red-500
            : success 
              ? 'rgb(34, 197, 94)' // text-green-500
              : 'rgb(107, 114, 128)' // text-gray-500
      }
    };

    return (
      <div className={cn("w-full relative", containerClassName)}>
        <div 
          className={cn(
            "group relative transition-all duration-300 ease-out",
            variant === 'default' && "rounded-xl",
            disabled ? "opacity-70" : "hover:shadow-sm",
            error ? "shadow-red-100" : success ? "shadow-green-100" : "shadow-blue-50"
          )}
        >
          {/* Background decoration */}
          <div 
            className={cn(
              "absolute inset-0 transition-all duration-300",
              variant === 'default' && "rounded-xl",
              "opacity-0 pointer-events-none",
              isFocused && !error && !disabled && "opacity-10 bg-blue-100",
              error && "opacity-10 bg-red-100",
              success && "opacity-10 bg-green-100"
            )}
          />
          
          {/* Label avec position ajustée */}
          {label && (
            <motion.label 
              htmlFor={id}
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
          
          <div className="relative">
            {/* Left icon si présent */}
            {icon && (
              <div className={cn(
                "absolute left-4 top-4 transition-colors duration-300",
                isFocused && !error ? "text-blue-500" : "text-gray-400",
                error && "text-red-500",
                success && "text-green-500"
              )}>
                {icon}
              </div>
            )}
            
            <textarea
              id={id}
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
                "w-full pt-6 pb-2 text-sm transition-all duration-300",
                "focus:outline-none",
                "min-h-[120px] resize-y",
                "bg-white dark:bg-gray-800",
                disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "",
                "placeholder:text-gray-400 placeholder:font-light",
                icon ? "pl-12" : "pl-4",
                "pr-4",
                variantStyles[variant],
                className
              )}
            />
            
            {/* Indicateurs d'état (erreur/succès) */}
            <div className="absolute right-4 top-4 flex items-center gap-2">
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

Textarea.displayName = "Textarea";

export { Textarea };