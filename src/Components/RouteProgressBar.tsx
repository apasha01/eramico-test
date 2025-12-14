"use client";

import React from "react";
import { useRouteProgress } from "./RouteProgressProvider";

interface RouteProgressBarProps {
  color?: string;
  height?: number;
  showBackground?: boolean;
}

const RouteProgressBar: React.FC<RouteProgressBarProps> = ({
  color = "#FB8C00",
  height = 3,
  showBackground = true,
}) => {
  const { isLoading, progress } = useRouteProgress();

  if (!isLoading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: `${height}px`,
        backgroundColor: showBackground ? "rgba(251, 140, 0, 0.1)" : "transparent",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          backgroundColor: color,
          width: `${progress}%`,
          transition: "width 0.2s ease-out",
          transformOrigin: "left",
          borderRadius: "0 2px 2px 0",
          boxShadow: `0 0 8px ${color}44, 0 0 4px ${color}88`,
          background: `linear-gradient(90deg, ${color} 0%, ${color}dd 50%, ${color} 100%)`,
        }}
      />
    </div>
  );
};

export default RouteProgressBar;
