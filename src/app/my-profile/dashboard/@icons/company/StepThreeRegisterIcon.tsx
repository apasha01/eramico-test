import React from "react";
interface StepThreeRegisterIconProps extends React.SVGProps<SVGSVGElement> {
  Color?: string;
}

const StepThreeRegisterIcon: React.FC<StepThreeRegisterIconProps> = ({
  Color = "#BDBDBD",
  ...props
}) => (
  <svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  fill="none"
  viewBox="0 0 32 32"
>
  <g
    stroke={Color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    clipPath="url(#clip0_3164_6474)"
  >
    <path d="M14.667 25.334h-8A2.667 2.667 0 014 22.666V8a2.667 2.667 0 012.667-2.667H12l4 4h9.333A2.667 2.667 0 0128 12v3.334M20 24a4 4 0 108 0 4 4 0 00-8 0zM26.93 26.933l2.4 2.4"></path>
  </g>
  <defs>
    <clipPath id="clip0_3164_6474">
      <path fill={Color} d="M0 0H32V32H0z"></path>
    </clipPath>
  </defs>
</svg>
  );

export default StepThreeRegisterIcon;
