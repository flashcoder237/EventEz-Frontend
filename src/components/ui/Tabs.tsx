import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from '../../lib/utils/utils';
import { 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const [isScrollable, setIsScrollable] = React.useState(false);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Check scrollability and scroll position
  const checkScrollability = React.useCallback(() => {
    if (listRef.current) {
      const { scrollWidth, clientWidth } = listRef.current;
      const isCurrentlyScrollable = scrollWidth > clientWidth;
      setIsScrollable(isCurrentlyScrollable);
      
      if (isCurrentlyScrollable) {
        setCanScrollLeft(listRef.current.scrollLeft > 0);
        setCanScrollRight(
          listRef.current.scrollLeft + listRef.current.clientWidth < scrollWidth
        );
      }
    }
  }, []);

  // Scroll handlers
  const scroll = (direction: 'left' | 'right') => {
    if (listRef.current) {
      const scrollAmount = listRef.current.clientWidth * 0.8;
      listRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Check scrollability on mount and window resize
  React.useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [checkScrollability]);

  return (
    <div className="relative w-full">
      {isScrollable && canScrollLeft && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 
            bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm 
            rounded-full p-1 shadow-md"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </button>
      )}

      <TabsPrimitive.List
        ref={(node) => {
          if (node) listRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "inline-flex items-center w-full overflow-x-auto scrollbar-hide",
          "p-1 bg-gray-100 dark:bg-gray-800 rounded-xl space-x-1",
          "shadow-inner relative",
          "scroll-smooth",
          className
        )}
        {...props}
      >
        {children}
      </TabsPrimitive.List>

      {isScrollable && canScrollRight && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 
            bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm 
            rounded-full p-1 shadow-md"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </button>
      )}
    </div>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative inline-flex items-center justify-center whitespace-nowrap",
      "px-4 py-2 text-sm font-medium rounded-lg flex-shrink-0",
      "transition-all duration-300 ease-out",
      "text-gray-500 dark:text-gray-400",
      "hover:text-gray-700 dark:hover:text-gray-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50",
      "data-[state=active]:text-indigo-600 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900",
      "data-[state=active]:shadow-sm",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    <motion.span 
      className="relative z-10"
      layout
    >
      {children}
    </motion.span>
    <AnimatePresence>
      {props['data-state'] === 'active' && (
        <motion.div
          layoutId="active-tab-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '100%' }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
        />
      )}
    </AnimatePresence>
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 p-4 bg-white dark:bg-gray-900 rounded-xl",
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "animate-fade-in", // Custom animation class
      className
    )}
    {...props}
  >
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
    >
      {props.children}
    </motion.div>
  </TabsPrimitive.Content>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Custom CSS for hiding scrollbar while keeping scrollability
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
`;

// Inject styles
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export { Tabs, TabsList, TabsTrigger, TabsContent };