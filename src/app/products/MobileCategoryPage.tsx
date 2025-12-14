import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";

import styles from "./MobileCategoryPage.module.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BoxIcon from "@/Components/Icons/BoxIcon";
import BuildingIcon from "@/Components/Icons/BuildingIcon";
import CoinIcon from "@/Components/Icons/CoinIcon";
import CurrencyIcon from "@/Components/Icons/CurrencyIcon";
import FlaskIcon from "@/Components/Icons/FlaskIcon";
import MineIcon from "@/Components/Icons/MineIcon";
import OilIcon from "@/Components/Icons/OilIcon";
import SeedIcon from "@/Components/Icons/SeedIcon";
import ShirtIcon from "@/Components/Icons/ShirtIcon";
import Link from "next/link";
import { PRODUCT } from "@/lib/internal-urls";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { saveEntityClick } from "@/Helpers/Utilities";

interface MobileCategoryPageProps {
  filteredCategories: any[];
  categoryResponse: any;
}

interface IconMapping {
  [key: string]: React.ReactNode;
}

const iconMapping: IconMapping = {
  ارز: <CurrencyIcon />,
  "سکه و فلزات گرانبها": <CoinIcon />,
  "نفت، گاز و پتروشیمی": <OilIcon />,
  "فلزات و معادن": <MineIcon />,
  "راه و ساختمان": <BuildingIcon />,
  "غذایی و کشاورزی": <SeedIcon />,
  "نساجی و پوشاک": <ShirtIcon />,
  "سلولوزی، چاپ و بسته‌بندی": <BoxIcon />,
  لاستیک: <BoxIcon />,
  "پلیمر و پلاستیک": <BoxIcon />,
  "شیمیایی و حلال‌ها": <FlaskIcon />,
  "حمل و نقل": <BoxIcon />,
  گاز: <OilIcon />,
  "فلزات گرانبها": <MineIcon />,
  "حلال ها": <FlaskIcon />,
  "محصولات پتروشیمی": <OilIcon />,
  حامیان: <CurrencyIcon />,
  // Add more mappings as needed
};

const MobileCategoryPage: React.FC<MobileCategoryPageProps> = ({
  filteredCategories,
  categoryResponse,
}) => {
  // Sidebar section with category list
  const renderSidebar = () => (
    <div className={`${styles.sidebar} rtl`}>
      <Box className={styles.categoryList}>
        {categoryResponse?.data?.data?.map((category: any) => (
          <Link key={category.id} href={`?category=${category.id}`}>
            <Button className={styles.categoryButton}>
              <div>{iconMapping[category.title]}</div>
              <div>{category.title}</div>
            </Button>
          </Link>
        ))}
      </Box>
    </div>
  );

  // Product display section
  const renderProducts = () => (
    <div className={styles.content}>
      {filteredCategories.length > 0 ? (
        filteredCategories.map(
          (item: any) =>
            item?.children &&
            item?.children?.length > 0 && (
              <div key={item.id}>
                {item.children.map((category: any) => (
                  <Accordion key={category.id} className={styles.accordion}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6" className={styles.categoryTitle}>
                        {category.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className={styles.listOfTheCardsMobile}>
                        {category.children &&
                          category.children.map((subItem: any) => (
                            <a
                              key={subItem.id}
                              href={PRODUCT(subItem.id, subItem.title)}
                              onClick={async () => {
                                await saveEntityClick(
                                  subItem.id,
                                  EntityTypeEnum.Product
                                );
                              }}
                            >
                              {subItem.title}
                            </a>
                          ))}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>
            )
        )
      ) : (
        <div className={styles.noProductContainer}>
          <Typography dir="rtl" className="fs-24 fw-500">
            متأسفانه محصولی پیدا نشد.
          </Typography>
        </div>
      )}
    </div>
  );

  // Render the sidebar and product display sections
  return (
    <div className={`${styles.mobileMainStyle} rtl`}>
      {renderSidebar()}
      {renderProducts()}
    </div>
  );
};

export default MobileCategoryPage;
