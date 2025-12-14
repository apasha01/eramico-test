"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const MobileCategoryPage = dynamic(() => import("./MobileCategoryPage"), { ssr: false });

interface MobileCheckerProps {
  filteredCategories: any;
  categoryResponse: any;
}

const MobileChecker: React.FC<MobileCheckerProps> = ({ filteredCategories, categoryResponse }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    
    const handleResize = () => setIsMobile(window.innerWidth <= 980);
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return <MobileCategoryPage filteredCategories={filteredCategories} categoryResponse={categoryResponse} />;
  }

  return null;
};

export default MobileChecker;
