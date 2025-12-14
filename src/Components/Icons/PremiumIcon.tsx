import React from "react";
import IconInterface from "./iconInterface";

const PremiumIcon: React.FC<IconInterface> = ({ className, color }) => {
  return (
    <svg
      enableBackground="new 0 0 91.25 92.25"
      height="92.25"
      viewBox="0 0 91.25 92.25"
      width="91.25"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m65.316 62.188h.229" fill="none" />
      <path
        d="m24.403 1034.699c-1.053-.043-1.911-1.19-1.658-2.218l6.477-26.172-20.576-17.303c-.55-.453-.783-1.256-.563-1.934s.879-1.19 1.59-1.233l26.816-1.881 10.072-24.984c.26-.661.947-1.128 1.657-1.128.708 0 1.396.468 1.656 1.128l10.071 24.984 26.818 1.881c.707.051 1.356.564 1.572 1.242.215.678-.021 1.475-.566 1.926l-20.576 17.302 6.494 26.172c.17.688-.113 1.465-.688 1.879s-1.398.439-1.996.063l-22.789-14.273-22.807 14.273c-.295.189-.65.286-1.004.276z"
        fill={color}
        transform="translate(0 -952.36218)"
      />
    </svg>
  );
};
export default PremiumIcon;
