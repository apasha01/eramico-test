import { Tooltip } from "@mui/material";
import Image from "next/image";

export default function TheSafeIcon() {
  return (
    <Tooltip title={<div dir="rtl">امن</div>}>
      <Image loading="lazy" src="/images/safe.svg" alt="امن" width={18} height={18} />
    </Tooltip>
  );
}
