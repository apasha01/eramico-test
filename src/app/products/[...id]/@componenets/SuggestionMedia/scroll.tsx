import React from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import media from "../../../../../app/img/media.png";
import media2 from "../../../../../app/img/media2.png";
import { LeftArrow, RightArrow } from "./arrow";
import Image from "next/image";
import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { GoDotFill } from "react-icons/go";

const FakeData = [
  {
    id: 1,
    title: "کوتاه درباره حمل و نقل و شرایط امروز",
    visit: 10,
    date: 12,
    image: media,
  },
  {
    id: 2,
    title: "راهنمایی برای سفرهای آسان و راحت",
    visit: 15,
    date: 15,
    image: media2,
  },
  {
    id: 3,
    title: "تفاوت بین حمل و نقل عمومی و خصوصی",
    visit: 20,
    date: 20,
    image: media,
  },
  {
    id: 4,
    title: "مزایای استفاده از دوچرخه به عنوان وسیله حمل و نقل",
    visit: 25,
    date: 25,
    image: media2,
  },
  {
    id: 5,
    title: "راهنمایی برای انتخاب بهترین روش حمل و نقل عمومی",
    visit: 30,
    date: 30,
    image: media,
  },
];

function App() {
  const [items] = React.useState(FakeData);

  const styles = {
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
      height: "140px",
      paddingTop: "0px",
      backgroundColor: "#E0E0E0",
    },
    content: {
      width: "100%",
      textAlign: "right",
      padding: "12px",
    },
  };

  return (
    <div style={{ position: "relative" }}>
      <ScrollMenu
        LeftArrow={LeftArrow}
        RightArrow={RightArrow}
        options={{
          ratio: 0.9,
          rootMargin: "5px",
          threshold: [0.5, 1],
        }}
        RTL={true}
        noPolyfill={true}
      >
        {items.map(({ id, title, visit, date, image }) => (
          <Card sx={styles.card} key={id}>
            <Image src={image} alt="company's logo" loading="lazy" style={styles.media} />
            <CardContent sx={styles.content}>
              <Typography variant="subtitle1" className="fs-14" gutterBottom>
                {title}
              </Typography>
              <Typography
                variant="body2"
                className="fs-12 mt-2"
                color="textSecondary"
              >
                {"  "}
                {date} روز پیش {<GoDotFill size={8} />}
                {"  "} {visit} بازدید
              </Typography>
            </CardContent>
          </Card>
        ))}
      </ScrollMenu>
    </div>
  );
}
export default App;
