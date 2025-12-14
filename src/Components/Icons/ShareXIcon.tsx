import React from "react";
import IconInterface from "./iconInterface";

const ShareXIcon: React.FC<IconInterface> = ({ className, color }) => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="12" fill={color || "black"} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.5859 33.375L26.0885 22.4471L26.1013 22.4574L32.8613 14.625H30.6023L25.0954 21L20.7223 14.625H14.7977L21.7972 24.8276L21.7964 24.8267L14.4141 33.375H16.6731L22.7955 26.2824L27.6613 33.375H33.5859ZM19.8272 16.3295L30.3466 31.6705H28.5564L18.0285 16.3295H19.8272Z"
        fill="white"
      />
    </svg>
  );
};
export default ShareXIcon;
