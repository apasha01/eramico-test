import { Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";
import { GoDotFill } from "react-icons/go";

const localStyles = {
  card: {
    width: "250px",
    height: "240px",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: "8px",
    border: "1px solid #e0e0e0",
    boxShadow: "none",
  },
  media: {
    width: "100%",
    backgroundColor: "#E0E0E0",
  },
  content: {
    width: "100%",
    textAlign: "right",
    padding: "12px",
  },
};

const MediaItem = ({ id, text, image, timePast, visitCount }: any) => {
  return (
    <Card sx={localStyles.card} key={id}>
      <Image
        src={image}
        alt="تصویر رسانه"
        style={localStyles.media}
        className="pt-0"
        width={200}
         loading="lazy"
        height={140}
      />
      <CardContent sx={localStyles.content}>
        <Typography variant="subtitle1" className="fs-14" gutterBottom>
          {text}
        </Typography>
        <Typography
          variant="body2"
          className="fs-12 mt-2"
          color="textSecondary"
        >
          {timePast && (
            <>
              {timePast}
              <GoDotFill size={8} />
            </>
          )}
          {visitCount} بازدید
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MediaItem;
