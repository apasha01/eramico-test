import { Tooltip } from "@mui/material";
import Image from "next/image";

interface TheSubscriptionIconProps {
  subscriptionAvatar: string;
}

export default function TheSubscriptionIcon({
  subscriptionAvatar,
}: TheSubscriptionIconProps) {
  return (
    <Tooltip title={<div dir="rtl">اشتراک دارد</div>}>
      <Image loading="lazy" alt="" src={subscriptionAvatar} width={18} height={18} />
    </Tooltip>
  );
}
