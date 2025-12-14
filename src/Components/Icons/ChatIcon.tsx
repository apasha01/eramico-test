import React from "react";
import IconInterface from "./iconInterface";

const ChatIcon: React.FC<IconInterface> = ({ className, color }) => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="0.5"
        y="0.5"
        width="47"
        height="47"
        rx="23.5"
        stroke={color || "#FB8C00"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 30H30C31.657 30 33 28.657 33 27V19C33 17.343 31.657 16 30 16H18C16.343 16 15 17.343 15 19V27C15 28.657 16.343 30 18 30H19.5V33L24 30Z"
        stroke={color || "#FB8C00"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default ChatIcon;
