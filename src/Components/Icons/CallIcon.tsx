import React from "react";
import IconInterface from "./iconInterface";

const CallIcon: React.FC<IconInterface> = ({ className, color }) => {
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
        d="M25.1419 25.1444C26.3119 23.9744 27.1939 22.6644 27.7799 21.3354C27.9039 21.0544 27.8309 20.7254 27.6139 20.5084L26.7949 19.6904C26.1239 19.0194 26.1239 18.0704 26.7099 17.4844L27.8839 16.3104C28.6649 15.5294 29.9309 15.5294 30.7119 16.3104L31.3639 16.9624C32.1049 17.7034 32.4139 18.7724 32.2139 19.8324C31.7199 22.4454 30.2019 25.3064 27.7529 27.7554C25.3039 30.2044 22.4429 31.7224 19.8299 32.2164C18.7699 32.4164 17.7009 32.1074 16.9599 31.3664L16.3089 30.7154C15.5279 29.9344 15.5279 28.6684 16.3089 27.8874L17.4819 26.7144C18.0679 26.1284 19.0179 26.1284 19.6029 26.7144L20.5059 27.6184C20.7229 27.8354 21.0519 27.9084 21.3329 27.7844C22.6619 27.1974 23.9719 26.3144 25.1419 25.1444Z"
        stroke={color || "#FB8C00"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default CallIcon;
