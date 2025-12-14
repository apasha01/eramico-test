import { Avatar, Badge, Box, SxProps, Typography } from "@mui/material";
import TheVerifyIcon from "./the-verify-icon";
import TheSafeIcon from "./the-safe-icon";
import TheSubscriptionIcon from "./the-subscription-icon";

interface TheAvatarProp {
  name: string;
  src?: string | null;
  height?: number | null;
  width?: number | null;
  variant?: "circular" | "rounded" | "square";
  isVerified?: boolean | null;
  isSafe?: boolean | null;
  subscriptionAvatar?: string | null;
  sx?: SxProps;
}

const TheAvatar = ({
  name,
  src,
  height = 100,
  width = 100,
  sx,
  variant = "rounded",
  isVerified = false,
  isSafe = false,
  subscriptionAvatar,
}: TheAvatarProp) => {
  const hasSubscription = !!subscriptionAvatar || false;
  return (
    <div dir="rtl">
      <Badge
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          <Box
            className="d-flex gap-1 justify-content-center align-items-center"
            sx={{ mr: 2, mt: 1 }}
          >
            {isVerified && <TheVerifyIcon />}
            {isSafe && <TheSafeIcon />}
            {hasSubscription && (
              <TheSubscriptionIcon
                subscriptionAvatar={subscriptionAvatar || ""}
              />
            )}
          </Box>
        }
      >
        <Avatar
          alt={name}
          src={src || undefined}
          sx={{ width, height, ...sx ,borderRadius: variant != "circular" ? 2 : null }}
          variant={variant}
          className="border-avatar"
          slotProps={{ img: { loading: "lazy" } }}
        >
          {(!src || src === "") && name.charAt(0)}
        </Avatar>
      </Badge>
    </div>
  );
};

export default TheAvatar;
