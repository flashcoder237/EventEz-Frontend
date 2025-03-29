import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertCircle, Info, CheckCircle } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  options: SelectOption[] | string[] | string;
  placeholder?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
  defaultToFirstOption?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    label, 
    error, 
    success,
    helperText,
    options, 
    placeholder = "Sélectionnez une option", 
    icon,
    containerClassName,
    disabled,
    required,
    defaultToFirstOption = true, // Sélectionner la première option par défaut
    value,
    defaultValue,
    onChange,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState<string | undefined>(
      value as string || defaultValue as string
    );

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

    // Sélectionner la première option par défaut si demandé et qu'aucune valeur n'est déjà définie
    useEffect(() => {
      if (defaultToFirstOption && normalizedOptions.length > 0 && !internalValue) {
        const firstOptionValue = normalizedOptions[0].value;
        setInternalValue(firstOptionValue);
        
        // Simuler un événement de changement pour notifier le parent
        if (onChange) {
          const fakeEvent = {
            target: { value: firstOptionValue }
          } as React.ChangeEvent<HTMLSelectElement>;
          onChange(fakeEvent);
        }
      }
    }, [normalizedOptions, defaultToFirstOption, onChange, internalValue]);

    // Suivre les changements de valeur externe
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value as string);
      }
    }, [value]);

    const hasValue = internalValue !== undefined && internalValue !== '';
    
    // Truncate long option labels
    const truncateText = (text: string, maxLength: number = 30) => {
      return text.length > maxLength 
        ? `${text.slice(0, maxLength)}...` 
        : text;
    };

    // Gérer le changement de valeur
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setInternalValue(e.target.value);
      onChange && onChange(e);
    };

    // Animation variants - ajustés pour le select
    const labelVariants = {
      default: { 
        y: 0, 
        scale: 1, 
        top: '50%',
        color: 'rgb(107, 114, 128)' // text-gray-500
      },
      active: { 
        y: -18, 
        scale: 0.85, 
        top: '10%',
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
            "group relative rounded-xl transition-all duration-300 ease-out",
            disabled ? "opacity-70" : "hover:shadow-sm",
            error ? "shadow-red-100" : success ? "shadow-green-100" : "shadow-blue-50"
          )}
        >
          {/* Background decoration */}
          <div 
            className={cn(
              "absolute inset-0 rounded-xl transition-all duration-300",
              "opacity-0 pointer-events-none",
              isFocused && !error && !disabled && "opacity-10 bg-blue-100",
              error && "opacity-10 bg-red-100",
              success && "opacity-10 bg-green-100"
            )}
          />
          
          {/* Label avec mêmes ajustements que pour Input */}
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
          
          <div className="relative">
            {/* Left icon */}
            {icon && (
              <div className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
                isFocused && !error ? "text-blue-500" : "text-gray-400",
                error && "text-red-500",
                success && "text-green-500"
              )}>
                {icon}
              </div>
            )}
            
            <select
              value={internalValue}
              onChange={handleChange}
              onFocus={(e) => {
                setIsFocused(true);
                props.onFocus && props.onFocus(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                props.onBlur && props.onBlur(e);
              }}
              disabled={disabled}
              required={required}
              className={cn(
                "w-full pt-4 pb-2 text-sm rounded-xl border-2 appearance-none transition-all duration-300",
                "bg-white dark:bg-gray-800 backdrop-blur-sm",
                "text-gray-700 dark:text-gray-200",
                disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "",
                "pr-12 truncate", // Space for dropdown icon and truncate long text
                icon ? "pl-12" : "pl-4",
                isFocused && !error 
                  ? "border-blue-400 ring-2 ring-blue-100" 
                  : "border-gray-200 dark:border-gray-700",
                error 
                  ? "border-red-400 ring-2 ring-red-100 focus:border-red-500 focus:ring-red-100" 
                  : success 
                    ? "border-green-400 ring-2 ring-green-100 focus:border-green-500 focus:ring-green-100" 
                    : "",
                "focus:outline-none focus:border-blue-500 dark:focus:border-blue-400",
                disabled && "border-gray-100",
                className
              )}
              ref={ref}
              {...props}
            >
              {/* Option placeholder seulement si on ne sélectionne pas la première option par défaut */}
              {!defaultToFirstOption && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              
              {normalizedOptions.map((option, index) => (
                <option 
                  key={index} 
                  value={option.value}
                  title={option.label} // Show full text on hover
                  className="py-2 truncate"
                >
                  {truncateText(option.label)}
                </option>
              ))}
            </select>
            
            {/* Custom dropdown icon and status indicators */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
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
              
              <motion.div
                animate={{ 
                  rotate: isFocused ? 180 : 0,
                  color: isFocused && !error && !success ? '#3b82f6' : 
                         error ? '#ef4444' : 
                         success ? '#22c55e' : 
                         '#6b7280'
                }}
              >
                <ChevronDown size={18} />
              </motion.div>
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

Select.displayName = "Select";

export { Select };