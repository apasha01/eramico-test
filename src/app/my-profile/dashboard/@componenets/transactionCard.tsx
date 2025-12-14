"use client";

import React, { useState } from "react";
import { Button, Typography, Chip, Stack, IconButton, Tooltip } from "@mui/material";
import TransactionIcon from "@/Components/Icons/TransactionIcon";
import Link from "next/link";
import Image from "next/image";
import UploadBankReceiptDialog from "./UploadBankReceiptDialog";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

interface TransactionData {
  id: number;
  finalPrice: number;
  date: string;
  time: string;

  status: "success" | "failure" | "pending"; // از parent بر اساس subscriptionTypeId

  bank: string;
  bankImage: any;
  title: string;

  paymentTypeTitle?: string;

  subscriptionStatusId?: number;
  subscriptionStatusIdentity?: string;
  subscriptionStatusTitle?: string;

  subscriptionTypeId?: number;

  deadlineDatePersian?: string;
}

interface TransactionCardProps {
  data: TransactionData;
  onUploaded?: () => void;
}

const formatPriceFa = (value: any) => {
  const num = Number(value);
  if (isNaN(num)) return "۰";
  return num.toLocaleString("fa-IR");
};

const isWithdrawn = (title?: string, identity?: string) => {
  const t = (title || "").trim();
  const i = (identity || "").trim().toLowerCase();
  return t.includes("منصرف") || i === "withdrawn";
};

const TransactionCard: React.FC<TransactionCardProps> = ({ data, onUploaded }) => {
  const {
    id,
    status,
    title,
    time,
    date,
    bank,
    bankImage,
    finalPrice,
    paymentTypeTitle,
    subscriptionStatusTitle,
    subscriptionStatusIdentity,
    deadlineDatePersian,
  } = data;

  const [openUpload, setOpenUpload] = useState(false);

  /**
   * «به جز منصرف شده» امکان آپلود فیش بانکی برقرار است.
   * علاوه بر آن، حتماً نوع پرداخت باید «فیش بانکی» باشد.
   */
  const canUpload =
    (paymentTypeTitle?.includes("فیش بانکی") ?? false) &&
    !isWithdrawn(subscriptionStatusTitle, subscriptionStatusIdentity);

  return (
    <>
      <div className="border rounded-4 p-2 row mx-0">
        <div className="col-4 gap-2 px-0 d-flex align-items-center">
          <TransactionIcon status={status} />
          <div className="flex flex-column">
            <Typography className="fs-14 fw-500">{title}</Typography>
            <Stack direction="row" spacing={1} className="mt-1" useFlexGap>
              {subscriptionStatusTitle && (
                <Chip size="small" label={subscriptionStatusTitle} />
              )}
              {paymentTypeTitle && (
                <Chip size="small" variant="outlined" label={paymentTypeTitle} />
              )}
            </Stack>
          </div>
        </div>

        <div className="col-3 d-flex align-items-center justify-content-center">
          <div className="flex flex-column">
            <Typography className="fs-12 fw-500 labelColor">تاریخ :</Typography>
            <Typography className="fs-14 mt-1">
              {date}{time ? ` - ${time}` : ""}
            </Typography>

            {subscriptionStatusTitle?.includes("پرداخت نشده") && (
              <div className="mt-2">
                <Typography className="fs-12 fw-500 labelColor">مهلت پرداخت:</Typography>
                <Typography className="fs-14 mt-1">{deadlineDatePersian || "-"}</Typography>
              </div>
            )}
          </div>
        </div>

        {/* شناسه درخواست + بانک (در صورت نیاز این بلوک را باز کن)
        <div className="col-2 d-flex align-items-center">
          <div className="flex flex-column">
            <Typography className="fs-12 fw-500 labelColor">شناسه درخواست:</Typography>
            <Typography className="fs-14 mt-1 d-flex gap-2 align-items-center">
              {bankImage && <Image src={bankImage} width={24} height={24} alt={bank} />}
              {id}
            </Typography>
          </div>
        </div> */}

        <div className="col-2 d-flex align-items-center justify-content-end">
          <Typography className="fs-14">{formatPriceFa(finalPrice)} تومان</Typography>
        </div>

        <div className="col-3 px-0 d-flex align-items-center justify-content-end gap-2">
          <Tooltip title="مشاهده فاکتور">
            <IconButton
              LinkComponent={Link}
              href={`/transaction/${id}`}
              aria-label="مشاهده فاکتور"
              className="goldoutline"
              size="small"
            >
              <ReceiptLongOutlinedIcon />
            </IconButton>
          </Tooltip>

          {canUpload && (
            <Button
              variant="outlined"
              color="primary"
              className="goldoutline"
              size="medium"
              onClick={() => setOpenUpload(true)}
              sx={{ borderRadius: "999px", px: 2 }}
            >
              آپلود فیش بانکی
            </Button>
          )}
        </div>
      </div>

      <UploadBankReceiptDialog
        open={openUpload}
        onClose={() => {
          setOpenUpload(false);
          onUploaded?.();
        }}
        subscriptionId={id}
      />
    </>
  );
};

export default TransactionCard;
