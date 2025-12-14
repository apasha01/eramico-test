import { Typography } from "@mui/material";
import Link from "next/link";

interface InfoItemProps {
  title: string;
  description: string;
  link?: string;
  extraClass?: string;
  onClick?: () => void;
}

export const InfoItem: React.FC<InfoItemProps> = ({
  title,
  description,
  link,
  extraClass,
}) => {
  if (!description) {
    return;
  }
  return (
    <div className={`d-flex ${extraClass || ""}`} dir="rtl">
      <Typography variant="body2" className="detailTitleBoxStyle ms-2 lh-lg">
        {title}:
      </Typography>
      <Typography
        variant="body2"
        className="detailDescriptionBoxStyle text-wrap text-justify lh-lg"
      >
        {link ? <Link href={link}>{description}</Link> : description}
      </Typography>
    </div>
  );
};
