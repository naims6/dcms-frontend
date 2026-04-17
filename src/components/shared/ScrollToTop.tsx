"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled more than 400px
      if (window.scrollY > 1200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 z-[999] group flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 ease-apple-cubic",
        "bg-primary text-primary-foreground shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-primary/20",
        "hover:shadow-[0_20px_40px_rgba(var(--primary),0.3)] hover:-translate-y-1.5 active:scale-95",
        "dark:bg-primary/90 dark:text-primary-foreground dark:border-primary/30",
        isVisible 
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
          : "opacity-0 translate-y-10 scale-50 pointer-events-none"
      )}
      aria-label="Scroll to top"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
      
      {/* Icon with subtle animation */}
      <ArrowUp className="relative z-10 h-6 w-6 transition-transform duration-300 group-hover:-translate-y-0.5" />
      
      {/* Border effect */}
      <span className="absolute inset-0 rounded-full border-2 border-primary/0 transition-all duration-300 group-hover:border-primary/50 group-hover:scale-110" />
    </button>
  );
}
