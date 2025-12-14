import { unstable_noStore as noStore } from "next/cache";
import React from "react";
import IndividualAdvertisement from "../IndividualBuyAdvertisement";
import { TbSpeakerphone } from "react-icons/tb/index";
import { IAPIResult } from "@/Helpers/IAPIResult";
import { notFound } from "next/navigation";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { Divider } from "@mui/material";
import { FEED_SPECIAL_OFFER } from "@/lib/urls";
import { ADVERTISE } from "@/lib/internal-urls";

interface Advertise_res extends IAPIResult<any> {}

export default async function SpecialOffer() {
  noStore();
  const response = await axiosInstance.get<Advertise_res>(FEED_SPECIAL_OFFER);

  if (response.data.success === false) {
    return notFound();
  }

  const firstThreeItems = response.data.data.map(
    (item: {
      id: number;
      companyId: number;
      userFullName: string;
      companyTitle: string;
      productTitle: string;
      productEngTitle?: string;
      amount: number;
      amountUnitPropertyTitle: string;
      price: number;
      priceUnitPropertyTitle: string;
      userIsVerified: boolean;
      companyIsVerified: boolean;
      subscriptionAvatar: string | null;
    }) => ({
      id: item.id,
      companyId: item.companyId,
      userFullName: item.userFullName,
      companyTitle: item.companyTitle,
      productTitle: item.productTitle,
      productEngTitle: item.productEngTitle,
      amount: item.amount,
      amountUnit: item.amountUnitPropertyTitle,
      price: item.price,
      priceUnit: item.priceUnitPropertyTitle,
      userIsVerified: item.userIsVerified,
      companyIsVerified: item.companyIsVerified,
      subscriptionAvatar: item.subscriptionAvatar,
    })
  );

  return (
    <section className="row px-3 pb-4">
      <div
        className="container p-0 rounded-4"
        style={{
          backgroundImage: `url(/images/SuggestionBG.svg)`,
          backgroundSize: "cover",
        }}
      >
        <h6 className="col-12 red rtl p-3 mt-1 d-flex gap-2 align-items-center justify-content-between">
          <span className="d-flex gap-2 red">
            <TbSpeakerphone className="red mirror-horizontal" size={24} />
            پیشنهاد ویژه
          </span>
        </h6>
        {firstThreeItems.map((ad: any, index: number) => (
          <React.Fragment key={ad.id}>
            <IndividualAdvertisement
              id={ad.id}
              to={ADVERTISE(ad.id.toString(), ad.productTitle)}
              faTitle={ad.productTitle}
              enTitle={ad.productEngTitle}
              name={ad.companyId ? ad.companyTitle : ad.userFullName}
              subscriptionAvatar={ad.subscriptionAvatar}
              verified={ad.companyId ? ad.companyIsVerified : ad.userIsVerified}
              Amount={ad.amount}
              Price={ad.price}
              advertismentType="special-offer"
              amountUnit={ad.amountUnit}
              priceUnit={ad.priceUnit}
            />
            {index !== 3 && <Divider />}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
