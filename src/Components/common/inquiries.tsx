"use client";

import React, { useState, useEffect } from "react";
import { Button, Divider, Typography } from "@mui/material";
import { TbMailOpened } from "react-icons/tb";
import Link from "next/link";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { INQUIRIES, INQUIRY } from "@/lib/internal-urls";
import Inquiry from "./inquiry";
import SubmitNewInquiry from "../Home/Sidebar/inquiries/submit-new-inqiry";
import LoaderComponent from "../LoaderComponent";

interface inquries_res extends IAPIResult<any> {}
interface InquiriesProps {
  url: string;
  title: string;
  disableSubmitInquiry?: boolean;
  showUsername?: boolean;
  showProduct?: boolean;
  productId?: number;
}

export default function Inquiries({
  url,
  title,
  disableSubmitInquiry,
  showUsername,
  showProduct,
  productId,
}: InquiriesProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cached = sessionStorage.getItem(url);
    if (cached) {
      setData(JSON.parse(cached));
      setLoading(false);
    }

    const fetchInquiries = async () => {
      try {
        const res = await axiosInstance.get<inquries_res>(url);
        setData(res.data.data || []);
        sessionStorage.setItem(url, JSON.stringify(res.data.data || []));
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (!cached) {
      fetchInquiries();
    }
  }, [url]);

  if (loading) {
    return <LoaderComponent />;
  }

  if (error) {
    return null;
  }

  return (
    <div
      className="container rounded-4 pb-4 mb-4 p-0"
      style={{ background: "#FB8C0008" }}
      dir="rtl"
    >
      <h6 className="col-12 gold p-3 rtl mt-1 d-flex gap-2 align-items-center justify-content-between">
        <span className="d-flex gap-2">
          <TbMailOpened className="gold" size={24} />
          {title}
        </span>
        {!disableSubmitInquiry && <SubmitNewInquiry />}
      </h6>
      {data?.length !== 0 ? (
        <>
          {data.map((ad: any, index: number) => (
            <React.Fragment key={ad.id}>
              <Inquiry
                id={ad.id}
                to={INQUIRY(ad.id.toString(), ad.productTitle)}
                amount={ad.amount}
                amountUnit={ad.amountUnitPropertyTitle}
                expirationRemained={ad.expirationRemained}
                productFaTitle={ad.productTitle}
                productEnTitle={ad.productEngTitle || ""}
                userName={ad.companyId ? ad.companyTitle : ad.userFullName}
                subscriptionAvatar={ad.subscriptionAvatar}
                verified={
                  ad.companyId ? ad.companyIsVerified : ad.userIsVerified
                }
                isSafe={ad.companyId ? ad.companyIsSafe : null}
                showProduct={showProduct}
                showUsername={showUsername}
              />
              {index != data?.length - 1 && <Divider className="mx-3" />}
            </React.Fragment>
          ))}

          {data.length > 3 && (
            <div className="col-12 pb-4 text-center">
              <Button
                variant="outlined"
                className="goldoutline"
                LinkComponent={Link}
                href={
                  productId ? `/inquiries?product=${productId}` : "/inquiries"
                }
              >
                مشاهده همه
              </Button>
            </div>
          )}
        </>
      ) : (
        <Typography dir="rtl" className="fw-500 text-center pb-3 min-w-350">
          استعلامی پیدا نشد.
        </Typography>
      )}
    </div>
  );
}
