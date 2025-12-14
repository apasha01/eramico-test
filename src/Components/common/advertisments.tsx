"use client";

import React, { useState, useEffect } from "react";
import { TbSpeakerphone } from "react-icons/tb";
import Advertise from "./advertise";
import { ADVERTISE } from "@/lib/internal-urls";
import SubmitNewAdvertise from "../Home/Sidebar/Advertisements/submit-new-advertise";
import { Button, Divider, Typography } from "@mui/material";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { axiosInstance } from "@/Helpers/axiosInstance";
import LoaderComponent from "../LoaderComponent";

interface Advertise_res extends IAPIResult<any> {}
interface AdvertismentsProps {
  url: string;
  title: string;
  disableSubmitAdvertise?: boolean;
  showUsername?: boolean;
  showProduct?: boolean;
  productId?: number;
}

export default function Advertisments({
  url,
  title,
  disableSubmitAdvertise,
  showUsername,
  showProduct,
  productId,
}: AdvertismentsProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cached = sessionStorage.getItem(url);
    if (cached) {
      setData(JSON.parse(cached));
      setLoading(false);
    }
  
    const fetchAdvertisements = async () => {
      try {
        const res = await axiosInstance.get <Advertise_res>(url);
        setData(res.data.data || []);
        sessionStorage.setItem(url, JSON.stringify(res.data.data || []));
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
  
    if (!cached) {
      fetchAdvertisements();
    }
  }, [url]);
  

  if (loading) {
    return <LoaderComponent />;
  }

  if (error) {
    return null;
  }

  return (
    <div className="w-500 p-0 AdvertisementBG rounded-4 pb-4 mb-4">
      <h6 className="col-12 blue rtl p-3 mt-1 d-flex gap-2 align-items-center justify-content-between">
        <span className="d-flex gap-2 blue">
          <TbSpeakerphone className="blue mirror-horizontal" size={24} />
          {title}
        </span>
        {!disableSubmitAdvertise && <SubmitNewAdvertise />}
      </h6>
      {data.length > 0 ? (
        <>
          {data.map((ad: any, index: number) => (
            <React.Fragment key={ad.id}>
              <Advertise
                id={ad.id}
                to={ADVERTISE(ad.id.toString(), ad.productTitle)}
                productFaTitle={ad.productTitle}
                productEnTitle={ad.productEngTitle}
                userName={ad.companyId ? ad.companyTitle : ad.userFullName}
                price={ad.price}
                priceUnit={ad.priceUnitPropertyTitle}
                amountUnit={ad.amountUnitPropertyTitle}
                subscriptionAvatar={ad.subscriptionAvatar}
                verified={
                  ad.companyId ? ad.companyIsVerified : ad.userIsVerified
                }
                isSafe={ad.companyId ? ad.companyIsSafe : null}
                showUsername={showUsername}
                showProduct={showProduct}
              />
              {index !== data.length - 1 && <Divider className="mx-3" />}
            </React.Fragment>
          ))}
          {data.length > 3 && (
            <div className="col-12 pt-3 text-center">
              <Button
                variant="outlined"

                href={
                  productId ? `/advertise?product=${productId}` : "/advertise"
                }
                style={{
                  fontSize:10
                }}
                size="small"
              >
                مشاهده همه
              </Button>
            </div>
          )}
        </>
      ) : (
        <Typography dir="rtl" className="fw-500 text-center pb-3 min-w-350">
          آگهی‌ای پیدا نشد.
        </Typography>
      )}
    </div>
  );
}
