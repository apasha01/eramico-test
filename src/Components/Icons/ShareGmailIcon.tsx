import React from "react";
import IconInterface from "./iconInterface";

const ShareGmailIcon: React.FC<IconInterface> = ({ className, color }) => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g filter="url(#filter0_d_3241_7579)" transform="translate(-25,-21)">
        <rect
          x="25"
          y="21"
          width="48"
          height="48"
          rx="12"
          fill={color || "#ffffff"}
        />
      </g>
      <g clipPath="url(#clip0_3241_7579)" transform="translate(-25,-21)">
        <path
          d="M 42.4546,51.0043 V 41.7315 L 39.5788,39.1006 37,37.6406 v 11.7273 c 0,0.9054 0.7336,1.6364 1.6364,1.6364 z"
          fill="#4285f4"
          id="path1"
        />
        <path
          d="m 55.5469,51.0042 h 3.8181 c 0.9056,0 1.6364,-0.7337 1.6364,-1.6364 V 37.6406 l -2.9208,1.6722 -2.5337,2.4186 z"
          fill="#34a853"
          id="path2"
        />
        <path
          d="m 42.4538,41.7315 -0.3913,-3.6232 0.3913,-3.4677 6.5455,4.9091 6.5454,-4.9091 0.4377,3.2805 -0.4377,3.8104 -6.5454,4.9091 z"
          fill="#ea4335"
          id="path3"
        />
        <path
          d="m 55.5469,34.641 v 7.0908 l 5.4545,-4.0908 v -2.1819 c 0,-2.0236 -2.31,-3.1772 -3.9271,-1.9636 z"
          fill="#fbbc04"
          id="path4"
        />
        <path
          d="m 37,37.641 2.5087,1.8816 2.9459,2.2093 V 34.641 L 40.9272,33.4956 C 39.3072,32.2819 37,33.4356 37,35.4591 Z"
          fill="#c5221f"
          id="path5"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_3241_7579"
          x="0"
          y="0"
          width="98"
          height="98"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood
            floodOpacity="0"
            result="BackgroundImageFix"
            id="feFlood5"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
            id="feColorMatrix5"
          />
          <feOffset dy="4" id="feOffset5" />
          <feGaussianBlur stdDeviation="12.5" id="feGaussianBlur5" />
          <feComposite in2="hardAlpha" operator="out" id="feComposite5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.492773 0 0 0 0 0.492773 0 0 0 0 0.492773 0 0 0 0.1 0"
            id="feColorMatrix6"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_3241_7579"
            id="feBlend6"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_3241_7579"
            result="shape"
            id="feBlend7"
          />
        </filter>
        <clipPath id="clip0_3241_7579">
          <rect
            width="24"
            height="18.0938"
            fill="#ffffff"
            transform="translate(37,33)"
            id="rect7"
            x="0"
            y="0"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
export default ShareGmailIcon;
