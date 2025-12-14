'use client';
import React from "react";

type StyleProps = {
  color?: string | null;
};

const UserConfirmBadge: React.FC<StyleProps> = ({ color }) => {
  const strokeColor = color || "#484848";

  return (
    <svg
      key="user-confirm-badge"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.4691 3.02278C13.8329 4.38649 13.8329 6.5975 12.4691 7.96121C11.1054 9.32492 8.89443 9.32492 7.53072 7.96121C6.16701 6.5975 6.16701 4.38649 7.53072 3.02278C8.89443 1.65907 11.1054 1.65907 12.4691 3.02278"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M14.363 12.7952C13.064 12.2762 11.54 11.9902 10 11.9902C5.952 11.9902 2 13.9572 2 16.9822V17.9822C2 18.5342 2.448 18.9822 3 18.9822H12.413"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M17 22C14.239 22 12 19.762 12 17C12 14.296 14.3 11.997 17.004 12C19.764 12.002 22 14.24 22 17C22 19.761 19.762 22 17 22"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M19.222 15.8887L16.444 18.6667L14.778 16.9997"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default UserConfirmBadge;
