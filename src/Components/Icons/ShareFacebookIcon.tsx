import React from "react";
import IconInterface from "./iconInterface";

const ShareFacebookIcon: React.FC<IconInterface> = ({ className, color }) => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="12" fill={color || "#1877F2"} />
      <path
        d="M28.9345 25.165L29.4854 21.5728H26.0388V19.2417C26.0388 18.2588 26.5203 17.301 28.0641 17.301H29.6311V14.2427C29.6311 14.2427 28.2089 14 26.8492 14C24.0107 14 22.1553 15.7204 22.1553 18.835V21.5728H19V25.165H22.1553V33.849C22.7977 33.9497 23.4469 34.0002 24.0971 34C24.7473 34.0002 25.3965 33.9497 26.0388 33.849V25.165H28.9345Z"
        fill="white"
      />
    </svg>
  );
};
export default ShareFacebookIcon;
