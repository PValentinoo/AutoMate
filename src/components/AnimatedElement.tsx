import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedElementProps {
  children: React.ReactNode;
  animation?: "fade-in" | "slide-up";
  delay?: number;
  className?: string;
}

export function AnimatedElement({ 
  children, 
  animation = "fade-in", 
  delay = 0, 
  className
}: AnimatedElementProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure DOM is ready and prevent hydration mismatch
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50 + delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const animationClass = animation === "fade-in" ? "animate-fade-in" : "animate-slide-up";

  return (
    <div
      className={cn(
        animationClass,
        !isVisible && "opacity-0",
        className
      )}
      style={{ 
        animationDelay: `${delay}ms`,
        // Ensure elements are visible during SSR
        ...(typeof window === "undefined" && { opacity: 1, transform: "none" })
      }}
    >
      {children}
    </div>
  );
}
