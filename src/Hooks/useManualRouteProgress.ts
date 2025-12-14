"use client";

import { useRouteProgress } from "@/Components/RouteProgressProvider";

/**
 * Hook to manually control route loading progress
 * Useful for triggering loading on button clicks or async operations
 */
export const useManualRouteProgress = () => {
  const { startLoading, finishLoading } = useRouteProgress();

  const handleLinkClick = () => {
    startLoading();
  };

  const handleAsyncOperation = async (operation: () => Promise<any>) => {
    startLoading();
    try {
      await operation();
    } finally {
      finishLoading();
    }
  };

  return {
    startLoading,
    finishLoading,
    handleLinkClick,
    handleAsyncOperation,
  };
};
