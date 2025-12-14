"use client";

import { IconButton, Button, Typography, Tooltip } from "@mui/material";
import Link from "next/link";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import CompanyStatus from "@/Components/common/company-status";
import { COMPANY, PRODUCT, PROFILE } from "@/lib/internal-urls";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import { saveEntityClick } from "@/Helpers/Utilities";

interface ItemChatProps {
  id: string;
  faTitle: string;
  enTitle: string;
  name: string;
  amount?: number;
  amountUnit: string;
  date?: number;
  verified?: boolean;
  isSafe?: boolean;
  subscriptionAvatar?: string | null;
  userId?: number;
  companyId?: number;
  productId?: number;
  message?: string;
  messageDate?: string;
  isAdvertise?: boolean;
  price?: number;
  priceUnit?: string;
  companyCode?: string;
}

export default function ItemChat({
  id,
  userId,
  companyId,
  companyCode,
  productId,
  faTitle,
  enTitle,
  name,
  date,
  amount,
  amountUnit,
  subscriptionAvatar,
  verified,
  isSafe,
  message,
  messageDate,
  price,
  priceUnit,
  isAdvertise = false,
}: ItemChatProps) {
  const handleProductClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (productId) await saveEntityClick(productId, EntityTypeEnum.Product);
  };

  const handleCompanyOrUserClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (companyId) await saveEntityClick(companyId, EntityTypeEnum.Company);
    else if (userId) await saveEntityClick(userId, EntityTypeEnum.User);
  };

  const handleViewItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // todo: Set click event on view item button for this item later
  };

  const mainClassName = isAdvertise
    ? "AdvertisementBG sellAdvertisement"
    : "AdvertisementBgSell buyAdvertisement";
  const mainColor = isAdvertise ? "#0D47A1" : "#007BFF";
  const btnText = isAdvertise ? "مشاهده آگهی" : "مشاهده استعلام";
  const viewUrl = isAdvertise ? `/advertise/${id}` : `/inquiries/${id}`;

  return (
    <div dir="rtl" className="row p-3 pt-2 w-100">
      <div className={`container px-0 rounded-4 p-0 ${mainClassName}`}>
        <div className="row p-4 mx-0 rtl justify-content-between item-container">
          <div
            className="col-12 row p-2 py-4 justify-content-between"
            style={{
              borderRight: `4px solid ${mainColor}`,
              backgroundColor: "rgba(255,255,255,0.7)",
            }}
          >
            <div className="col-4 mx-0 px-0 d-flex flex-column align-items-start gap-3">
              <Tooltip title={<div dir="rtl">مشاهده محصول</div>}>
                <Link
                  href={PRODUCT(productId?.toString() || "", faTitle)}
                  onClick={handleProductClick}
                  className="text-decoration-none"
                  target="_blank"
                >
                  <div className="d-flex gap-2 align-items-center">
                    <Typography variant="body1" className="fs-19 fw-500">
                      {faTitle}
                    </Typography>
                    {enTitle && (
                      <Typography className=" greyColor fs-14 fw-500">
                        ({enTitle})
                      </Typography>
                    )}
                  </div>
                </Link>
              </Tooltip>
              <Tooltip
                title={
                  <div dir="rtl">
                    {companyId ? "مشاهده شرکت" : "مشاهده پروفایل"}
                  </div>
                }
              >
                <Link
                  href={
                    companyId
                      ? COMPANY(companyCode ?? companyId.toString())
                      : PROFILE(userId + "")
                  }
                  onClick={handleCompanyOrUserClick}
                  className="text-decoration-none"
                  target="_blank"
                >
                  <Typography variant="body1" className="fs-14 fw-500">
                    {name}
                  </Typography>

                  <Typography className="d-flex gap-2 mt-2 fs-5">
                    <CompanyStatus
                      verified={verified}
                      subscriptionAvatar={subscriptionAvatar}
                      isSafe={isSafe}
                    />
                  </Typography>
                </Link>
              </Tooltip>
            </div>
            <div className="col-4 col-md-3 text-end align-self-center">
              {!isAdvertise ? (
                amount ? (
                  <>
                    {date && (
                      <Typography variant="body2" className="fs-18 fw-500">
                        {date}
                      </Typography>
                    )}
                    <Typography variant="body1" className="fs-19 fw-500">
                      {amount ? (
                        <>
                          {amount?.toLocaleString()} {amountUnit || ""}
                        </>
                      ) : (
                        "تماس بگیرید"
                      )}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" className="col-12 mt-2">
                    تماس بگیرید
                  </Typography>
                )
              ) : null}
              {isAdvertise ? (
                price ? (
                  <Typography
                    variant="body1"
                    className="col-12 mt-2 d-flex flex-column"
                  >
                    <span>
                      {amount?.toLocaleString()} {amountUnit || ""}
                    </span>
                    <span>
                      {price?.toLocaleString()} {priceUnit || ""}
                    </span>
                  </Typography>
                ) : (
                  <Typography variant="body2" className="col-12 mt-2">
                    تماس بگیرید
                  </Typography>
                )
              ) : null}
            </div>
            <div className="col-4 d-none d-md-flex align-self-center justify-content-center">
              <Button
                variant="outlined"
                className={`py-2 ${!isAdvertise ? "goldoutline" : ""}`}
                component={Link}
                href={viewUrl}
                onClick={handleViewItemClick}
                target="_blank"
              >
                {btnText}
              </Button>
            </div>
            <div className="col-2 d-flex d-md-none align-self-center justify-content-center">
              <Tooltip title={<div dir="rtl">{btnText}</div>}>
                <Link href={viewUrl} target="_blank">
                  <IconButton className="advertisementButton">
                    <NavigateBeforeIcon />
                  </IconButton>
                </Link>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="col-12 d-flex p-3 justify-content-between message-container">
          <Typography variant="body1" className="fs-14 fw-600">
            {message}
          </Typography>
          <Typography variant="body2" className="fs-12 fw-500">
            {messageDate}
          </Typography>
        </div>
      </div>
    </div>
  );
}
