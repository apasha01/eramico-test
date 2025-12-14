import React from "react";
interface StepOneRegisterIconProps extends React.SVGProps<SVGSVGElement> {
  Color?: string;
}

const StepOneRegisterIcon: React.FC<StepOneRegisterIconProps> = ({
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
        clipPath="url(#clip0_3164_6459)"
      >
        <path d="M11.997 6.667H9.331a2.667 2.667 0 00-2.667 2.666v16A2.667 2.667 0 009.331 28h13.333a2.667 2.667 0 002.667-2.667v-16a2.667 2.667 0 00-2.667-2.667h-2.667"></path>
        <path d="M12 6.667A2.667 2.667 0 0114.667 4h2.666a2.667 2.667 0 110 5.333h-2.666A2.667 2.667 0 0112 6.667zM12 16h8M12 21.334h8"></path>
      </g>
      <defs>
        <clipPath id="clip0_3164_6459">
          <path fill={Color} d="M0 0H32V32H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );

export default StepOneRegisterIcon;
