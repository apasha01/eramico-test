"use client";

import React from "react";
import Link from "next/link";
import { useManualRouteProgress } from "@/Hooks/useManualRouteProgress";

interface EnhancedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

/**
 * Enhanced Link component that triggers loading progress on click
 * Use this instead of regular Next.js Link for better UX
 */
const EnhancedLink: React.FC<EnhancedLinkProps> = ({
  href,
  children,
  className,
  style,
  ...props
}) => {
  const { handleLinkClick } = useManualRouteProgress();

  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={handleLinkClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default EnhancedLink;
