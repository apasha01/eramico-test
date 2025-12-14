import React from "react";
interface StepTwoRegisterIconIconProps extends React.SVGProps<SVGSVGElement> {
  Color?: string;
}

const StepTwoRegisterIcon: React.FC<StepTwoRegisterIconIconProps> = ({
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
    clipPath="url(#clip0_3164_6466)"
  >
    <path d="M9.336 16h4v5.333h-4V16z"></path>
    <path d="M13.333 8h-8A1.333 1.333 0 004 9.333v16a1.333 1.333 0 001.333 1.334h21.334A1.333 1.333 0 0028 25.333v-16A1.334 1.334 0 0026.667 8h-8"></path>
    <path d="M13.336 5.333A1.333 1.333 0 0114.669 4h2.667a1.333 1.333 0 011.333 1.333v4a1.333 1.333 0 01-1.333 1.334h-2.667a1.333 1.333 0 01-1.333-1.334v-4zM18.664 21.334h2.667M18.664 16h5.333"></path>
  </g>
  <defs>
    <clipPath id="clip0_3164_6466">
      <path fill={Color} d="M0 0H32V32H0z"></path>
    </clipPath>
  </defs>
</svg>
  );

export default StepTwoRegisterIcon;
