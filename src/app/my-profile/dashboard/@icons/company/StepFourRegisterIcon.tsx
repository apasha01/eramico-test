import React from "react";
interface StepFourRegisterIconProps extends React.SVGProps<SVGSVGElement> {
  Color?: string;
}

const StepFourRegisterIcon: React.FC<StepFourRegisterIconProps> = ({
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
    clipPath="url(#clip0_3164_6452)"
  >
    <path d="M6.667 9.6a2.933 2.933 0 012.934-2.933h1.333c.775 0 1.517-.307 2.067-.854l.933-.933a2.933 2.933 0 014.16 0l.933.933c.55.547 1.294.854 2.067.854h1.333A2.933 2.933 0 0125.361 9.6v1.334c0 .773.306 1.517.853 2.066l.933.934a2.934 2.934 0 010 4.16l-.933.933a2.934 2.934 0 00-.853 2.066v1.334a2.933 2.933 0 01-2.934 2.933h-1.333c-.775 0-1.518.307-2.067.854l-.933.933a2.931 2.931 0 01-4.16 0L13 26.214a2.933 2.933 0 00-2.067-.854H9.6a2.933 2.933 0 01-2.934-2.933v-1.334c0-.774-.307-1.517-.853-2.066l-.933-.934a2.933 2.933 0 010-4.16L5.814 13c.546-.55.853-1.292.853-2.066V9.6z"></path>
    <path d="M12 16l2.667 2.667L20 13.333"></path>
  </g>
  <defs>
    <clipPath id="clip0_3164_6452">
      <path fill={Color} d="M0 0H32V32H0z"></path>
    </clipPath>
  </defs>
</svg>
  );

export default StepFourRegisterIcon;
