import { Tooltip } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";



export default function TheVerifyIcon() {
  return (
    <Tooltip title={<div dir="rtl">تایید شده</div>}>
      <VerifiedIcon width={18} height={18} fontSize="inherit" color="secondary" />
    </Tooltip>
  );
}
