'use client';

import React from "react";

type StyleProps = {
  color?: string | null;
};

const ConfirmBadge: React.FC<StyleProps> = ({ color }) => {
  const strokeColor = color || "#484848";
  
  return (
    <svg
      key="confirm-badge"
      width="24" 
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="11.9998"
        r="9.00375"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M8.4425 12.3387L10.6104 14.5066L10.5964 14.4926L15.4874 9.60156"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default ConfirmBadge;
