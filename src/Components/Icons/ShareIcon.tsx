import React from "react";
import IconInterface from "./iconInterface";

const ShareIcon: React.FC<IconInterface> = ({ className, color }) => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="24" cy="24" r="23.5" stroke={color || "#E0E0E0"} />
      <g clipPath="url(#clip0_2800_517)">
        <path
          d="M16 24.0007C16 24.7079 16.281 25.3862 16.781 25.8863C17.2811 26.3864 17.9594 26.6673 18.6667 26.6673C19.3739 26.6673 20.0522 26.3864 20.5523 25.8863C21.0524 25.3862 21.3333 24.7079 21.3333 24.0007C21.3333 23.2934 21.0524 22.6151 20.5523 22.115C20.0522 21.6149 19.3739 21.334 18.6667 21.334C17.9594 21.334 17.2811 21.6149 16.781 22.115C16.281 22.6151 16 23.2934 16 24.0007Z"
          stroke={color || "#424242"}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26.6641 18.6667C26.6641 19.3739 26.945 20.0522 27.4451 20.5523C27.9452 21.0524 28.6235 21.3333 29.3307 21.3333C30.038 21.3333 30.7163 21.0524 31.2163 20.5523C31.7164 20.0522 31.9974 19.3739 31.9974 18.6667C31.9974 17.9594 31.7164 17.2811 31.2163 16.781C30.7163 16.281 30.038 16 29.3307 16C28.6235 16 27.9452 16.281 27.4451 16.781C26.945 17.2811 26.6641 17.9594 26.6641 18.6667Z"
          stroke={color || "#424242"}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26.6641 29.3327C26.6641 30.0399 26.945 30.7182 27.4451 31.2183C27.9452 31.7184 28.6235 31.9993 29.3307 31.9993C30.038 31.9993 30.7163 31.7184 31.2163 31.2183C31.7164 30.7182 31.9974 30.0399 31.9974 29.3327C31.9974 28.6254 31.7164 27.9472 31.2163 27.4471C30.7163 26.947 30.038 26.666 29.3307 26.666C28.6235 26.666 27.9452 26.947 27.4451 27.4471C26.945 27.9472 26.6641 28.6254 26.6641 29.3327Z"
          stroke={color || "#424242"}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.0703 22.8445L26.937 19.8223"
          stroke={color || "#424242"}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.0703 25.1562L26.937 28.1785"
          stroke={color || "#424242"}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2800_517">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(12 12)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
export default ShareIcon;
