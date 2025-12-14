"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface RouteProgressContextType {
  isLoading: boolean;
  progress: number;
  startLoading: () => void;
  finishLoading: () => void;
}

const RouteProgressContext = createContext<RouteProgressContextType | undefined>(undefined);

export const useRouteProgress = () => {
  const context = useContext(RouteProgressContext);
  if (context === undefined) {
    throw new Error("useRouteProgress must be used within a RouteProgressProvider");
  }
  return context;
};

interface RouteProgressProviderProps {
  children: React.ReactNode;
}

export const RouteProgressProvider: React.FC<RouteProgressProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const [searchParamsString, setSearchParamsString] = useState("");

  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);
    
    // Animate progress from 0 to 90% with random increments
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        // Random increment between 5-20%
        return Math.min(prev + Math.random() * 15 + 5, 90);
      });
    }, 100);
  };

  const finishLoading = () => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 300);
  };

  useEffect(() => {
    // Update search params from window.location
    if (typeof window !== "undefined") {
      setSearchParamsString(window.location.search);
    }
  }, [pathname]);

  useEffect(() => {
    startLoading();
    
    // Simulate route loading completion after a short delay
    const timer = setTimeout(() => {
      finishLoading();
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname, searchParamsString]);

  const value = {
    isLoading,
    progress,
    startLoading,
    finishLoading,
  };

  return (
    <RouteProgressContext.Provider value={value}>
      {children}
    </RouteProgressContext.Provider>
  );
};
