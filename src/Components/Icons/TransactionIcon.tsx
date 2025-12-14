import React from "react";

type StyleProps = {
  status: "success" | "failure" | "pending";
};

const TransactionIcon: React.FC<StyleProps> = ({ status }) => {
  if (status === "pending") {
    return (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="8" fill="#FFF4E5" />
        <circle cx="20" cy="20" r="8" stroke="#FF9800" strokeWidth="2" fill="none" />
        <line
          x1="20"
          y1="20"
          x2="20"
          y2="15"
          stroke="#FF9800"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="20"
          y1="20"
          x2="24"
          y2="22"
          stroke="#FF9800"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="40"
        height="40"
        rx="8"
        fill={status === "success" ? "#E4F9ED" : "#FFE4E3"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={
          status === "success"
            ? "M27.2559 14.4101C27.5813 14.7355 27.5813 15.2632 27.2559 15.5886L17.2559 25.5886C17.0996 25.7448 16.8877 25.8327 16.6667 25.8327C16.4457 25.8327 16.2337 25.7448 16.0774 25.5886L12.7441 22.2553C12.4186 21.9298 12.4186 21.4022 12.7441 21.0768C13.0695 20.7513 13.5971 20.7513 13.9226 21.0768L16.6667 23.8208L26.0774 14.4101C26.4028 14.0847 26.9305 14.0847 27.2559 14.4101Z"
            : "M14 14 L26 26 M26 14 L14 26" 
        }
        stroke={status === "failure" ? "#EF5350" : "none"}
        fill={status === "success" ? "#00C853" : "none"}
        strokeWidth={status === "failure" ? 2 : 0}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default TransactionIcon;
