"use client";

import { Avatar, Button, IconButton, Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { BiUser } from "react-icons/bi";
import ChatIcon from "@/Components/Icons/ChatIcon";
import { useState } from "react";
import CompanyModal from "./CompanyModal";
import { InfoItem } from "@/Components/common/info-item";
import { COMPANY, PROFILE } from "@/lib/internal-urls";
import { saveEntityClick } from "@/Helpers/Utilities";
import EntityTypeEnum from "@/Helpers/Enum/EntityTypeEnum";
import TheAvatar from "@/Components/common/the-avatar";

const Replies = ({ responses }: { responses: any }) => {
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [selectedReply, setSelectedReply] = useState<any>();

  return (
    <>
      {responses.length > 0 ? (
        responses.map((item: any) => (
          <div className="p-4 border radius-15 mb-4" key={item.id}>
            <div className="d-flex gap-3 align-items-start justify-content-between">
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center gap-2">
                  <Link
                    href={
                      item.companyId
                        ? COMPANY(item.companyCode ?? item.companyId)
                        : item.userId
                        ? PROFILE(item.userId)
                        : ""
                    }
                    scroll={false}
                    onClick={async () => {
                      if (item.companyId || item.userId) {
                        await saveEntityClick(
                          item.companyId ?? item.userId,
                          item.companyId
                            ? EntityTypeEnum.Company
                            : EntityTypeEnum.User
                        );
                      }
                    }}
                  >
                    <TheAvatar
                      name={item.name || item.username || "کاربر"}
                      src={item.avatar}
                      height={60}
                      width={60}
                      variant={item.companyId ? "rounded" : "circular"}
                    />
                  </Link>
                  {item.name && (
                    <Link
                      href={
                        item.companyId
                          ? COMPANY(item.companyCode ?? item.companyId)
                          : item.userId
                          ? PROFILE(item.userId)
                          : ""
                      }
                      onClick={async () => {
                        if (item.companyId || item.userId) {
                          await saveEntityClick(
                            item.companyId ?? item.userId,
                            item.companyId
                              ? EntityTypeEnum.Company
                              : EntityTypeEnum.User
                          );
                        }
                      }}
                      scroll={false}
                    >
                      <Typography variant="body1" className="fs-16 fw-500">
                        {item.name}
                      </Typography>
                    </Link>
                  )}
                  {item.username && (
                    <Typography variant="body2" className="fs-16 fw-500 ltr">
                      @{item.username}
                    </Typography>
                  )}
                  <Typography variant="body2" className="fs-14 fw-500">
                    {item.createdDate}
                  </Typography>
                </div>
                <div className="d-flex" style={{ paddingRight: "68px" }}>
                  <InfoItem
                    title="مقدار"
                    description={
                      item.amount
                        ? `${item.amount?.toLocaleString()} ${
                            item.amountUnit || ""
                          }`
                        : "تماس بگیرید"
                    }
                    extraClass="ms-3"
                  />
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-center">
                <Button
                  variant="outlined"
                  className="outline py-2 px-5 ms-3"
                  onClick={() => {
                    setSelectedReply(item);
                    setShowCompanyModal(true);
                  }}
                >
                  تماس
                </Button>
                <Tooltip title={<div dir="rtl">ارسال پیام به فروشنده</div>}>
                  <IconButton component="span" className="p-0">
                    <ChatIcon color="#0d47a1" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            {item.description && (
              <div className="d-flex" style={{ paddingRight: "68px" }}>
                <InfoItem
                  title="توضیحات"
                  description={item.description}
                  extraClass="ms-3"
                />
              </div>
            )}
          </div>
        ))
      ) : (
        <span className="text-center w-100 d-block pb-3">پاسخی یافت نشد.</span>
      )}
      {showCompanyModal && (
        <CompanyModal
          open={showCompanyModal}
          onClose={() => setShowCompanyModal(false)}
          companyId={selectedReply?.companyId}
          userId={selectedReply?.userId}
          name={selectedReply?.name}
          cellphone={selectedReply?.cellphone}
          email={selectedReply?.email}
          address={selectedReply?.address}
          avatar={selectedReply?.avatar}
          verified={selectedReply?.companyIsVerified}
          contactNumber={selectedReply?.contactNumber}
        />
      )}
    </>
  );
};

export default Replies;
